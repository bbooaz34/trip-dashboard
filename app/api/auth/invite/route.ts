import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const { email, tripId } = await request.json();

  if (!email || !tripId) {
    return NextResponse.json({ error: 'email and tripId required' }, { status: 400 });
  }

  // Verify requester is a member of the trip
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: membership } = await supabase
    .from('trip_members')
    .select('role')
    .eq('trip_id', tripId)
    .eq('user_id', user.id)
    .single();

  if (!membership) {
    return NextResponse.json({ error: 'Not a trip member' }, { status: 403 });
  }

  // Use service role to send magic link (bypasses RLS)
  const admin = createServiceClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback?next=/trip/${tripId}`;

  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo,
    data: { trip_id: tripId }, // stored in user metadata, used by post-auth hook if configured
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Add them as a pending member (they'll confirm when they click the link)
  // Look up invited user's ID
  const { data: invitedUser } = await admin.auth.admin.listUsers();
  const invitedRecord = invitedUser?.users.find((u: { email?: string }) => u.email === email);

  if (invitedRecord) {
    await admin.from('trip_members').upsert({
      trip_id: tripId,
      user_id: invitedRecord.id,
      role: 'member',
    });
  }

  return NextResponse.json({ ok: true });
}
