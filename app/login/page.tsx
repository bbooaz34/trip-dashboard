'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌲</div>
          <div className="login-title">Black Forest</div>
          <div className="login-sub">Family trip · July 2026</div>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit}>
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
              {loading ? 'Sending…' : 'Send magic link'}
            </button>
          </form>
        ) : (
          <div className="login-sent">
            <strong>Check your inbox.</strong><br />
            We sent a sign-in link to <strong>{email}</strong>. Tap it on any device to open the app.
          </div>
        )}
      </div>
    </div>
  );
}
