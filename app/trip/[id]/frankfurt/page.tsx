import { createClient } from '@/lib/supabase/server';
import ListClient from '@/components/ui/ListClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FrankfurtPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from('frankfurt_items')
    .select('*')
    .eq('trip_id', id)
    .order('position', { ascending: true });

  return (
    <>
      <ListClient
        tripId={id}
        table="frankfurt_items"
        initialItems={data ?? []}
        title="Frankfurt shopping"
        countLabel="to buy"
        countColor={{ bg: 'var(--lilac)', ink: 'var(--lilac-ink)' }}
        placeholder="What to buy in the city…"
        showMarket={false}
      />
      <div className="tip-card" style={{ margin: '0 0 16px' }}>
        <i className="ti ti-info-circle" />
        <span>
          Frankfurt is ~4 hours from the base camp — likely a travel-day stop.
          Save city-specific items for here (Zeil, MyZeil mall, Goethestraße).
        </span>
      </div>
    </>
  );
}
