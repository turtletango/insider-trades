import type { PolymarketTrade, PolymarketMarket, TradeAnalysis } from '@/types/polymarket'

interface DetectionCriteria {
  // Threshold for large trade size (in USDC)
  largeTradeThreshold: number
  // Threshold for extreme price (close to 0 or 1)
  extremePriceThreshold: number
  // Time window before market end to flag (in hours)
  closeToEndThreshold: number
  // Minimum suspicion score to consider suspicious
  minSuspicionScore: number
}

const DEFAULT_CRITERIA: DetectionCriteria = {
  largeTradeThreshold: 10000, // $10k
  extremePriceThreshold: 0.1, // Prices < 0.1 or > 0.9
  closeToEndThreshold: 24, // 24 hours
  minSuspicionScore: 60, // 60/100
}

export class InsiderDetectionEngine {
  private criteria: DetectionCriteria

  constructor(criteria: DetectionCriteria = DEFAULT_CRITERIA) {
    this.criteria = criteria
  }

  /**
   * Analyze a trade for suspicious activity
   */
  analyzeTrade(trade: PolymarketTrade, market: PolymarketMarket): TradeAnalysis {
    const suspicionReasons: string[] = []
    let suspicionScore = 0

    // Parse trade data
    const price = parseFloat(trade.price)
    const size = parseFloat(trade.size)
    const tradeValue = price * size

    // Check 1: Large trade size
    if (tradeValue >= this.criteria.largeTradeThreshold) {
      const score = Math.min(30, (tradeValue / this.criteria.largeTradeThreshold) * 15)
      suspicionScore += score
      suspicionReasons.push(
        `Large trade value: $${tradeValue.toLocaleString()} (Score: +${score.toFixed(1)})`
      )
    }

    // Check 2: Extreme price entry
    if (price <= this.criteria.extremePriceThreshold) {
      const score = 25
      suspicionScore += score
      suspicionReasons.push(
        `Bought at extreme low price: ${(price * 100).toFixed(1)}% (Score: +${score})`
      )
    } else if (price >= (1 - this.criteria.extremePriceThreshold)) {
      const score = 15
      suspicionScore += score
      suspicionReasons.push(
        `Bought at extreme high price: ${(price * 100).toFixed(1)}% (Score: +${score})`
      )
    }

    // Check 3: Close to market resolution
    const marketEndTime = new Date(market.end_date_iso).getTime()
    const tradeTime = trade.timestamp * 1000 // Convert to milliseconds
    const hoursUntilEnd = (marketEndTime - tradeTime) / (1000 * 60 * 60)

    if (hoursUntilEnd > 0 && hoursUntilEnd <= this.criteria.closeToEndThreshold) {
      const score = Math.min(35, 35 * (1 - hoursUntilEnd / this.criteria.closeToEndThreshold))
      suspicionScore += score
      suspicionReasons.push(
        `Trade made ${hoursUntilEnd.toFixed(1)} hours before market end (Score: +${score.toFixed(1)})`
      )
    }

    // Check 4: Unusual price movement (buying at low price that seems mispriced)
    if (price < 0.2 && tradeValue > 5000) {
      const score = 20
      suspicionScore += score
      suspicionReasons.push(
        `Large bet on low-probability outcome (<20%) (Score: +${score})`
      )
    }

    // Check 5: Very large single trade
    if (size > 50000) {
      const score = 15
      suspicionScore += score
      suspicionReasons.push(
        `Unusually large position size: ${size.toLocaleString()} shares (Score: +${score})`
      )
    }

    // Normalize score to 0-100
    suspicionScore = Math.min(100, suspicionScore)

    return {
      trade,
      market,
      suspicion_score: suspicionScore,
      suspicion_reasons: suspicionReasons,
      is_suspicious: suspicionScore >= this.criteria.minSuspicionScore,
    }
  }

  /**
   * Analyze multiple trades
   */
  analyzeTradesForMarket(
    trades: PolymarketTrade[],
    market: PolymarketMarket
  ): TradeAnalysis[] {
    return trades
      .map(trade => this.analyzeTrade(trade, market))
      .filter(analysis => analysis.is_suspicious)
      .sort((a, b) => b.suspicion_score - a.suspicion_score)
  }

  /**
   * Batch analyze trades across multiple markets
   */
  analyzeBatch(
    tradesWithMarkets: { trade: PolymarketTrade; market: PolymarketMarket }[]
  ): TradeAnalysis[] {
    return tradesWithMarkets
      .map(({ trade, market }) => this.analyzeTrade(trade, market))
      .filter(analysis => analysis.is_suspicious)
      .sort((a, b) => b.suspicion_score - a.suspicion_score)
  }

  /**
   * Calculate profit if market has resolved
   */
  calculateProfit(
    trade: PolymarketTrade,
    winningOutcome: string
  ): number | null {
    const price = parseFloat(trade.price)
    const size = parseFloat(trade.size)
    const cost = price * size

    // If the trade's outcome won
    if (trade.outcome === winningOutcome) {
      // Profit = (1 - entry_price) * size
      return size - cost
    } else {
      // Loss = -cost
      return -cost
    }
  }

  /**
   * Update criteria thresholds
   */
  updateCriteria(newCriteria: Partial<DetectionCriteria>): void {
    this.criteria = { ...this.criteria, ...newCriteria }
  }
}

export const insiderDetector = new InsiderDetectionEngine()
