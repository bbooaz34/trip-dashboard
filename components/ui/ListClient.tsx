'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

const MARKETS = ['EDEKA Titisee', 'REWE Neustadt', 'Other'] as const;

interface ListItem {
  id: string;
  trip_id: string;
  text: string;
  done: boolean;
  position: number;
  market?: string;
  created_by?: string;
}

interface ListClientProps {
  tripId: string;
  table: 'groceries' | 'frankfurt_items';
  initialItems: ListItem[];
  title: string;
  countLabel: string;
  countColor: { bg: string; ink: string };
  placeholder: string;
  showMarket: boolean;
}

export default function ListClient({
  tripId,
  table,
  initialItems,
  title,
  countLabel,
  countColor,
  placeholder,
  showMarket,
}: ListClientProps) {
  const [items, setItems]   = useState<ListItem[]>(initialItems);
  const [input, setInput]   = useState('');
  const [market, setMarket] = useState<string>('EDEKA Titisee');
  const inputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  // Realtime subscription
  useEffect(() => {
    const ch = supabase
      .channel(`${table}:${tripId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table, filter: `trip_id=eq.${tripId}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }, (payload: any) => {
        if (payload.eventType === 'INSERT') {
          setItems(prev => [...prev, payload.new as ListItem]);
        } else if (payload.eventType === 'UPDATE') {
          setItems(prev => prev.map(it => it.id === payload.new.id ? (payload.new as ListItem) : it));
        } else if (payload.eventType === 'DELETE') {
          setItems(prev => prev.filter(it => it.id !== payload.old.id));
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [tripId, table]);

  const openCount = items.filter(i => !i.done).length;

  async function addItem() {
    const text = input.trim();
    if (!text) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newItem = {
      trip_id: tripId,
      text,
      done: false,
      position: items.length,
      created_by: user.id,
      ...(showMarket ? { market } : {}),
    };

    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    setItems(prev => [...prev, { id: tempId, ...newItem } as ListItem]);
    setInput('');
    inputRef.current?.focus();

    const { data } = await supabase.from(table as never).insert(newItem).select().single();
    if (data) {
      setItems(prev => prev.map(it => it.id === tempId ? (data as ListItem) : it));
    }
  }

  async function toggleItem(item: ListItem) {
    // Optimistic update
    setItems(prev => prev.map(it => it.id === item.id ? { ...it, done: !it.done } : it));
    await supabase.from(table as never).update({ done: !item.done }).eq('id', item.id);
  }

  async function deleteItem(item: ListItem) {
    if (!confirm(`Remove "${item.text}"?`)) return;
    setItems(prev => prev.filter(it => it.id !== item.id));
    await supabase.from(table as never).delete().eq('id', item.id);
  }

  return (
    <section>
      <div className="section-title-row">
        <div className="section-title" style={{ margin: 0 }}>{title}</div>
        <span className="tile-chip" style={{ background: countColor.bg, color: countColor.ink }}>
          {openCount} {countLabel}
        </span>
      </div>
      <div className="tile">
        {showMarket && (
          <div className="market-pick">
            {MARKETS.map(m => (
              <button
                key={m}
                className={`market-btn ${market === m ? 'active' : ''}`}
                onClick={() => setMarket(m)}
              >
                {m}
              </button>
            ))}
          </div>
        )}

        <div className="row-input">
          <input
            ref={inputRef}
            className="field"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addItem(); }}
            placeholder={placeholder}
          />
          <button className="btn-add" onClick={addItem} aria-label="Add item">
            <i className="ti ti-plus" />
          </button>
        </div>

        <div className="item-list">
          {items.length === 0 ? (
            <div className="empty-block">No items yet. Add one above.</div>
          ) : (
            items.map(item => (
              <div key={item.id} className={`item ${item.done ? 'done' : ''}`}>
                <button
                  className={`check-btn ${item.done ? 'checked' : ''}`}
                  onClick={() => toggleItem(item)}
                  aria-label={item.done ? 'Mark not done' : 'Mark done'}
                >
                  <i className="ti ti-check" />
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="item-text">{item.text}</div>
                  {item.market && <div className="item-meta">{item.market}</div>}
                </div>
                <button
                  className="del-btn"
                  onClick={() => deleteItem(item)}
                  aria-label="Remove"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
