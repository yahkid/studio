
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
          email: string // User's email if they provide it for prayer follow-up
          // consider adding a 'prayer_request_text' if you want to store the specific prayer.
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
      weekly_updates_signups: { // New table for Watch & Grow section signups
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
          details: string | null // For more detailed event information
          image_src: string | null // URL for event image
          image_alt: string | null // Alt text for event image
          ai_hint: string | null // AI hint for event image placeholder
          button_text: string | null // Text for event CTA button
          button_link: string | null // Link for event CTA button (can be internal or external)
          // You might also want:
          // event_date: string // DATE or TIMESTAMPTZ
          // location: string | null
          // category: string | null (e.g., "Service", "Conference", "Community")
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
      // Consider adding a 'sermons' table for the Watch & Grow section
      // sermons: {
      //   Row: {
      //     id: string;
      //     created_at: string;
      //     title: string;
      //     description: string | null;
      //     video_url: string; // YouTube embed URL or similar
      //     speaker: string | null;
      //     sermon_date: string; // DATE
      //     thumbnail_url: string | null;
      //   };
      //   Insert: { /* ... */ };
      //   Update: { /* ... */ };
      //   Relationships: [];
      // }
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
