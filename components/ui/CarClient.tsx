'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { CarState, Refuel } from '@/lib/types';

interface CarClientProps {
  tripId: string;
  initialCar: CarState | null;
  initialRefuels: Refuel[];
}

const TANK_CAP = 60;
const DEFAULT_CONS = 7.5;

function pctColor(pct: number) {
  if (pct < 20) return { bg: 'var(--blush)', ink: 'var(--blush-ink)', arc: '#9C3838' };
  if (pct < 40) return { bg: 'var(--peach)', ink: 'var(--peach-ink)', arc: '#B5491E' };
  return { bg: 'var(--sage)', ink: 'var(--sage-ink)', arc: '#4A6B3A' };
}

function calcConsumption(refuels: Refuel[]): number | null {
  if (refuels.length < 2) return null;
  let totalL = 0, totalKm = 0;
  for (let i = 1; i < refuels.length; i++) {
    totalL  += refuels[i].liters;
    totalKm += refuels[i].odo_km - refuels[i - 1].odo_km;
  }
  return totalKm > 0 ? (totalL / totalKm) * 100 : null;
}

export default function CarClient({ tripId, initialCar, initialRefuels }: CarClientProps) {
  const [car, setCar]       = useState<CarState | null>(initialCar);
  const [refuels, setRefuels] = useState<Refuel[]>(initialRefuels);
  const [liters, setLiters] = useState('');
  const [odo, setOdo]       = useState('');
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  // Realtime subscription
  useEffect(() => {
    const ch = supabase.channel(`car:${tripId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'car_state', filter: `trip_id=eq.${tripId}` },
        payload => { if (payload.new) setCar(payload.new as CarState); })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'refuels', filter: `trip_id=eq.${tripId}` },
        payload => { if (payload.new) setRefuels(prev => [...prev, payload.new as Refuel]); })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [tripId]);

  const fuelLiters   = car?.fuel_liters ?? 45;
  const tankCap      = car?.tank_capacity_l ?? TANK_CAP;
  const currentOdo   = car?.current_odo_km ?? 0;
  const startOdo     = car?.start_odo_km ?? 0;
  const pct          = Math.max(0, Math.min(100, Math.round((fuelLiters / tankCap) * 100)));
  const avgCons      = calcConsumption(refuels);
  const consRate     = avgCons ?? DEFAULT_CONS;
  const range        = Math.round((fuelLiters / consRate) * 100);
  const kmTrip       = Math.max(0, currentOdo - startOdo);
  const colors       = pctColor(pct);
  const circ         = 263.9;
  const dashOffset   = circ - (circ * pct / 100);

  async function handleRefuel() {
    const l   = parseFloat(liters);
    const km  = parseFloat(odo);
    if (isNaN(l) || isNaN(km) || l <= 0 || km < 0) return;
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    // Insert refuel row
    await supabase.from('refuels').insert({
      trip_id: tripId,
      liters: l,
      odo_km: km,
      created_by: user.id,
    });

    // Update car state
    const newFuel = Math.min(tankCap, Math.max(0, fuelLiters) + l);
    const newOdo  = Math.max(currentOdo, km);
    const newStart = startOdo === 0 && refuels.length === 0 ? Math.max(0, km - 50) : startOdo;

    await supabase.from('car_state').upsert({
      trip_id: tripId,
      tank_capacity_l: tankCap,
      fuel_liters: newFuel,
      start_odo_km: newStart,
      current_odo_km: newOdo,
      updated_at: new Date().toISOString(),
    });

    setLiters('');
    setOdo('');
    setSaving(false);
  }

  return (
    <section>
      <div className="section-title-row">
        <div className="section-title" style={{ margin: 0 }}>Rental car</div>
        <span className="tile-chip" style={{ background: colors.bg, color: colors.ink }}>
          {pct}%
        </span>
      </div>

      <div className="tile">
        <div className="tile-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="tile-icon-wrap" style={{ background: 'var(--sage)', color: 'var(--sage-ink)' }}>
              <i className="ti ti-car" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>Volkswagen Tiguan</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 600 }}>Booking.com rental</div>
            </div>
          </div>
        </div>

        {/* Fuel gauge */}
        <div className="tank-section">
          <svg className="tank-vis" viewBox="0 0 100 100" role="img" aria-label={`Fuel: ${pct}%`}>
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke={colors.arc} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={dashOffset}
              transform="rotate(-90 50 50)"
            />
            <text x="50" y="57" textAnchor="middle" fontSize="22" fontWeight="700" fill="#1A1A1A" fontFamily="Plus Jakarta Sans">
              {pct}%
            </text>
          </svg>
          <div className="tank-info">
            <div className="row"><span className="lbl">Fuel level</span><span className="val">{fuelLiters.toFixed(1)} / {tankCap} L</span></div>
            <div className="row"><span className="lbl">Odometer</span><span className="val">{currentOdo.toLocaleString()} km</span></div>
            <div className="row"><span className="lbl">Range est.</span><span className="val">{range.toLocaleString()} km</span></div>
          </div>
        </div>

        <div className="stat-pair">
          <div className="stat-mini">
            <div className="stat-mini-label">Trip distance</div>
            <div className="stat-mini-value">{kmTrip.toLocaleString()}<span className="stat-mini-unit">km</span></div>
          </div>
          <div className="stat-mini">
            <div className="stat-mini-label">Consumption</div>
            <div className="stat-mini-value">{avgCons !== null ? avgCons.toFixed(1) : '—'}<span className="stat-mini-unit">L/100km</span></div>
          </div>
        </div>

        {/* Voucher */}
        <div className="voucher">
          <div className="voucher-head">
            <div className="voucher-title"><i className="ti ti-ticket" />Booking.com voucher</div>
          </div>
          <div className="voucher-body">Tap to view pickup details, insurance, and rental contact info.</div>
          <a
            href="https://cars.booking.com/voucher/byIC8Z7yiHIZWEaL6OHPnJ_wXnEKQpK-cCkjPjYHosAoA19xfZWm0n1wgSx6LN0JkXqXOIiY6GzNNMrSpNdCa8bZHOmqWWXraG5LZdjaZgeckNmitpbLhdnT3jTo16Fqw-PNRROmGojuGa3D-vabCA"
            target="_blank"
            rel="noopener noreferrer"
            className="voucher-link"
          >
            <i className="ti ti-file-text" />Open voucher
          </a>
        </div>

        {/* Refuel form */}
        <div className="form-block">
          <label className="form-label">Log a refuel</label>
          <div className="form-grid">
            <input
              className="field" type="number" placeholder="Liters"
              value={liters} onChange={e => setLiters(e.target.value)}
              min="0" step="0.1" inputMode="decimal"
            />
            <input
              className="field" type="number" placeholder="Odometer (km)"
              value={odo} onChange={e => setOdo(e.target.value)}
              min="0" step="1" inputMode="numeric"
            />
          </div>
          <button className="btn btn-full" onClick={handleRefuel} disabled={saving}>
            <i className="ti ti-plus" />
            {saving ? 'Saving…' : 'Add refuel'}
          </button>

          {/* Log */}
          <div className="log-list">
            {refuels.length === 0 ? (
              <div className="empty-block" style={{ padding: '14px 4px' }}>No refuels logged yet.</div>
            ) : (
              [...refuels].reverse().map(r => (
                <div key={r.id} className="log-row">
                  <span className="date">
                    {new Date(r.refueled_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </span>
                  <span className="liters">+{r.liters.toFixed(1)} L</span>
                  <span className="odo">{r.odo_km.toLocaleString()} km</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
