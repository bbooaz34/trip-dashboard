'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Tab {
  href: string;
  icon: string;
  label: string;
  match: string; // pathname must include this to be "active"
}

interface BottomTabBarProps {
  tripId: string;
}

export default function BottomTabBar({ tripId }: BottomTabBarProps) {
  const pathname = usePathname();
  const base = `/trip/${tripId}`;

  const tabs: Tab[] = [
    { href: base,                 icon: 'ti-home',       label: 'Home',     match: `${base}` },
    { href: `${base}/flights`,    icon: 'ti-plane',      label: 'Flights',  match: '/flights' },
    { href: `${base}/car`,        icon: 'ti-car',        label: 'Car',      match: '/car' },
    { href: `${base}/weather`,    icon: 'ti-cloud',      label: 'Weather',  match: '/weather' },
    { href: `${base}/groceries`,  icon: 'ti-list-check', label: 'Lists',    match: '/groceries' },
    { href: `${base}/map`,        icon: 'ti-map',        label: 'Map',      match: '/map' },
  ];

  function isActive(tab: Tab) {
    if (tab.match === base) {
      // Home tab — only exact match
      return pathname === base;
    }
    return pathname.includes(tab.match);
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {tabs.map(tab => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`nav-btn ${isActive(tab) ? 'active' : ''}`}
          >
            <i className={`ti ${tab.icon}`} />
            <span>{tab.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
