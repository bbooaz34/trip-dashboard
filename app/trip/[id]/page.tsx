// Home — bento grid overview
import { createClient } from '@/lib/supabase/server';
import HomeBento from '@/components/ui/HomeBento';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch data for bento tiles
  const [grocRes, shopRes, notesRes, carRes] = await Promise.all([
    supabase.from('groceries').select('done').eq('trip_id', id),
    supabase.from('frankfurt_items').select('done').eq('trip_id', id),
    supabase.from('notes').select('body').eq('trip_id', id).single(),
    supabase.from('car_state').select('fuel_liters,tank_capacity_l').eq('trip_id', id).single(),
  ]);

  const grocOpen  = (grocRes.data  ?? []).filter(g => !g.done).length;
  const shopOpen  = (shopRes.data  ?? []).filter(s => !s.done).length;
  const noteBody  = notesRes.data?.body ?? '';
  const fuelPct   = carRes.data
    ? Math.round((carRes.data.fuel_liters / carRes.data.tank_capacity_l) * 100)
    : 75;

  return (
    <HomeBento
      tripId={id}
      grocOpen={grocOpen}
      shopOpen={shopOpen}
      notePreview={noteBody}
      fuelPct={fuelPct}
    />
  );
}
