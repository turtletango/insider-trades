import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { StatsDashboard } from './stats-dashboard'

describe('StatsDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state initially', () => {
    render(<StatsDashboard />)
    expect(screen.getAllByText('Loading...').length).toBeGreaterThan(0)
  })

  it('displays stats after successful fetch', async () => {
    const mockStats = {
      total_suspicious_trades: 42,
      high_suspicion_trades: 10,
      average_suspicion_score: '75.5',
      recent_24h: 5,
      unique_suspicious_traders: 15,
    }

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, stats: mockStats }),
      })
    ) as unknown as typeof fetch

    render(<StatsDashboard />)

    await waitFor(() => {
      expect(screen.getByText('42')).toBeInTheDocument()
    })

    expect(screen.getByText('Total Suspicious Trades')).toBeInTheDocument()
    expect(screen.getByText('High Risk Trades')).toBeInTheDocument()
    expect(screen.getByText('Average Score')).toBeInTheDocument()
    expect(screen.getByText('Unique Traders')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('75.5')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
    expect(screen.getByText('5 new in 24h')).toBeInTheDocument()
  })

  it('renders null when stats fetch is unsuccessful', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: false }),
      })
    ) as unknown as typeof fetch

    const { container } = render(<StatsDashboard />)

    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
  })

  it('handles fetch errors gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    global.fetch = vi.fn(() => Promise.reject(new Error('Network error'))) as unknown as typeof fetch

    const { container } = render(<StatsDashboard />)

    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })

    expect(consoleError).toHaveBeenCalled()
    consoleError.mockRestore()
  })

  it('calls fetch with correct endpoint', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: false }),
      })
    ) as unknown as typeof fetch

    render(<StatsDashboard />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/stats')
    })
  })
})
