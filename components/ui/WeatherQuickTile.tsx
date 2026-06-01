'use client';

import { useEffect, useState } from 'react';
import { fetchWeather, weatherCodeInfo } from '@/lib/openmeteo';
import { cacheGet, cacheSet } from '@/lib/localCache';

export default function WeatherQuickTile() {
  const [temp, setTemp] = useState<number | null>(null);
  const [desc, setDesc] = useState('Loading…');
  const [icon, setIcon] = useState('ti-cloud');

  useEffect(() => {
    // Hydrate from cache immediately
    const cached = cacheGet('weather', null as { temp: number; desc: string; icon: string } | null);
    if (cached) {
      setTemp(cached.temp);
      setDesc(cached.desc);
      setIcon(cached.icon);
    }

    // Then fetch fresh
    fetchWeather().then(data => {
      const info = weatherCodeInfo(data.current.weatherCode);
      setTemp(data.current.temp);
      setDesc(info.label);
      setIcon(info.icon);
      cacheSet('weather', { temp: data.current.temp, desc: info.label, icon: info.icon });
    }).catch(() => {
      if (!cached) setDesc('Unavailable');
    });
  }, []);

  return (
    <div className="tile tile-color tile-sky">
      <div className="tile-head">
        <div className="tile-icon-wrap">
          <i className={`ti ${icon}`} />
        </div>
      </div>
      <div className="tile-label">Now in Titisee</div>
      <div className="tile-value">{temp !== null ? `${temp}°` : '—°'}</div>
      <div className="tile-sub">{desc}</div>
    </div>
  );
}
