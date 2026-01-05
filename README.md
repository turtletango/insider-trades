# Polymarket Insider Trading Detector

A Next.js web application that analyzes Polymarket trades to identify potential insider trading activity using pattern detection algorithms.

## Features

- **Real-time Analysis**: Fetches and analyzes recent trades from Polymarket
- **Suspicion Scoring**: Algorithmic detection based on:
  - Large trade sizes
  - Extreme price entries
  - Timing relative to market resolution
  - Unusual trading patterns
- **Dashboard**: Visual statistics and metrics
- **Trade Tracking**: Stores suspicious trades in Supabase for historical analysis
- **Modern UI**: Built with Tailwind CSS and Shadcn components

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **API**: Polymarket CLOB API & Gamma API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Git

### Installation

1. Clone the repository

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new project at supabase.com
   - Run the SQL schema from `supabase-schema.sql` in the Supabase SQL editor
   - Get your project URL and anon key

4. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
POLYMARKET_API_URL=https://clob.polymarket.com
```

5. Run the development server:
```bash
npm run dev
```

6. Open http://localhost:3000 in your browser

## Usage

1. **View Dashboard**: The homepage displays statistics about detected suspicious trades
2. **Analyze Trades**: Click "Analyze New Trades" to scan recent Polymarket activity
3. **Review Results**: Browse the table of suspicious trades with suspicion scores and reasons
4. **Explore Markets**: Click the external link icon to view markets on Polymarket

## Deployment to Vercel

1. Push your code to GitHub

2. Import project to Vercel and configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `POLYMARKET_API_URL`

3. Deploy!

## License

MIT

## Disclaimer

This tool is for educational and informational purposes only.
