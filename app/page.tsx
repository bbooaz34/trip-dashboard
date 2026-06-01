// Root page: redirect authenticated users to their trip, others to /login
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function RootPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Find the user's first trip
  const { data: membership } = await supabase
    .from('trip_members')
    .select('trip_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  if (membership?.trip_id) {
    redirect(`/trip/${membership.trip_id}`);
  }

  // No trip yet — send to login for now (owner must create trip first via seed.sql)
  redirect('/login?error=no-trip');
}
