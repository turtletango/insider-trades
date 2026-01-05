/**
 * Mock data for testing
 */

export const mockSuspiciousTrade = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  market_id: 'test-market-123',
  market_question: 'Will Bitcoin reach $100,000 by end of 2024?',
  trader_address: '0x1234567890abcdef1234567890abcdef12345678',
  outcome: 'Yes',
  price: 0.95,
  size: 50000,
  timestamp: '2024-01-15T10:30:00Z',
  suspicion_score: 85,
  suspicion_reasons: [
    'Large trade size ($47,500)',
    'Extreme price entry (0.95)',
    'Close to market resolution (12 hours remaining)',
  ],
  market_resolved: false,
  profit_amount: null,
  time_before_resolution: 12,
  market_resolved_at: null,
  market_winning_outcome: null,
  created_at: '2024-01-15T10:30:00Z',
};

export const mockSuspiciousTrades = [
  mockSuspiciousTrade,
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    market_id: 'test-market-456',
    market_question: 'Will Ethereum surpass $5,000 in Q1 2024?',
    trader_address: '0xabcdef1234567890abcdef1234567890abcdef12',
    outcome: 'No',
    price: 0.08,
    size: 75000,
    timestamp: '2024-01-14T15:45:00Z',
    suspicion_score: 92,
    suspicion_reasons: [
      'Large trade size ($6,000)',
      'Extreme price entry (0.08)',
      'Large bet on low probability outcome',
      'Unusual position size',
    ],
    market_resolved: false,
    profit_amount: null,
    time_before_resolution: 36,
    market_resolved_at: null,
    market_winning_outcome: null,
    created_at: '2024-01-14T15:45:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    market_id: 'test-market-789',
    market_question: 'Will the Fed raise interest rates in January?',
    trader_address: '0x9876543210fedcba9876543210fedcba98765432',
    outcome: 'Yes',
    price: 0.65,
    size: 25000,
    timestamp: '2024-01-13T08:20:00Z',
    suspicion_score: 68,
    suspicion_reasons: [
      'Large trade size ($16,250)',
      'Close to market resolution (8 hours remaining)',
    ],
    market_resolved: true,
    profit_amount: 8750,
    time_before_resolution: 8,
    market_resolved_at: '2024-01-13T16:00:00Z',
    market_winning_outcome: 'Yes',
    created_at: '2024-01-13T08:20:00Z',
  },
];

export const mockStats = {
  totalSuspiciousTrades: 156,
  highRiskTrades: 42,
  averageSuspicionScore: 73.5,
  uniqueTraders: 89,
  last24Hours: 12,
};

export const mockPolymarketMarket = {
  condition_id: 'test-market-123',
  question: 'Will Bitcoin reach $100,000 by end of 2024?',
  end_date_iso: '2024-12-31T23:59:59Z',
  active: true,
  closed: false,
  archived: false,
  outcomes: ['Yes', 'No'],
  outcomePrices: ['0.45', '0.55'],
};

export const mockPolymarketTrade = {
  id: 'trade-123',
  market: 'test-market-123',
  asset_id: 'asset-yes-123',
  maker_address: '0x1234567890abcdef1234567890abcdef12345678',
  side: 'BUY',
  size: '50000',
  price: '0.95',
  timestamp: 1705314600,
  outcome: 'Yes',
};

export const mockAnalyzeResponse = {
  analyzed: 100,
  suspicious: 3,
  stored: 3,
  trades: mockSuspiciousTrades,
};

export const mockEmptyStats = {
  totalSuspiciousTrades: 0,
  highRiskTrades: 0,
  averageSuspicionScore: 0,
  uniqueTraders: 0,
  last24Hours: 0,
};

export const mockEmptyTradesResponse = {
  trades: [],
  total: 0,
};

export const mockTradesResponse = {
  trades: mockSuspiciousTrades,
  total: mockSuspiciousTrades.length,
};
