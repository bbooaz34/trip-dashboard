'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { StopCategory } from '@/lib/types';
import { CATEGORY_COLOR, CATEGORY_LABEL, haversineKm, formatDistance, googleMapsUrl, wazeUrl } from '@/lib/stops';

// Types
interface StopFeature {
  id: string;
  name: string;
  category: StopCategory;
  lat: number;
  lng: number;
  description_html: string;
  position: number;
}

interface SelectedStop extends StopFeature {
  distanceKm: number | null;
}

const BASE_LAT = 47.89839;
const BASE_LNG = 8.155613;

export default function MapView({ tripId: _tripId }: { tripId: string }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null); // maplibre-gl Map instance
  const watchRef = useRef<number | null>(null);
  const userMarkerRef = useRef<any>(null);

  const [selected, setSelected] = useState<SelectedStop | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [locError, setLocError] = useState(false);
  const [locating, setLocating] = useState(false);

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let map: any;

    // Dynamic import to avoid SSR issues
    import('maplibre-gl').then(({ default: maplibregl }) => {
      const key = process.env.NEXT_PUBLIC_MAPTILER_KEY ?? 'no-key';

      map = new maplibregl.Map({
        container: mapContainerRef.current!,
        style: `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${key}`,
        center: [BASE_LNG, BASE_LAT],
        zoom: 11,
        attributionControl: false,
      });

      mapRef.current = map;

      map.on('load', () => {
        // Load stops GeoJSON
        fetch('/stops.geojson')
          .then(r => r.json())
          .then(geojson => {
            map.addSource('stops', { type: 'geojson', data: geojson });

            // Circle layer per category
            const categories: StopCategory[] = [
              'base', 'waterfall', 'lake', 'mountain', 'city',
              'kids', 'museum', 'food', 'church', 'parking', 'nature',
            ];

            const colorExpr: any[] = ['match', ['get', 'category']];
            categories.forEach(cat => colorExpr.push(cat, CATEGORY_COLOR[cat]));
            colorExpr.push('#888888'); // fallback

            const radiusExpr: any[] = ['match', ['get', 'category'],
              'base', 14,
              12,
            ];

            map.addLayer({
              id: 'stops-circles',
              type: 'circle',
              source: 'stops',
              paint: {
                'circle-radius': radiusExpr,
                'circle-color': colorExpr,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
              },
            });

            // Label layer
            map.addLayer({
              id: 'stops-labels',
              type: 'symbol',
              source: 'stops',
              layout: {
                'text-field': ['get', 'name'],
                'text-font': ['Open Sans Regular'],
                'text-size': 10,
                'text-offset': [0, 1.5],
                'text-anchor': 'top',
                'text-max-width': 10,
              },
              paint: {
                'text-color': '#1A1A1A',
                'text-halo-color': '#ffffff',
                'text-halo-width': 1.5,
              },
              minzoom: 10,
            });

            // Click handler
            map.on('click', 'stops-circles', (e: any) => {
              const props = e.features[0].properties;
              const coords = e.features[0].geometry.coordinates;
              const stopLat = coords[1];
              const stopLng = coords[0];
              const distKm = userPos
                ? haversineKm(userPos.lat, userPos.lng, stopLat, stopLng)
                : null;

              setSelected({
                id: props.id,
                name: props.name,
                category: props.category,
                lat: stopLat,
                lng: stopLng,
                description_html: props.description_html,
                position: props.position,
                distanceKm: distKm,
              });
            });

            map.on('mouseenter', 'stops-circles', () => {
              map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', 'stops-circles', () => {
              map.getCanvas().style.cursor = '';
            });
          });
      });
    });

    return () => {
      if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
      map?.remove();
    };
  }, []);

  // Update user marker when position changes
  useEffect(() => {
    if (!mapRef.current || !userPos) return;
    import('maplibre-gl').then(({ default: maplibregl }) => {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLngLat([userPos.lng, userPos.lat]);
      } else {
        const el = document.createElement('div');
        el.style.cssText = `
          width: 18px; height: 18px; border-radius: 50%;
          background: #2C5878; border: 3px solid white;
          box-shadow: 0 0 0 4px rgba(44,88,120,0.25);
        `;
        userMarkerRef.current = new maplibregl.Marker({ element: el })
          .setLngLat([userPos.lng, userPos.lat])
          .addTo(mapRef.current);
      }
    });
  }, [userPos]);

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      setLocError(true);
      return;
    }
    setLocating(true);
    setLocError(false);

    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserPos({ lat, lng });
        setLocating(false);
        mapRef.current?.flyTo({ center: [lng, lat], zoom: 13 });

        // Start watching
        if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
        watchRef.current = navigator.geolocation.watchPosition(
          p => setUserPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
          () => {},
          { enableHighAccuracy: true },
        );
      },
      () => {
        setLocating(false);
        setLocError(true);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  return (
    <>
      {/* Full-screen map container — fills space above bottom tab bar */}
      <div
        ref={mapContainerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 'calc(76px + env(safe-area-inset-bottom))',
          zIndex: 0,
        }}
      />

      {/* Locate-me button */}
      <button
        className="map-locate-btn"
        onClick={handleLocate}
        aria-label="Locate me"
        title="Show my location"
        style={{ position: 'fixed', bottom: 'calc(96px + env(safe-area-inset-bottom))', right: 16, zIndex: 10 }}
      >
        <i className={`ti ${locating ? 'ti-loader' : 'ti-current-location'}`} />
      </button>

      {/* Location error toast */}
      {locError && (
        <div style={{
          position: 'fixed',
          top: 'calc(env(safe-area-inset-top) + 80px)',
          left: '50%', transform: 'translateX(-50%)',
          background: 'var(--surface)',
          padding: '10px 16px', borderRadius: 999,
          fontSize: 13, fontWeight: 600, color: 'var(--ink-2)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          zIndex: 20, whiteSpace: 'nowrap',
        }}>
          Location blocked — enable in browser settings
        </div>
      )}

      {/* Stop bottom sheet */}
      {selected && (
        <div
          style={{
            position: 'fixed', inset: 0, bottom: 'calc(76px + env(safe-area-inset-bottom))',
            zIndex: 30, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            pointerEvents: 'none',
          }}
          onClick={() => setSelected(null)}
        >
          <div
            className="stop-sheet"
            style={{ pointerEvents: 'all' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="stop-sheet-handle" />
            <div className="stop-sheet-name">{selected.name}</div>
            <div className="stop-sheet-category">{CATEGORY_LABEL[selected.category]}</div>
            {selected.distanceKm !== null && (
              <div className="stop-sheet-distance">
                <i className="ti ti-ruler" style={{ marginRight: 4 }} />
                {formatDistance(selected.distanceKm)} as the crow flies
              </div>
            )}
            <div
              className="stop-sheet-desc"
              dangerouslySetInnerHTML={{ __html: selected.description_html }}
            />
            <div className="stop-nav-btns">
              <a
                href={googleMapsUrl(selected.lat, selected.lng)}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-deeplink-btn gmaps"
              >
                <i className="ti ti-map-pin" />
                Google Maps
              </a>
              <a
                href={wazeUrl(selected.lat, selected.lng)}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-deeplink-btn waze"
              >
                <i className="ti ti-navigation" />
                Waze
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
