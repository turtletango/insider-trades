export interface PolymarketMarket {
  condition_id: string
  question: string
  description: string
  end_date_iso: string
  game_start_time: string
  question_id: string
  market_slug: string
  min_incentive_size: number
  max_incentive_size: number
  liquidity: number
  volume: number
  active: boolean
  closed: boolean
  market_type: string
  outcomes: string[]
  outcomePrices: string[]
  tags: string[]
  clob_token_ids: string[]
}

export interface PolymarketTrade {
  id: string
  market: string
  asset_id: string
  maker_address: string
  taker_address: string
  price: string
  size: string
  side: 'BUY' | 'SELL'
  outcome: string
  timestamp: number
  transaction_hash: string
}

export interface PolymarketOrder {
  order_id: string
  market: string
  asset_id: string
  maker_address: string
  price: string
  size: string
  side: 'BUY' | 'SELL'
  outcome: string
  created_at: number
}

export interface SuspiciousTrade {
  id?: string
  market_id: string
  market_question: string
  trader_address: string
  outcome: string
  price: number
  size: number
  timestamp: string
  suspicion_score: number
  suspicion_reasons: string[]
  profit_amount?: number
  time_before_resolution?: number
  market_resolved?: boolean
  market_resolved_at?: string
  market_winning_outcome?: string
}

export interface TradeAnalysis {
  trade: PolymarketTrade
  market: PolymarketMarket
  suspicion_score: number
  suspicion_reasons: string[]
  is_suspicious: boolean
}
