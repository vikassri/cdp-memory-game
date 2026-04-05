import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      players: {
        Row: {
          id: string
          name: string
          company: string
          phone: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          company: string
          phone: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          company?: string
          phone?: string
          created_at?: string
        }
      }
      game_scores: {
        Row: {
          id: string
          player_id: string
          player_name: string
          player_company: string
          player_phone: string
          score: number
          tiles_revealed: number
          matched_pairs: number
          time_remaining: number
          completed_game: boolean
          created_at: string
        }
        Insert: {
          id?: string
          player_id: string
          player_name: string
          player_company: string
          player_phone: string
          score: number
          tiles_revealed: number
          matched_pairs: number
          time_remaining: number
          completed_game: boolean
          created_at?: string
        }
        Update: {
          id?: string
          player_id?: string
          player_name?: string
          player_company?: string
          player_phone?: string
          score?: number
          tiles_revealed?: number
          matched_pairs?: number
          time_remaining?: number
          completed_game?: boolean
          created_at?: string
        }
      }
    }
  }
}