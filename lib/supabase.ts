import { createClient } from "@supabase/supabase-js"

// Ensure we have the environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Please check your .env.local file.", {
    supabaseUrl: !!supabaseUrl,
    supabaseAnonKey: !!supabaseAnonKey,
  })
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "")

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          provider: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          provider: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          provider?: string
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          user_id: string
          template_id: string
          title: string
          form_data: any
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_id: string
          title: string
          form_data: any
          language: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          template_id?: string
          title?: string
          form_data?: any
          language?: string
          created_at?: string
          updated_at?: string
        }
      }
      template_usage: {
        Row: {
          id: string
          template_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          template_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          template_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}
