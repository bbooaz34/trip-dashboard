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

export default function HomeBento({
  tripId,
  grocOpen,
  shopOpen,
  notePreview,
  fuelPct,
}: HomeBentoProps) {
  const base = `/trip/${tripId}`;

  const fuelColor =
    fuelPct < 20 ? 'tile-blush' :
    fuelPct < 40 ? 'tile-peach' :
    'tile-sage';

  const noteText = notePreview
    ? (notePreview.length > 110 ? notePreview.slice(0, 110) + '…' : notePreview)
    : 'Nothing yet — tap to write your first note.';

  return (
    <section>
      <div className="section-title">At a glance</div>
      <div className="bento">

        {/* Weather */}
        <WeatherQuickTile />

        {/* Fuel */}
        <Link href={`${base}/car`} className={`tile tile-color ${fuelColor}`} style={{ textDecoration: 'none' }}>
          <div className="tile-head">
            <div className="tile-icon-wrap"><i className="ti ti-gas-station" /></div>
          </div>
          <div className="tile-label">Tiguan fuel</div>
          <div className="tile-value">{fuelPct}%</div>
          <div className="tile-sub">tap to update</div>
        </Link>

        {/* Next flight */}
        <Link href={`${base}/flights`} className="tile tile-wide tile-color tile-lilac" style={{ textDecoration: 'none' }}>
          <div className="tile-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="tile-icon-wrap"><i className="ti ti-plane" /></div>
              <div>
                <div className="tile-label" style={{ opacity: 0.65 }}>Next flight</div>
                <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.3px' }}>TLV → FRA · Mon 6 Jul</div>
              </div>
            </div>
            <div className="tile-chip">EL AL · LY357</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px dashed rgba(91,72,132,0.25)' }}>
            <div>
              <div style={{ fontSize: 11, opacity: 0.65, fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase' }}>Departure</div>
              <div style={{ fontSize: 18, fontWeight: 800, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>06:05</div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.7 }}>4h 35m</div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, opacity: 0.65, fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase' }}>Arrival</div>
              <div style={{ fontSize: 18, fontWeight: 800, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>09:40</div>
            </div>
          </div>
        </Link>

        {/* Map tile — links to new map page */}
        <Link href={`${base}/map`} className="tile tile-wide map-tile" style={{ cursor: 'pointer' }}>
          <div className="map-tile-head">
            <div>
              <div className="tile-label" style={{ color: 'var(--ink-3)' }}>Our trip map</div>
              <div className="tile-value-sm" style={{ marginTop: 2 }}>21 stops · 11 layers</div>
            </div>
            <div className="tile-chip">Tap to explore</div>
          </div>
          <div style={{
            background: 'var(--surface-soft)',
            height: 140,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, color: 'var(--ink-3)', fontSize: 13, fontWeight: 600,
          }}>
            <i className="ti ti-map-2" style={{ fontSize: 28 }} />
            Open live map
          </div>
        </Link>

        {/* Groceries */}
        <Link href={`${base}/groceries`} className="tile tile-color tile-butter" style={{ textDecoration: 'none' }}>
          <div className="tile-head">
            <div className="tile-icon-wrap"><i className="ti ti-shopping-cart" /></div>
          </div>
          <div className="tile-label">Groceries</div>
          <div className="tile-value">{grocOpen}</div>
          <div className="tile-sub">items to buy</div>
        </Link>

        {/* Frankfurt */}
        <Link href={`${base}/frankfurt`} className="tile tile-color tile-blush" style={{ textDecoration: 'none' }}>
          <div className="tile-head">
            <div className="tile-icon-wrap"><i className="ti ti-building-store" /></div>
          </div>
          <div className="tile-label">Frankfurt</div>
          <div className="tile-value">{shopOpen}</div>
          <div className="tile-sub">items to buy</div>
        </Link>

        {/* Notes preview */}
        <Link href={`${base}/notes`} className="tile tile-wide" style={{ cursor: 'pointer', textDecoration: 'none' }}>
          <div className="tile-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="tile-icon-wrap"><i className="ti ti-notes" /></div>
              <div className="tile-label" style={{ color: 'var(--ink-3)' }}>Latest note</div>
            </div>
            <div className="tile-chip">Tap to edit</div>
          </div>
          <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5, fontWeight: 500 }}>
            {noteText}
          </div>
        </Link>

      </div>
    </section>
  );
}
