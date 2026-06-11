'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { VERSION_LABEL } from '@/lib/version';

type Step = 'email' | 'code';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep]       = useState<Step>('email');
  const [email, setEmail]     = useState('');
  const [code, setCode]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [cooldown, setCooldown] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

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

    router.push('/');
    router.refresh();
  }

  function changeEmail() {
    setStep('email');
    setCode('');
    setError('');
  }

  return (
    <div className="login-wrap">
      <div className="login-icon">🌲</div>
      <div className="login-title">Black Forest</div>
      <div className="login-sub">Family trip · July 2026</div>

      {step === 'email' ? (
        <form onSubmit={sendCode} style={{ width: '100%', maxWidth: 340, marginTop: 30 }}>
          <div className="field-box">
            <i className="ti ti-send" style={{ fontSize: 18, color: 'var(--label-3)' }} />
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Email address"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
            />
          </div>
          {error && <div className="err-msg">{error}</div>}
          <button className="btn btn-filled" type="submit" disabled={loading} style={{ marginTop: 16 }}>
            {loading ? 'Sending…' : 'Send sign-in code'}
          </button>
        </form>
      ) : (
        <form onSubmit={verify} style={{ width: '100%', maxWidth: 340, marginTop: 30 }}>
          <div className="login-instr">
            We sent a 6-digit code to <strong>{email}</strong>.<br />Enter it below to sign in.
          </div>
          <div className="field-box otp-input" style={{ marginTop: 16 }}>
            <input
              ref={codeRef}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              value={code}
              maxLength={6}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
          </div>
          {error && <div className="err-msg">{error}</div>}
          <button className="btn btn-filled" type="submit"
            disabled={loading || code.length < 6} style={{ marginTop: 16 }}>
            {loading ? 'Verifying…' : 'Verify & sign in'}
          </button>
          <div className="login-secondary">
            <button type="button" className="btn-link" style={{ color: 'var(--label-2)' }} onClick={changeEmail}>
              Use a different email
            </button>
            <button type="button" className="btn-link" disabled={cooldown > 0}
              onClick={() => sendCode()}>
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
            </button>
          </div>
        </form>
      )}

      <div className="login-footer">{VERSION_LABEL}</div>
    </div>
  );
}
