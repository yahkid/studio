
// This file is a placeholder for your Supabase database types.
// You can generate them using the Supabase CLI:
// npx supabase gen types typescript --project-id xmgcypojvvswfsjsfxhm --schema public > src/types/supabase.ts
// Replace xmgcypojvvswfsjsfxhm with your actual Supabase project ID if different.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      decisions: {
        Row: {
          id: string // UUID
          created_at: string // TIMESTAMPTZ
          name: string
          email: string
          decision_type: string
          comments: string | null
        }
        Insert: {
          id?: string // UUID
          created_at?: string // TIMESTAMPTZ
          name: string
          email: string
          decision_type: string
          comments?: string | null
        }
        Update: {
          id?: string // UUID
          created_at?: string // TIMESTAMPTZ
          name?: string
          email?: string
          decision_type?: string
          comments?: string | null
        }
        Relationships: []
      }
      lead_magnet_signups: {
        Row: {
          id: string // UUID
          created_at: string // TIMESTAMPTZ
          email: string
        }
        Insert: {
          id?: string // UUID
          created_at?: string // TIMESTAMPTZ
          email: string
        }
        Update: {
          id?: string // UUID
          created_at?: string // TIMESTAMPTZ
          email?: string
        }
        Relationships: []
      }
      visit_requests: {
        Row: {
          id: string // UUID
          created_at: string // TIMESTAMPTZ
          name: string
          email: string
          message: string | null
        }
        Insert: {
          id?: string // UUID
          created_at?: string // TIMESTAMPTZ
          name: string
          email: string
          message?: string | null
        }
        Update: {
          id?: string // UUID
          created_at?: string // TIMESTAMPTZ
          name?: string
          email?: string
          message?: string | null
        }
        Relationships: []
      }
      exit_intent_offers: {
        Row: {
          id: string // UUID
          created_at: string // TIMESTAMPTZ
          email: string
        }
        Insert: {
          id?: string // UUID
          created_at?: string // TIMESTAMPTZ
          email: string
        }
        Update: {
          id?: string // UUID
          created_at?: string // TIMESTAMPTZ
          email?: string
        }
        Relationships: []
      }
      weekly_updates_signups: {
        Row: {
          id: string // UUID
          created_at: string // TIMESTAMPTZ
          email: string
        }
        Insert: {
          id?: string // UUID
          created_at?: string // TIMESTAMPTZ
          email: string
        }
        Update: {
          id?: string // UUID
          created_at?: string // TIMESTAMPTZ
          email?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          id: string // UUID
          created_at: string // TIMESTAMPTZ
          title: string
          description: string | null
          details: string | null
          image_src: string | null
          image_alt: string | null
          ai_hint: string | null
          button_text: string | null
          button_link: string | null
        }
        Insert: {
          id?: string // UUID
          created_at?: string // TIMESTAMPTZ
          title: string
          description?: string | null
          details?: string | null
          image_src?: string | null
          image_alt?: string | null
          ai_hint?: string | null
          button_text?: string | null
          button_link?: string | null
        }
        Update: {
          id?: string // UUID
          created_at?: string // TIMESTAMPTZ
          title?: string
          description?: string | null
          details?: string | null
          image_src?: string | null
          image_alt?: string | null
          ai_hint?: string | null
          button_text?: string | null
          button_link?: string | null
        }
        Relationships: []
      }
      financial_partner_signups: {
        Row: {
          id: string // UUID
          created_at: string // TIMESTAMPTZ
          first_name: string
          last_name: string
          email: string
          phone_number: string | null
          country: string | null
        }
        Insert: {
          id?: string // UUID
          created_at?: string // TIMESTAMPTZ
          first_name: string
          last_name: string
          email: string
          phone_number?: string | null
          country?: string | null
        }
        Update: {
          id?: string // UUID
          created_at?: string // TIMESTAMPTZ
          first_name?: string
          last_name?: string
          email?: string
          phone_number?: string | null
          country?: string | null
        }
        Relationships: []
      }
      prayer_partner_signups: {
        Row: {
          id: string // UUID
          created_at: string // TIMESTAMPTZ
          first_name: string
          last_name: string
          email: string
          committed_to_pray: boolean | null
        }
        Insert: {
          id?: string // UUID
          created_at?: string // TIMESTAMPTZ
          first_name: string
          last_name: string
          email: string
          committed_to_pray?: boolean | null
        }
        Update: {
          id?: string // UUID
          created_at?: string // TIMESTAMPTZ
          first_name?: string
          last_name?: string
          email?: string
          committed_to_pray?: boolean | null
        }
        Relationships: []
      }
      volunteer_partner_signups: {
        Row: {
          id: string // UUID
          created_at: string // TIMESTAMPTZ
          first_name: string
          last_name: string
          email: string
          interests_skills: string | null
        }
        Insert: {
          id?: string // UUID
          created_at?: string // TIMESTAMPTZ
          first_name: string
          last_name: string
          email: string
          interests_skills?: string | null
        }
        Update: {
          id?: string // UUID
          created_at?: string // TIMESTAMPTZ
          first_name?: string
          last_name?: string
          email?: string
          interests_skills?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
