import { NextResponse } from 'next/server'
import { polymarketClient } from '@/lib/polymarket-client'
import { insiderDetector } from '@/lib/insider-detection'

export const dynamic = 'force-dynamic'

/**
 * GET /api/stats
 * Returns statistics about suspicious trades from current analysis
 */
export async function GET() {
  try {
    // Fetch recent trades from Polymarket
    const tradesWithMarkets = await polymarketClient.getRecentTrades(100)

    if (tradesWithMarkets.length === 0) {
      return NextResponse.json({
        success: true,
        stats: {
          total_suspicious_trades: 0,
          high_suspicion_trades: 0,
          average_suspicion_score: '0.00',
          recent_24h: 0,
          unique_suspicious_traders: 0,
        },
      })
    }

    // Analyze trades
    const analyses = insiderDetector.analyzeBatch(tradesWithMarkets)

    // Calculate statistics
    const totalCount = analyses.length
    const highSuspicionCount = analyses.filter(a => a.suspicion_score >= 80).length
    const avgScore = totalCount > 0
      ? analyses.reduce((sum, a) => sum + a.suspicion_score, 0) / totalCount
      : 0

    // Get recent activity (last 24 hours)
    const yesterday = Date.now() / 1000 - 24 * 60 * 60
    const recentCount = analyses.filter(a => a.trade.timestamp >= yesterday).length

    // Count unique traders
    const uniqueTraders = new Set(analyses.map(a => a.trade.maker_address))

    return NextResponse.json({
      success: true,
      stats: {
        total_suspicious_trades: totalCount,
        high_suspicion_trades: highSuspicionCount,
        average_suspicion_score: avgScore.toFixed(2),
        recent_24h: recentCount,
        unique_suspicious_traders: uniqueTraders.size,
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
