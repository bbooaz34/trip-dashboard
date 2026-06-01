'use client';

interface TopBarProps {
  email?: string;
}

export default function TopBar({ email }: TopBarProps) {
  const initials = email
    ? email.slice(0, 2).toUpperCase()
    : 'BF';

  return (
    <header className="topbar">
      <div>
        <div className="topbar-greet">Welcome back</div>
        <div className="topbar-name">Black Forest crew</div>
      </div>
      <div className="avatar" title={email}>{initials}</div>
    </header>
  );
}
