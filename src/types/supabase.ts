// This file is a placeholder for your Supabase database types.
// You can generate them using the Supabase CLI:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > src/types/supabase.ts
// Replace YOUR_PROJECT_ID with your actual Supabase project ID.

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
      // Define your tables here as you create them in Supabase.
      // Example:
      // posts: {
      //   Row: {
      //     id: number
      //     created_at: string
      //     title: string | null
      //     content: string | null
      //   }
      //   Insert: {
      //     id?: number
      //     created_at?: string
      //     title?: string | null
      //     content?: string | null
      //   }
      //   Update: {
      //     id?: number
      //     created_at?: string
      //     title?: string | null
      //     content?: string | null
      //   }
      //   Relationships: []
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

// Example of how to use the Database type (if you had a 'posts' table):
// import { PostgrestResponse } from '@supabase/supabase-js';
// import { supabase } from '@/lib/supabaseClient';
//
// async function getPosts() {
//   const { data, error }: PostgrestResponse<Database['public']['Tables']['posts']['Row']> = await supabase
//     .from('posts')
//     .select('*');
//
//   if (error) {
//     console.error('Error fetching posts:', error);
//     return null;
//   }
//   return data;
// }
