import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './page'

// Mock the child components
vi.mock('@/components/stats-dashboard', () => ({
  StatsDashboard: () => <div data-testid="stats-dashboard">StatsDashboard Component</div>,
}))

vi.mock('@/components/trades-table', () => ({
  TradesTable: () => <div data-testid="trades-table">TradesTable Component</div>,
}))

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)
    expect(screen.getByText('Polymarket Insider Trading Detector')).toBeInTheDocument()
  })

  it('renders the description text', () => {
    render(<Home />)
    expect(
      screen.getByText(/Real-time analysis of Polymarket trades to identify potential insider trading activity/)
    ).toBeInTheDocument()
  })

  it('renders the StatsDashboard component', () => {
    render(<Home />)
    expect(screen.getByTestId('stats-dashboard')).toBeInTheDocument()
  })

  it('renders the TradesTable component', () => {
    render(<Home />)
    expect(screen.getByTestId('trades-table')).toBeInTheDocument()
  })

  it('renders the footer disclaimer', () => {
    render(<Home />)
    expect(
      screen.getByText(/This tool analyzes trading patterns on Polymarket to detect suspicious activity/)
    ).toBeInTheDocument()
  })

  it('has proper semantic structure with main element', () => {
    const { container } = render(<Home />)
    expect(container.querySelector('main')).toBeInTheDocument()
  })
})
