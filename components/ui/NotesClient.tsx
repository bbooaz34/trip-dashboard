'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cacheGet, cacheSet } from '@/lib/localCache';

interface NotesClientProps {
  tripId: string;
  initialBody: string;
}

export default function NotesClient({ tripId, initialBody }: NotesClientProps) {
  // Hydrate from Supabase first, then localStorage as fallback
  const cached = cacheGet('notes', '');
  const [body, setBody] = useState(initialBody || cached);
  const [status, setStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supabase = createClient();

  // Realtime subscription — another phone edited the note
  useEffect(() => {
    const ch = supabase
      .channel(`notes:${tripId}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'notes', filter: `trip_id=eq.${tripId}`,
      }, payload => {
        // Only apply remote change if not currently editing (timer not running)
        if (!timerRef.current) {
          setBody(payload.new.body as string);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [tripId]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setBody(val);
    setStatus('saving');
    cacheSet('notes', val); // instant local save

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      timerRef.current = null;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setStatus('error'); return; }

      const { error } = await supabase.from('notes').upsert({
        trip_id: tripId,
        body: val,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      });
      setStatus(error ? 'error' : 'saved');
    }, 800);
  }

  const statusText = status === 'saving' ? 'Saving…' : status === 'error' ? 'Error saving' : 'Saved';
  const statusColor = status === 'error' ? 'var(--blush-ink)' : 'var(--sage-ink)';

  return (
    <section>
      <div className="section-title-row">
        <div className="section-title" style={{ margin: 0 }}>My notes</div>
        <span style={{ fontSize: 11, fontWeight: 700, color: statusColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {statusText}
        </span>
      </div>
      <div className="tile">
        <textarea
          className="field"
          value={body}
          onChange={handleChange}
          placeholder="Packing reminders, restaurant ideas, what the kids loved, addresses, contact numbers… anything you want to remember."
        />
      </div>
    </section>
  );
}
