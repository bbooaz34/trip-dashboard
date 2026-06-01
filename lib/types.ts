// App-level types (not DB schema). DB types live in lib/supabase/types.ts.

export type StopCategory =
  | 'base'
  | 'waterfall'
  | 'lake'
  | 'mountain'
  | 'city'
  | 'kids'
  | 'museum'
  | 'food'
  | 'church'
  | 'parking'
  | 'nature';
