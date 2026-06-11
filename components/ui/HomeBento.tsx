'use client';

import Link from 'next/link';
import WeatherQuickTile from './WeatherQuickTile';

interface HomeBentoProps {
  tripId: string;
  grocOpen: number;
  shopOpen: number;
  notePreview: string;
  fuelPct: number;
}

// Countdown to 6 Jul 2026
function useCountdown() {
  const tripDate = new Date('2026-07-06T00:00:00');
  const now = new Date();
  const diff = tripDate.getTime() - now.getTime();
  if (diff <= 0) return { num: 0, label: 'days to go' };
  const days = Math.floor(diff / 86400000);
  if (days > 0) return { num: days, label: days === 1 ? 'day to go' : 'days to go' };
  const hours = Math.floor(diff / 3600000);
  return { num: hours, label: hours === 1 ? 'hour to go' : 'hours to go' };
}

export default function HomeBento({
  tripId,
  grocOpen,
  shopOpen,
  notePreview,
  fuelPct,
}: HomeBentoProps) {
  const base = `/trip/${tripId}`;
  const cd = useCountdown();

  const fuelChip =
    fuelPct >= 40 ? 'chip-green' :
    fuelPct >= 20 ? 'chip-orange' :
    'chip-red';

  const fuelRange = Math.round((fuelPct / 100) * 650);

  const noteText = notePreview
    ? (notePreview.length > 110 ? notePreview.slice(0, 110) + '…' : notePreview)
    : 'Nothing yet — tap to write your first note.';

  return (
    <>
      {/* Large title */}
      <div className="large-title">
        <h1>Black Forest</h1>
        <div className="lt-sub">Titisee-Neustadt · base camp</div>
      </div>

      {/* Hero countdown */}
      <div className="hero">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="hero-eyebrow">Family road trip</div>
          <div className="hero-title">Black Forest</div>
          <div className="hero-dates">Mon 6 Jul → Mon 13 Jul · 7 days</div>
        </div>
        <div className="hero-count">
          <div className="hero-cd-num tnum">{cd.num}</div>
          <div className="hero-cd-lbl">{cd.label}</div>
        </div>
      </div>

      {/* Widgets grid */}
      <div className="widgets" style={{ marginTop: 14 }}>

        {/* Weather */}
        <Link href={`${base}/weather`} style={{ display: 'contents' }}>
          <WeatherQuickTile />
        </Link>

        {/* Fuel */}
        <Link href={`${base}/car`} className="widget" style={{ textDecoration: 'none' }}>
          <div className="wg-head">
            <i className="ti ti-gas-station" style={{ fontSize: 16, color: 'var(--green)' }} />
            <span className="wg-label">Tiguan</span>
            <span className={`wg-chip ${fuelChip}`}>{fuelRange} km</span>
          </div>
          <div className="wg-big tnum">{fuelPct}%</div>
          <div className="wg-sub">tap to update</div>
        </Link>

        {/* Next flight */}
        <Link href={`${base}/flights`} className="widget widget-wide" style={{ textDecoration: 'none' }}>
          <div className="wg-head">
            <i className="ti ti-plane-departure" style={{ fontSize: 16, color: 'var(--tint)' }} />
            <span className="wg-label">Next departure</span>
            <span className="wg-chip">EL AL LY357</span>
          </div>
          <div className="wfl-route">
            <span className="wfl-iata">TLV</span>
            <span className="wfl-arrow">→</span>
            <span className="wfl-iata">FRA</span>
          </div>
          <div className="wfl-times">
            <div className="wfl-t"><div className="l">Dep</div><div className="v tnum">09:30</div></div>
            <div className="wfl-t"><div className="l">Arr</div><div className="v tnum">13:05</div></div>
            <div className="wfl-t"><div className="l">Duration</div><div className="v tnum">4h 35m</div></div>
            <div className="wfl-t"><div className="l">Date</div><div className="v">Mon 6 Jul</div></div>
          </div>
        </Link>

        {/* Map */}
        <Link href={`${base}/map`} className="widget widget-wide" style={{ textDecoration: 'none', paddingBottom: 14 }}>
          <div className="wg-head" style={{ marginBottom: 10 }}>
            <i className="ti ti-map-2" style={{ fontSize: 16, color: '#2E8B57' }} />
            <span className="wg-label">Trip map</span>
            <span className="wg-chip">12 stops</span>
          </div>
          <div className="wmap-preview">
            <span className="wmap-pin" style={{ left: '50%', top: '50%', background: '#2E8B57', width: 12, height: 12 }} />
          </div>
        </Link>

        {/* Groceries */}
        <Link href={`${base}/groceries`} className="widget" style={{ textDecoration: 'none' }}>
          <div className="wg-head">
            <i className="ti ti-shopping-cart" style={{ fontSize: 16, color: 'var(--orange)' }} />
            <span className="wg-label">Groceries</span>
          </div>
          <div className="wg-big tnum">{grocOpen}</div>
          <div className="wg-sub">items to buy</div>
        </Link>

        {/* Frankfurt */}
        <Link href={`${base}/frankfurt`} className="widget" style={{ textDecoration: 'none' }}>
          <div className="wg-head">
            <i className="ti ti-building-store" style={{ fontSize: 16, color: 'var(--indigo)' }} />
            <span className="wg-label">Frankfurt</span>
          </div>
          <div className="wg-big tnum">{shopOpen}</div>
          <div className="wg-sub">items to buy</div>
        </Link>

      </div>

      {/* Notes group */}
      <div className="group" style={{ marginTop: 8 }}>
        <div className="group-header">Latest note</div>
        <div className="card">
          <Link href={`${base}/notes`} className="row has-icon" style={{ textDecoration: 'none' }}>
            <span className="row-icon bg-yellow"><i className="ti ti-notes" /></span>
            <span className="row-body">
              <span className="row-title" style={{ display: 'block' }}>{noteText}</span>
            </span>
            <span className="chevron"><i className="ti ti-chevron-right" /></span>
          </Link>
        </div>
      </div>
    </>
  );
}
