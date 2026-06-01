'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface SettingsClientProps {
  tripId: string;
  userEmail: string;
}

export default function SettingsClient({ tripId, userEmail }: SettingsClientProps) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent]   = useState(false);
  const [inviteErr, setInviteErr]     = useState('');
  const [exporting, setExporting]     = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviteErr('');
    const res = await fetch(`/api/auth/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail.trim(), tripId }),
    });
    if (res.ok) {
      setInviteSent(true);
      setInviteEmail('');
    } else {
      const json = await res.json().catch(() => ({}));
      setInviteErr(json.error ?? 'Something went wrong.');
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  async function handleExport() {
    setExporting(true);
    const res = await fetch(`/api/export?tripId=${tripId}`);
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `black-forest-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  }

  return (
    <section>
      <div className="section-title">Settings</div>

      {/* Account info */}
      <div style={{ marginBottom: 24 }}>
        <div className="section-title" style={{ marginBottom: 8 }}>Account</div>
        <div className="tile">
          <div style={{ fontSize: 14, fontWeight: 600 }}>Signed in as</div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>{userEmail}</div>
          <button className="btn btn-ghost btn-full" onClick={handleSignOut} style={{ marginTop: 14 }}>
            <i className="ti ti-logout" />Sign out
          </button>
        </div>
      </div>

      {/* Invite */}
      <div style={{ marginBottom: 24 }}>
        <div className="section-title" style={{ marginBottom: 8 }}>Invite to trip</div>
        <div className="tile">
          {inviteSent ? (
            <div className="login-sent">
              Invitation sent! They'll get a magic link to join the trip.
            </div>
          ) : (
            <form onSubmit={handleInvite}>
              <label className="form-label" htmlFor="invite-email">Email address</label>
              <input
                id="invite-email"
                className="field"
                type="email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="partner@example.com"
                required
              />
              {inviteErr && (
                <div style={{ color: 'var(--blush-ink)', fontSize: 13, marginTop: 8, fontWeight: 600 }}>
                  {inviteErr}
                </div>
              )}
              <button className="btn btn-full" type="submit">
                <i className="ti ti-send" />Send magic link
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Export */}
      <div style={{ marginBottom: 24 }}>
        <div className="section-title" style={{ marginBottom: 8 }}>Backup</div>
        <div className="tile">
          <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5, marginBottom: 14 }}>
            Download all your trip data (groceries, notes, refuels) as a JSON file.
          </div>
          <button className="btn btn-ghost btn-full" onClick={handleExport} disabled={exporting}>
            <i className="ti ti-download" />
            {exporting ? 'Preparing…' : 'Export trip data'}
          </button>
        </div>
      </div>
    </section>
  );
}
