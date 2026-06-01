// Home — bento grid overview
import { createClient } from '@/lib/supabase/server';
import HomeBento from '@/components/ui/HomeBento';
import type { GroceryItem, FrankfurtItem, Note, CarState } from '@/lib/supabase/types';

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

  const grocOpen  = (grocRes.data  as Pick<GroceryItem, 'done'>[]  | null ?? []).filter(g => !g.done).length;
  const shopOpen  = (shopRes.data  as Pick<FrankfurtItem, 'done'>[] | null ?? []).filter(s => !s.done).length;
  const noteBody  = (notesRes.data as Pick<Note, 'body'> | null)?.body ?? '';
  const car       = carRes.data as Pick<CarState, 'fuel_liters' | 'tank_capacity_l'> | null;
  const fuelPct   = car
    ? Math.round((car.fuel_liters / car.tank_capacity_l) * 100)
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
