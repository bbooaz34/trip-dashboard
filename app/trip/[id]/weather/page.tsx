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

  const cur  = data?.current;
  const daily = data?.daily ?? [];
  const info = cur ? weatherCodeInfo(cur.weatherCode) : null;
  const uvPct = cur ? Math.min(100, Math.round((cur.uvIndex / 11) * 100)) : 0;

  return (
    <section>
      <div className="section-title">Weather · Titisee-Neustadt</div>
      <div className="tile">

        {/* Current conditions */}
        <div className="weather-now">
          <div className="weather-icon-big">
            <i className={`ti ${loading ? 'ti-loader' : (info?.icon ?? 'ti-cloud')}`} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="weather-temp">{cur ? `${cur.temp}°` : '—°'}</div>
            <div className="weather-desc">
              {error ? 'Weather unavailable.' : (loading ? 'Loading…' : info?.label)}
            </div>
            {data && (
              <div className="weather-updated">
                Updated {new Date(data.fetchedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="w-grid">
          <div className="w-stat">
            <div className="w-stat-icon"><i className="ti ti-droplet" /></div>
            <div className="w-stat-label">Rain today</div>
            <div className="w-stat-value">{cur ? `${daily[0]?.rainProbability ?? '—'}%` : '—'}</div>
          </div>
          <div className="w-stat">
            <div className="w-stat-icon"><i className="ti ti-sun" /></div>
            <div className="w-stat-label">UV index</div>
            <div className="w-stat-value">{cur?.uvIndex ?? '—'}</div>
            <div className="uv-bar"><div className="uv-fill" style={{ width: `${uvPct}%` }} /></div>
          </div>
          <div className="w-stat">
            <div className="w-stat-icon"><i className="ti ti-wind" /></div>
            <div className="w-stat-label">Wind</div>
            <div className="w-stat-value">{cur ? `${cur.windKmh} km/h` : '—'}</div>
          </div>
          <div className="w-stat">
            <div className="w-stat-icon"><i className="ti ti-mist" /></div>
            <div className="w-stat-label">Humidity</div>
            <div className="w-stat-value">{cur ? `${cur.humidity}%` : '—'}</div>
          </div>
        </div>

        {/* 5-day forecast */}
        {daily.length > 0 && (
          <div className="forecast">
            {daily.map((day, i) => {
              const d = new Date(day.date);
              const dayInfo = weatherCodeInfo(day.weatherCode);
              const label = i === 0 ? 'Today' : d.toLocaleDateString('en-GB', { weekday: 'short' });
              return (
                <div key={day.date} className={`f-day ${i === 0 ? 'today' : ''}`}>
                  <div className="d">{label}</div>
                  <div className="ic"><i className={`ti ${dayInfo.icon}`} /></div>
                  <div className="hi">{day.tempMax}°</div>
                  <div className="lo">{day.tempMin}°</div>
                </div>
              );
            })}
          </div>
        )}

        <button className="btn btn-ghost btn-full" onClick={load} style={{ marginTop: 16 }}>
          <i className="ti ti-refresh" />Refresh forecast
        </button>
      </div>
    </section>
  );
}
