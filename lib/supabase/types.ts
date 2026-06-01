// Database types — mirrors the schema in supabase/migrations/001_initial.sql

export type Role = 'owner' | 'member';

export interface Trip {
  id: string;
  name: string;
  start_date: string;      // ISO date
  end_date: string;        // ISO date
  base_camp_address: string;
  base_camp_lat: number;
  base_camp_lng: number;
  created_at: string;
}

export interface TripMember {
  trip_id: string;
  user_id: string;
  role: Role;
}

export interface GroceryItem {
  id: string;
  trip_id: string;
  text: string;
  market: string;   // 'EDEKA Titisee' | 'REWE Neustadt' | 'Other'
  done: boolean;
  position: number;
  created_at: string;
  created_by: string;
}

export interface FrankfurtItem {
  id: string;
  trip_id: string;
  text: string;
  done: boolean;
  position: number;
  created_at: string;
  created_by: string;
}

export interface Note {
  trip_id: string;
  body: string;
  updated_at: string;
  updated_by: string;
}

export interface CarState {
  trip_id: string;
  tank_capacity_l: number;
  fuel_liters: number;
  start_odo_km: number;
  current_odo_km: number;
  updated_at: string;
}

export interface Refuel {
  id: string;
  trip_id: string;
  liters: number;
  odo_km: number;
  refueled_at: string;
  created_by: string;
}

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

export interface Stop {
  id: string;
  trip_id: string;
  name: string;
  category: StopCategory;
  lat: number;
  lng: number;
  description_html: string;
  position: number;
}

// ── Supabase Database type (for createClient generics) ──────────────────────

export type Database = {
  public: {
    Tables: {
      trips:            { Row: Trip;          Insert: Omit<Trip, 'id' | 'created_at'>; Update: Partial<Trip> };
      trip_members:     { Row: TripMember;    Insert: TripMember;                      Update: Partial<TripMember> };
      groceries:        { Row: GroceryItem;   Insert: Omit<GroceryItem, 'id' | 'created_at'>; Update: Partial<GroceryItem> };
      frankfurt_items:  { Row: FrankfurtItem; Insert: Omit<FrankfurtItem, 'id' | 'created_at'>; Update: Partial<FrankfurtItem> };
      notes:            { Row: Note;          Insert: Note;                            Update: Partial<Note> };
      car_state:        { Row: CarState;      Insert: CarState;                        Update: Partial<CarState> };
      refuels:          { Row: Refuel;        Insert: Omit<Refuel, 'id'>;              Update: Partial<Refuel> };
      stops:            { Row: Stop;          Insert: Omit<Stop, 'id'>;               Update: Partial<Stop> };
    };
  };
};
