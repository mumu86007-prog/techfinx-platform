/*
  Fetch daily historical close prices for NDX (^NDX) and SPX (^GSPC) from Yahoo Finance chart API
  and write simplified series to public/data/markets/{ndx,spx}.json

  Usage: pnpm tsx scripts/fetch-markets.ts
*/
import { writeFile, mkdir } from 'fs/promises'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { setTimeout as delay } from 'timers/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

type YahooChartResponse = {
  chart?: {
    result?: Array<{
      timestamp?: number[]
      indicators?: { quote?: Array<{ close?: Array<number | null> }> }
    }>
  }
}

async function fetchChart(symbol: string, range = '10y', interval = '1d') {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!res.ok) throw new Error(`Failed to fetch ${symbol}: ${res.status}`)
  const data = (await res.json()) as YahooChartResponse
  const r = data.chart?.result?.[0]
  if (!r) throw new Error(`No result for ${symbol}`)
  const timestamps = (r.timestamp ?? []).map((t) => (t as number) * 1000)
  const closes = (r.indicators?.quote?.[0]?.close ?? []).map((v) => (v == null ? NaN : (v as number)))
  const filtered: { timestamps: number[]; closes: number[] } = { timestamps: [], closes: [] }
  for (let i = 0; i < timestamps.length; i++) {
    const c = closes[i]
    if (!isFinite(c)) continue
    filtered.timestamps.push(timestamps[i])
    filtered.closes.push(c)
  }
  return filtered
}

async function ensureDir(p: string) {
  await mkdir(p, { recursive: true })
}

async function main() {
  const outDir = resolve(__dirname, '..', 'public', 'data', 'markets')
  await ensureDir(outDir)

  const tasks: Array<{ symbol: string; alias: 'ndx' | 'spx' }> = [
    { symbol: '^NDX', alias: 'ndx' },
    { symbol: '^GSPC', alias: 'spx' },
  ]

  for (const t of tasks) {
    try {
      const series = await fetchChart(t.symbol)
      await writeFile(resolve(outDir, `${t.alias}.json`), JSON.stringify(series, null, 2), 'utf8')
      console.log(`Wrote ${t.alias}.json with ${series.timestamps.length} points`)
      await delay(300)
    } catch (e) {
      console.error(`Failed ${t.alias}:`, e)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


