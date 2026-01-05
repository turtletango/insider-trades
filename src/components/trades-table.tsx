'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { SuspiciousTrade } from '@/types/polymarket'
import { RefreshCw, ExternalLink } from 'lucide-react'

export function TradesTable() {
  const [trades, setTrades] = useState<SuspiciousTrade[]>([])
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    analyzeTrades()
  }, [])

  const analyzeTrades = async () => {
    try {
      setAnalyzing(true)
      setLoading(true)
      const response = await fetch('/api/analyze', { method: 'POST' })
      const data = await response.json()
      if (data.success) {
        // Set trades directly from analysis results
        setTrades(data.trades || [])
      }
    } catch (error) {
      console.error('Error analyzing trades:', error)
    } finally {
      setAnalyzing(false)
      setLoading(false)
    }
  }

  const getSuspicionBadge = (score: number) => {
    if (score >= 80) {
      return <Badge variant="destructive">Critical ({score.toFixed(1)})</Badge>
    } else if (score >= 70) {
      return <Badge className="bg-orange-500 hover:bg-orange-600">High ({score.toFixed(1)})</Badge>
    } else if (score >= 60) {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Medium ({score.toFixed(1)})</Badge>
    } else {
      return <Badge variant="secondary">Low ({score.toFixed(1)})</Badge>
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getPolymarketUrl = (marketId: string) => {
    return `https://polymarket.com/event/${marketId}`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Suspicious Trades</CardTitle>
            <CardDescription>
              Trades flagged with high probability of insider information
            </CardDescription>
          </div>
          <Button
            onClick={analyzeTrades}
            disabled={analyzing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${analyzing ? 'animate-spin' : ''}`} />
            {analyzing ? 'Analyzing...' : 'Analyze New Trades'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading trades...</div>
        ) : trades.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No suspicious trades found. Click &quot;Analyze New Trades&quot; to scan recent activity.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Market</TableHead>
                <TableHead>Trader</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Size</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className="max-w-xs">
                    <div className="flex items-center gap-2">
                      <div className="truncate" title={trade.market_question}>
                        {trade.market_question}
                      </div>
                      <a
                        href={getPolymarketUrl(trade.market_id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {trade.suspicion_reasons.slice(0, 2).map((reason, i) => (
                        <div key={i}>{reason}</div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs">{formatAddress(trade.trader_address)}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{trade.outcome}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {(trade.price * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {trade.size.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(trade.price * trade.size)}
                  </TableCell>
                  <TableCell>
                    {getSuspicionBadge(trade.suspicion_score)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(trade.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
