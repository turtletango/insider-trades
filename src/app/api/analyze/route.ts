import { NextResponse } from 'next/server'
import { polymarketClient } from '@/lib/polymarket-client'
import { insiderDetector } from '@/lib/insider-detection'
import type { SuspiciousTrade } from '@/types/polymarket'

export const dynamic = 'force-dynamic'

/**
 * POST /api/analyze
 * Fetches recent trades, analyzes them for suspicious activity, and returns results directly
 */
export async function POST(request: Request) {
  try {
    const { limit = 100 } = await request.json().catch(() => ({}))

    // Fetch recent trades from Polymarket
    const tradesWithMarkets = await polymarketClient.getRecentTrades(limit)

    if (tradesWithMarkets.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No trades found',
        analyzed: 0,
        suspicious: 0,
        trades: [],
      })
    }

    // Analyze trades
    const analyses = insiderDetector.analyzeBatch(tradesWithMarkets)

    // Convert to response format
    const suspiciousTrades: SuspiciousTrade[] = analyses.map(analysis => ({
      market_id: analysis.market.condition_id,
      market_question: analysis.market.question,
      trader_address: analysis.trade.maker_address,
      outcome: analysis.trade.outcome,
      price: parseFloat(analysis.trade.price),
      size: parseFloat(analysis.trade.size),
      timestamp: new Date(analysis.trade.timestamp * 1000).toISOString(),
      suspicion_score: analysis.suspicion_score,
      suspicion_reasons: analysis.suspicion_reasons,
      market_resolved: analysis.market.closed,
    }))

    return NextResponse.json({
      success: true,
      analyzed: tradesWithMarkets.length,
      suspicious: analyses.length,
      trades: suspiciousTrades,
    })
  } catch (error) {
    console.error('Error analyzing trades:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/analyze
 * Triggers analysis without body
 */
export async function GET() {
  try {
    // Fetch recent trades from Polymarket
    const tradesWithMarkets = await polymarketClient.getRecentTrades(100)

    if (tradesWithMarkets.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No trades found',
        analyzed: 0,
        suspicious: 0,
        trades: [],
      })
    }

    // Analyze trades
    const analyses = insiderDetector.analyzeBatch(tradesWithMarkets)

    // Convert to response format
    const suspiciousTrades: SuspiciousTrade[] = analyses.map(analysis => ({
      market_id: analysis.market.condition_id,
      market_question: analysis.market.question,
      trader_address: analysis.trade.maker_address,
      outcome: analysis.trade.outcome,
      price: parseFloat(analysis.trade.price),
      size: parseFloat(analysis.trade.size),
      timestamp: new Date(analysis.trade.timestamp * 1000).toISOString(),
      suspicion_score: analysis.suspicion_score,
      suspicion_reasons: analysis.suspicion_reasons,
      market_resolved: analysis.market.closed,
    }))

    return NextResponse.json({
      success: true,
      analyzed: tradesWithMarkets.length,
      suspicious: analyses.length,
      trades: suspiciousTrades,
    })
  } catch (error) {
    console.error('Error analyzing trades:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
