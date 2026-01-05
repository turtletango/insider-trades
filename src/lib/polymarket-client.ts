import type { PolymarketMarket, PolymarketTrade } from '@/types/polymarket'

const POLYMARKET_API_URL = process.env.POLYMARKET_API_URL || 'https://clob.polymarket.com'
const GAMMA_API_URL = 'https://gamma-api.polymarket.com'

export class PolymarketClient {
  private baseUrl: string
  private gammaUrl: string

  constructor() {
    this.baseUrl = POLYMARKET_API_URL
    this.gammaUrl = GAMMA_API_URL
  }

  async getMarkets(limit: number = 100): Promise<PolymarketMarket[]> {
    try {
      const response = await fetch(
        `${this.gammaUrl}/markets?limit=${limit}&active=true`,
        {
          headers: {
            'Accept': 'application/json',
          },
          next: { revalidate: 60 } // Cache for 1 minute
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch markets: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching markets:', error)
      return []
    }
  }

  async getMarket(conditionId: string): Promise<PolymarketMarket | null> {
    try {
      const response = await fetch(
        `${this.gammaUrl}/markets/${conditionId}`,
        {
          headers: {
            'Accept': 'application/json',
          },
          next: { revalidate: 60 }
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch market: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error fetching market ${conditionId}:`, error)
      return null
    }
  }

  async getTrades(tokenId: string, limit: number = 100): Promise<PolymarketTrade[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/trades?asset_id=${tokenId}&limit=${limit}`,
        {
          headers: {
            'Accept': 'application/json',
          },
          next: { revalidate: 10 } // Cache for 10 seconds
        }
      )

      if (!response.ok) {
        console.error(`Failed to fetch trades for ${tokenId}: ${response.statusText}`)
        return []
      }

      return await response.json()
    } catch (error) {
      console.error(`Error fetching trades for ${tokenId}:`, error)
      return []
    }
  }

  async getRecentTrades(limit: number = 50): Promise<{ trade: PolymarketTrade, market: PolymarketMarket }[]> {
    try {
      // Get active markets
      const markets = await this.getMarkets(20)

      const tradesWithMarkets: { trade: PolymarketTrade, market: PolymarketMarket }[] = []

      // Get recent trades for each market
      for (const market of markets) {
        if (market.clob_token_ids && market.clob_token_ids.length > 0) {
          // Get trades for the first outcome (usually "Yes")
          const tokenId = market.clob_token_ids[0]
          const trades = await this.getTrades(tokenId, 10)

          for (const trade of trades) {
            tradesWithMarkets.push({ trade, market })
          }

          if (tradesWithMarkets.length >= limit) {
            break
          }
        }
      }

      // Sort by timestamp descending
      return tradesWithMarkets
        .sort((a, b) => b.trade.timestamp - a.trade.timestamp)
        .slice(0, limit)
    } catch (error) {
      console.error('Error fetching recent trades:', error)
      return []
    }
  }

  async getTraderHistory(_address: string, _limit = 100): Promise<PolymarketTrade[]> {
    // Note: This would require a custom indexer or The Graph
    // For now, we'll return empty array as placeholder
    console.warn('Trader history requires custom indexer implementation')
    return []
  }
}

export const polymarketClient = new PolymarketClient()
