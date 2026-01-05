import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * GET /api/trades
 * Retrieves suspicious trades from Supabase
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const minScore = parseFloat(searchParams.get('minScore') || '0')
    const offset = parseInt(searchParams.get('offset') || '0')

    const query = supabase
      .from('suspicious_trades')
      .select('*')
      .gte('suspicion_score', minScore)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      trades: data || [],
      count: data?.length || 0,
      total: count,
    })
  } catch (error) {
    console.error('Error fetching trades:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
