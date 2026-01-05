-- Create suspicious_trades table
CREATE TABLE IF NOT EXISTS suspicious_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Market information
  market_id TEXT NOT NULL,
  market_question TEXT NOT NULL,

  -- Trade information
  trader_address TEXT NOT NULL,
  outcome TEXT NOT NULL,
  price DECIMAL NOT NULL,
  size DECIMAL NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,

  -- Suspicion metrics
  suspicion_score DECIMAL NOT NULL,
  suspicion_reasons TEXT[] NOT NULL,

  -- Outcome tracking
  profit_amount DECIMAL,
  time_before_resolution BIGINT, -- in seconds
  market_resolved BOOLEAN DEFAULT FALSE,
  market_resolved_at TIMESTAMPTZ,
  market_winning_outcome TEXT,

  -- Indexes for efficient querying
  CONSTRAINT unique_trade UNIQUE (market_id, trader_address, timestamp)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_suspicious_trades_market_id ON suspicious_trades(market_id);
CREATE INDEX IF NOT EXISTS idx_suspicious_trades_trader ON suspicious_trades(trader_address);
CREATE INDEX IF NOT EXISTS idx_suspicious_trades_score ON suspicious_trades(suspicion_score DESC);
CREATE INDEX IF NOT EXISTS idx_suspicious_trades_timestamp ON suspicious_trades(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_suspicious_trades_created_at ON suspicious_trades(created_at DESC);

-- Enable Row Level Security
ALTER TABLE suspicious_trades ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON suspicious_trades
  FOR SELECT USING (true);

-- Create policy to allow service role to insert/update
CREATE POLICY "Allow service role all access" ON suspicious_trades
  FOR ALL USING (auth.role() = 'service_role');
