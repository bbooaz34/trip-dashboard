import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import TopBar from '@/components/nav/TopBar';
import Hero from '@/components/nav/Hero';
import BottomTabBar from '@/components/nav/BottomTabBar';
import type { TripMember } from '@/lib/supabase/types';

interface TripLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function TripLayout({ children, params }: TripLayoutProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Auth guard
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Membership guard
  const { data: membership } = await supabase
    .from('trip_members')
    .select('role')
    .eq('trip_id', id)
    .eq('user_id', user.id)
    .single() as unknown as { data: Pick<TripMember, 'role'> | null };

  if (!membership) redirect('/login?error=no-access');

  return (
    <div className="app">
      <TopBar email={user.email} />
      <Hero />
      <main className="panels">
        {children}
      </main>
      <BottomTabBar tripId={id} />
    </div>
  );
}
