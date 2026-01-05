import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * GET /api/stats
 * Returns statistics about suspicious trades
 */
export async function GET() {
  try {
    // Get total count
    const { count: totalCount } = await supabase
      .from('suspicious_trades')
      .select('*', { count: 'exact', head: true })

    // Get high suspicion count (score >= 80)
    const { count: highSuspicionCount } = await supabase
      .from('suspicious_trades')
      .select('*', { count: 'exact', head: true })
      .gte('suspicion_score', 80)

    // Get average suspicion score
    const { data: avgData } = await supabase
      .from('suspicious_trades')
      .select('suspicion_score')

    const avgScore = avgData && avgData.length > 0
      ? avgData.reduce((sum, t: { suspicion_score: number }) => sum + t.suspicion_score, 0) / avgData.length
      : 0

    // Get recent activity (last 24 hours)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const { count: recentCount } = await supabase
      .from('suspicious_trades')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterday.toISOString())

    // Get top traders by suspicious activity
    const { data: topTraders } = await supabase
      .from('suspicious_trades')
      .select('trader_address, suspicion_score')
      .order('suspicion_score', { ascending: false })
      .limit(10)

    // Count unique traders
    const uniqueTraders = new Set(topTraders?.map((t: { trader_address: string }) => t.trader_address) || [])

    return NextResponse.json({
      success: true,
      stats: {
        total_suspicious_trades: totalCount || 0,
        high_suspicion_trades: highSuspicionCount || 0,
        average_suspicion_score: avgScore.toFixed(2),
        recent_24h: recentCount || 0,
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
