import { StatsDashboard } from '@/components/stats-dashboard'
import { TradesTable } from '@/components/trades-table'

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Polymarket Insider Trading Detector
          </h1>
          <p className="text-muted-foreground text-lg">
            Real-time analysis of Polymarket trades to identify potential insider trading activity
          </p>
        </header>

        <StatsDashboard />

        <TradesTable />

        <footer className="text-center text-sm text-muted-foreground pt-8">
          <p>
            This tool analyzes trading patterns on Polymarket to detect suspicious activity.
            Data is for informational purposes only.
          </p>
        </footer>
      </div>
    </main>
  )
}
