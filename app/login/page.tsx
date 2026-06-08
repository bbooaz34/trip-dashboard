'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { VERSION_LABEL } from '@/lib/version';

type Step = 'email' | 'code';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  // Resend cooldown timer (Supabase allows one code request per 60s).
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Focus the code field when we move to the code step.
  useEffect(() => {
    if (step === 'code') codeRef.current?.focus();
  }, [step]);

  async function sendCode(e?: React.FormEvent) {
    e?.preventDefault();
    const addr = email.trim();
    if (!addr || loading || cooldown > 0) return;
    setLoading(true);
    setError('');

    const { error: err } = await supabase.auth.signInWithOtp({
      email: addr,
      options: { shouldCreateUser: true },
    });

    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setStep('code');
      setCooldown(60);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    const token = code.trim();
    if (token.length < 6 || loading) return;
    setLoading(true);
    setError('');

    const { error: err } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token,
      type: 'email',
    });

    if (err) {
      setLoading(false);
      setError(err.message);
      return;
    }

    // Session is now set in cookies — route to the app (server resolves the trip).
    router.push('/');
    router.refresh();
  }

  function changeEmail() {
    setStep('email');
    setCode('');
    setError('');
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌲</div>
          <div className="login-title">Black Forest</div>
          <div className="login-sub">Family trip · July 2026</div>
        </div>

        {step === 'email' ? (
          <form onSubmit={sendCode}>
            <label className="form-label" htmlFor="email">
              Your email address
            </label>
            <input
              id="email"
              className="field"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
              required
            />
            {error && (
              <div style={{ color: 'var(--blush-ink)', fontSize: 13, marginTop: 8, fontWeight: 600 }}>
                {error}
              </div>
            )}
            <button
              className="btn btn-full"
              type="submit"
              disabled={loading}
              style={{ marginTop: 16 }}
            >
              <i className="ti ti-send" />
              {loading ? 'Sending…' : 'Send sign-in code'}
            </button>
          </form>
        ) : (
          <form onSubmit={verify}>
            <div className="login-sub" style={{ marginBottom: 16 }}>
              We sent a 6-digit code to <strong>{email}</strong>. Enter it below.
            </div>
            <label className="form-label" htmlFor="code">
              Sign-in code
            </label>
            <input
              ref={codeRef}
              id="code"
              className="field"
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              style={{ letterSpacing: 6, fontSize: 20, textAlign: 'center' }}
              required
            />
            {error && (
              <div style={{ color: 'var(--blush-ink)', fontSize: 13, marginTop: 8, fontWeight: 600 }}>
                {error}
              </div>
            )}
            <button
              className="btn btn-full"
              type="submit"
              disabled={loading || code.length < 6}
              style={{ marginTop: 16 }}
            >
              <i className="ti ti-login" />
              {loading ? 'Verifying…' : 'Verify & sign in'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 13 }}>
              <button
                type="button"
                onClick={changeEmail}
                style={{ background: 'none', border: 'none', color: 'var(--ink-soft, #888)', cursor: 'pointer', padding: 0 }}
              >
                ← Use a different email
              </button>
              <button
                type="button"
                onClick={() => sendCode()}
                disabled={cooldown > 0 || loading}
                style={{ background: 'none', border: 'none', color: cooldown > 0 ? 'var(--ink-soft, #aaa)' : 'var(--sage-ink, #4A6B3A)', cursor: cooldown > 0 ? 'default' : 'pointer', padding: 0, fontWeight: 600 }}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
              </button>
            </div>
          </form>
        )}

        <div style={{ marginTop: 24, fontSize: 11, opacity: 0.5, textAlign: 'center' }}>
          {VERSION_LABEL}
        </div>
      </div>
    </div>
  );
}
