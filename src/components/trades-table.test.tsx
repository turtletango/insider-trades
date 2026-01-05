import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TradesTable } from './trades-table'

describe('TradesTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state initially', () => {
    render(<TradesTable />)
    expect(screen.getByText('Loading trades...')).toBeInTheDocument()
  })

  it('displays empty state when no trades are found', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, trades: [] }),
      })
    ) as unknown as typeof fetch

    render(<TradesTable />)

    await waitFor(() => {
      expect(screen.getByText(/No suspicious trades found/)).toBeInTheDocument()
    })
  })

  it('displays trades after successful fetch', async () => {
    const mockTrades = [
      {
        id: '1',
        market_id: 'market-123',
        market_question: 'Will Bitcoin reach $100k?',
        trader_address: '0x1234567890abcdef1234567890abcdef12345678',
        outcome: 'Yes',
        price: 0.65,
        size: 1000,
        timestamp: '2024-01-01T00:00:00Z',
        suspicion_score: 85,
        suspicion_reasons: ['Large trade size', 'Unusual timing'],
      },
    ]

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, trades: mockTrades }),
      })
    ) as unknown as typeof fetch

    render(<TradesTable />)

    await waitFor(() => {
      expect(screen.getByText('Will Bitcoin reach $100k?')).toBeInTheDocument()
    })

    expect(screen.getByText('0x1234...5678')).toBeInTheDocument()
    expect(screen.getByText('Yes')).toBeInTheDocument()
    expect(screen.getByText('65.0%')).toBeInTheDocument()
    expect(screen.getByText('1,000')).toBeInTheDocument()
    expect(screen.getByText(/Critical \(85\.0\)/)).toBeInTheDocument()
  })

  it('calls analyze endpoint when Analyze button is clicked', async () => {
    const user = userEvent.setup()

    global.fetch = vi.fn((url) => {
      if (url === '/api/trades?limit=50') {
        return Promise.resolve({
          json: () => Promise.resolve({ success: true, trades: [] }),
        })
      }
      if (url === '/api/analyze') {
        return Promise.resolve({
          json: () => Promise.resolve({ success: true }),
        })
      }
      return Promise.reject(new Error('Unknown endpoint'))
    }) as unknown as typeof fetch

    render(<TradesTable />)

    await waitFor(() => {
      expect(screen.getByText(/No suspicious trades found/)).toBeInTheDocument()
    })

    const analyzeButton = screen.getByRole('button', { name: /Analyze New Trades/i })
    await user.click(analyzeButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/analyze', { method: 'POST' })
    })
  })

  it('shows analyzing state when analyze button is clicked', async () => {
    const user = userEvent.setup()

    global.fetch = vi.fn((url) => {
      if (url === '/api/trades?limit=50') {
        return Promise.resolve({
          json: () => Promise.resolve({ success: true, trades: [] }),
        })
      }
      if (url === '/api/analyze') {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              json: () => Promise.resolve({ success: true }),
            })
          }, 100)
        })
      }
      return Promise.reject(new Error('Unknown endpoint'))
    }) as unknown as typeof fetch

    render(<TradesTable />)

    await waitFor(() => {
      expect(screen.getByText(/No suspicious trades found/)).toBeInTheDocument()
    })

    const analyzeButton = screen.getByRole('button', { name: /Analyze New Trades/i })
    await user.click(analyzeButton)

    expect(screen.getByText('Analyzing...')).toBeInTheDocument()
  })

  it('renders table with correct headers', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, trades: [] }),
      })
    ) as unknown as typeof fetch

    render(<TradesTable />)

    await waitFor(() => {
      expect(screen.getByText('Suspicious Trades')).toBeInTheDocument()
    })

    expect(screen.getByText('Trades flagged with high probability of insider information')).toBeInTheDocument()
  })

  it('handles fetch errors gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    global.fetch = vi.fn(() => Promise.reject(new Error('Network error'))) as unknown as typeof fetch

    render(<TradesTable />)

    await waitFor(() => {
      expect(screen.getByText(/No suspicious trades found/)).toBeInTheDocument()
    })

    expect(consoleError).toHaveBeenCalled()
    consoleError.mockRestore()
  })
})
