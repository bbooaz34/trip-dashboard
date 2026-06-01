// Database types — mirrors the schema in supabase/migrations/001_initial.sql

export type Role = 'owner' | 'member';

export interface Trip {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
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
  market: string;
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

// ── Supabase Database type (inline object literals — required for generic propagation) ──

export type Database = {
  public: {
    Tables: {
      trips: {
        Row: {
          id: string;
          name: string;
          start_date: string;
          end_date: string;
          base_camp_address: string;
          base_camp_lat: number;
          base_camp_lng: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          start_date: string;
          end_date: string;
          base_camp_address: string;
          base_camp_lat: number;
          base_camp_lng: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          start_date?: string;
          end_date?: string;
          base_camp_address?: string;
          base_camp_lat?: number;
          base_camp_lng?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      trip_members: {
        Row: {
          trip_id: string;
          user_id: string;
          role: string;
        };
        Insert: {
          trip_id: string;
          user_id: string;
          role: string;
        };
        Update: {
          trip_id?: string;
          user_id?: string;
          role?: string;
        };
        Relationships: [];
      };
      groceries: {
        Row: {
          id: string;
          trip_id: string;
          text: string;
          market: string;
          done: boolean;
          position: number;
          created_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          text: string;
          market: string;
          done?: boolean;
          position?: number;
          created_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          text?: string;
          market?: string;
          done?: boolean;
          position?: number;
          created_at?: string;
          created_by?: string;
        };
        Relationships: [];
      };
      frankfurt_items: {
        Row: {
          id: string;
          trip_id: string;
          text: string;
          done: boolean;
          position: number;
          created_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          text: string;
          done?: boolean;
          position?: number;
          created_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          text?: string;
          done?: boolean;
          position?: number;
          created_at?: string;
          created_by?: string;
        };
        Relationships: [];
      };
      notes: {
        Row: {
          trip_id: string;
          body: string;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          trip_id: string;
          body: string;
          updated_at?: string;
          updated_by: string;
        };
        Update: {
          trip_id?: string;
          body?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [];
      };
      car_state: {
        Row: {
          trip_id: string;
          tank_capacity_l: number;
          fuel_liters: number;
          start_odo_km: number;
          current_odo_km: number;
          updated_at: string;
        };
        Insert: {
          trip_id: string;
          tank_capacity_l: number;
          fuel_liters: number;
          start_odo_km: number;
          current_odo_km: number;
          updated_at?: string;
        };
        Update: {
          trip_id?: string;
          tank_capacity_l?: number;
          fuel_liters?: number;
          start_odo_km?: number;
          current_odo_km?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      refuels: {
        Row: {
          id: string;
          trip_id: string;
          liters: number;
          odo_km: number;
          refueled_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          liters: number;
          odo_km: number;
          refueled_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          liters?: number;
          odo_km?: number;
          refueled_at?: string;
          created_by?: string;
        };
        Relationships: [];
      };
      stops: {
        Row: {
          id: string;
          trip_id: string;
          name: string;
          category: string;
          lat: number;
          lng: number;
          description_html: string;
          position: number;
        };
        Insert: {
          id?: string;
          trip_id: string;
          name: string;
          category: string;
          lat: number;
          lng: number;
          description_html: string;
          position: number;
        };
        Update: {
          id?: string;
          trip_id?: string;
          name?: string;
          category?: string;
          lat?: number;
          lng?: number;
          description_html?: string;
          position?: number;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
