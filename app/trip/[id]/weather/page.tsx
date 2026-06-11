'use client';

import { useEffect, useState } from 'react';
import { fetchWeather, weatherCodeInfo, type WeatherData } from '@/lib/openmeteo';

export default function WeatherPage() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const w = await fetchWeather();
      setData(w);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 30 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const cur   = data?.current;
  const daily = data?.daily ?? [];
  const info  = cur ? weatherCodeInfo(cur.weatherCode) : null;

  const allTemps = daily.flatMap(d => [d.tempMax, d.tempMin]);
  const minT = allTemps.length ? Math.min(...allTemps) : 0;
  const maxT = allTemps.length ? Math.max(...allTemps) : 1;

  const uvPct = cur ? Math.min(100, Math.round((cur.uvIndex / 11) * 100)) : 0;

  const updatedLabel = data
    ? `Updated ${new Date(data.fetchedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
    : '';

  return (
    <>
      <div className="large-title">
        <h1>Weather</h1>
        <div className="lt-sub">Titisee-Neustadt</div>
      </div>

      {/* Hero */}
      <div className="wx-hero">
        <div className="wx-loc">Titisee-Neustadt</div>
        <div className="wx-temp tnum">{cur ? `${cur.temp}°` : '—°'}</div>
        <div className="wx-desc">
          <i className={`ti ${loading ? 'ti-loader-2' : (info?.icon ?? 'ti-cloud')}`}
             style={loading ? { animation: 'spin 0.9s linear infinite' } : undefined} />
          {' '}{error ? 'Weather unavailable.' : (loading ? 'Loading…' : info?.label)}
        </div>
        {daily[0] && (
          <div className="wx-hilo tnum">H:{daily[0].tempMax}° L:{daily[0].tempMin}°</div>
        )}
        {updatedLabel && <div className="wx-updated">{updatedLabel}</div>}
      </div>

      {/* Stats grid */}
      <div className="wx-grid">
        <div className="wx-tile">
          <div className="wx-tile-head"><i className="ti ti-droplet" /> Rain today</div>
          <div className="wx-tile-value tnum">{daily[0]?.rainProbability ?? '—'}<span className="unit">%</span></div>
        </div>
        <div className="wx-tile">
          <div className="wx-tile-head"><i className="ti ti-sun" /> UV index</div>
          <div className="wx-tile-value tnum">{cur?.uvIndex ?? '—'}</div>
          <div className="uv-bar">
            <span className="uv-knob" style={{ left: `${uvPct}%` }} />
          </div>
        </div>
        <div className="wx-tile">
          <div className="wx-tile-head"><i className="ti ti-wind" /> Wind</div>
          <div className="wx-tile-value tnum">{cur ? cur.windKmh : '—'}<span className="unit"> km/h</span></div>
        </div>
        <div className="wx-tile">
          <div className="wx-tile-head"><i className="ti ti-mist" /> Humidity</div>
          <div className="wx-tile-value tnum">{cur ? cur.humidity : '—'}<span className="unit">%</span></div>
        </div>
      </div>

      {/* 5-day forecast */}
      {daily.length > 0 && (
        <div className="group">
          <div className="group-header">5-day forecast</div>
          <div className="card">
            {daily.map((day, i) => {
              const d = new Date(day.date);
              const dayInfo = weatherCodeInfo(day.weatherCode);
              const label = i === 0 ? 'Today' : d.toLocaleDateString('en-GB', { weekday: 'short' });
              const isSun = dayInfo.icon === 'ti-sun' || dayInfo.icon === 'ti-sun-low';
              const isRain = dayInfo.icon.includes('rain') || dayInfo.icon.includes('storm');
              const iconCls = isSun ? ' sun' : isRain ? ' rain' : '';
              const leftPct  = maxT > minT ? ((day.tempMin - minT) / (maxT - minT)) * 100 : 0;
              const widthPct = maxT > minT ? ((day.tempMax - day.tempMin) / (maxT - minT)) * 100 : 50;
              return (
                <div key={day.date} className="fc-row">
                  <span className="fc-day">{label}</span>
                  <span className={`fc-ico${iconCls}`}><i className={`ti ${dayInfo.icon}`} /></span>
                  <span className="fc-lo tnum">{day.tempMin}°</span>
                  <span className="fc-track">
                    <span className="fc-fill" style={{ left: `${leftPct}%`, width: `${widthPct}%` }} />
                  </span>
                  <span className="fc-hi tnum">{day.tempMax}°</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ padding: '16px 16px 0' }}>
        <button className="btn btn-gray" onClick={load} disabled={loading}>
          <i className="ti ti-refresh" /> {loading ? 'Refreshing…' : 'Refresh forecast'}
        </button>
      </div>
    </>
  );
}
