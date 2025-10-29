import { useEffect, useMemo, useState } from 'react'

type MarketSeries = {
  symbol: string
  timestamps: number[]
  closes: number[]
}

type DcaResult = {
  totalContribution: number
  totalUnits: number
  currentPrice: number
  currentValue: number
  gainPct: number
  months: number
}

function computeMonthlyDca(series: MarketSeries, monthlyAmount: number, startDate: string): DcaResult | null {
  if (!series.timestamps.length || !series.closes.length) return null
  const start = new Date(startDate)
  if (isNaN(start.getTime())) return null
  const points = series.timestamps.map((t, i) => ({ date: new Date(t), price: series.closes[i] }))

  let currentMonthKey = ''
  let totalUnits = 0
  let contributionCount = 0
  for (const p of points) {
    if (p.date < start) continue
    const key = `${p.date.getFullYear()}-${p.date.getMonth() + 1}`
    if (key !== currentMonthKey) {
      // invest at the first trading day seen for the month
      totalUnits += monthlyAmount / p.price
      contributionCount += 1
      currentMonthKey = key
    }
  }

  const latestPrice = points[points.length - 1]?.price ?? 0
  const totalContribution = contributionCount * monthlyAmount
  const currentValue = totalUnits * latestPrice
  const gainPct = totalContribution === 0 ? 0 : (currentValue - totalContribution) / totalContribution

  return {
    totalContribution,
    totalUnits,
    currentPrice: latestPrice,
    currentValue,
    gainPct,
    months: contributionCount,
  }
}

async function fetchSeries(symbol: 'NDX' | 'SPX'): Promise<MarketSeries | null> {
  try {
    const path = symbol === 'NDX' ? '/data/markets/ndx.json' : '/data/markets/spx.json'
    const res = await fetch(path)
    if (!res.ok) return null
    const data = await res.json()
    return {
      symbol,
      timestamps: data.timestamps ?? [],
      closes: data.closes ?? [],
    }
  } catch {
    return null
  }
}

const Investing = () => {
  const [symbol, setSymbol] = useState<'NDX' | 'SPX'>('NDX')
  const [monthly, setMonthly] = useState<number>(1000)
  const [startDate, setStartDate] = useState<string>('2010-01-01')
  const [series, setSeries] = useState<MarketSeries | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchSeries(symbol).then((s) => {
      if (!mounted) return
      setSeries(s)
      setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [symbol])

  const dca = useMemo(() => {
    if (!series) return null
    return computeMonthlyDca(series, monthly, startDate)
  }, [series, monthly, startDate])

  const Chart = ({ data }: { data: MarketSeries }) => {
    const start = new Date(startDate).getTime()
    const filtered: Array<{ x: number; y: number }> = []
    for (let i = 0; i < data.timestamps.length; i++) {
      if (data.timestamps[i] < start) continue
      filtered.push({ x: data.timestamps[i], y: data.closes[i] })
    }
    if (filtered.length === 0) {
      return <div className="text-text-secondary">暂无价格数据</div>
    }
    const minY = Math.min(...filtered.map((p) => p.y))
    const maxY = Math.max(...filtered.map((p) => p.y))
    const minX = filtered[0].x
    const maxX = filtered[filtered.length - 1].x
    const width = 900
    const height = 240
    const pad = 12

    const toX = (v: number) => pad + ((v - minX) / (maxX - minX)) * (width - pad * 2)
    const toY = (v: number) => height - pad - ((v - minY) / (maxY - minY)) * (height - pad * 2)
    let d = ''
    filtered.forEach((p, i) => {
      const x = toX(p.x)
      const y = toY(p.y)
      d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
    })

    return (
      <div className="p-4 border border-border rounded-lg bg-surface">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-text-secondary">价格走势（起始：{startDate}）</div>
          <div className="text-sm text-text-secondary">
            最新价：{filtered[filtered.length - 1].y.toFixed(2)} | 高：{maxY.toFixed(2)} | 低：{minY.toFixed(2)}
          </div>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-60">
          <rect x={0} y={0} width={width} height={height} fill="transparent" />
          <path d={d} fill="none" strokeWidth={2} className="stroke-primary" />
        </svg>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">定投跟踪</h1>
        <p className="text-text-secondary">追踪纳斯达克100与标普500的长期定投表现</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-sm text-text-secondary">指数</label>
          <select
            className="border border-border bg-surface rounded-md p-2"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value as 'NDX' | 'SPX')}
          >
            <option value="NDX">纳斯达克100 (NDX)</option>
            <option value="SPX">标普500 (SPX)</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm text-text-secondary">每月投入 (USD)</label>
          <input
            type="number"
            min={1}
            className="border border-border bg-surface rounded-md p-2 w-full"
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-text-secondary">起始日期</label>
          <input
            type="date"
            className="border border-border bg-surface rounded-md p-2 w-full"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
      </div>

      {loading && <div className="text-text-secondary">加载中…（如无数据，请先运行数据抓取脚本）</div>}

      {!loading && dca && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 p-4 border border-border rounded-lg bg-surface">
            <div className="text-sm text-text-secondary">投入总额</div>
            <div className="text-2xl font-semibold">${dca.totalContribution.toFixed(0)}</div>
            <div className="text-sm text-text-secondary">定投月数：{dca.months}</div>
          </div>
          <div className="space-y-2 p-4 border border-border rounded-lg bg-surface">
            <div className="text-sm text-text-secondary">当前市值</div>
            <div className="text-2xl font-semibold">${dca.currentValue.toFixed(0)}</div>
            <div className={`text-sm ${dca.gainPct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              收益率：{(dca.gainPct * 100).toFixed(2)}%
            </div>
          </div>
        </div>
      )}

      {!loading && series && <Chart data={series} />}

      {!loading && !dca && (
        <div className="text-text-secondary">暂无数据。请运行数据脚本生成 /data/markets/*.json。</div>
      )}
    </div>
  )
}

export default Investing


