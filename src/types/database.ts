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
      suspicious_trades: {
        Row: {
          id: string
          created_at: string
          market_id: string
          market_question: string
          trader_address: string
          outcome: string
          price: number
          size: number
          timestamp: string
          suspicion_score: number
          suspicion_reasons: string[]
          profit_amount: number | null
          time_before_resolution: number | null
          market_resolved: boolean
          market_resolved_at: string | null
          market_winning_outcome: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          market_id: string
          market_question: string
          trader_address: string
          outcome: string
          price: number
          size: number
          timestamp: string
          suspicion_score: number
          suspicion_reasons: string[]
          profit_amount?: number | null
          time_before_resolution?: number | null
          market_resolved?: boolean
          market_resolved_at?: string | null
          market_winning_outcome?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          market_id?: string
          market_question?: string
          trader_address?: string
          outcome?: string
          price?: number
          size?: number
          timestamp?: string
          suspicion_score?: number
          suspicion_reasons?: string[]
          profit_amount?: number | null
          time_before_resolution?: number | null
          market_resolved?: boolean
          market_resolved_at?: string | null
          market_winning_outcome?: string | null
        }
      }
    }
  }
}
