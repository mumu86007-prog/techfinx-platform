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
    type P = { x: number; price: number; equity: number }
    const points: P[] = []
    let currentMonthKey = ''
    let units = 0
    for (let i = 0; i < data.timestamps.length; i++) {
      const ts = data.timestamps[i]
      const price = data.closes[i]
      if (ts < start) continue
      const d = new Date(ts)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      if (key !== currentMonthKey) {
        units += monthly / price
        currentMonthKey = key
      }
      points.push({ x: ts, price, equity: units * price })
    }
    if (points.length === 0) return <div className="text-text-secondary">暂无价格数据</div>

    const width = 960
    const height = 300
    const padLeft = 48
    const padBottom = 28
    const padTop = 8
    const padRight = 12

    const minX = points[0].x
    const maxX = points[points.length - 1].x
    const minY = Math.min(
      ...points.map((p) => Math.min(p.price, p.equity))
    )
    const maxY = Math.max(
      ...points.map((p) => Math.max(p.price, p.equity))
    )

    const toX = (v: number) =>
      padLeft + ((v - minX) / (maxX - minX)) * (width - padLeft - padRight)
    const toY = (v: number) =>
      padTop + (1 - (v - minY) / (maxY - minY)) * (height - padTop - padBottom)

    const pathOf = (getter: (p: P) => number) => {
      let d = ''
      points.forEach((p, i) => {
        const x = toX(p.x)
        const y = toY(getter(p))
        d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
      })
      return d
    }

    const xTicks: number[] = []
    const tickCount = 6
    for (let i = 0; i <= tickCount; i++) {
      xTicks.push(minX + ((maxX - minX) * i) / tickCount)
    }
    const yTicks: number[] = []
    for (let i = 0; i <= 4; i++) {
      yTicks.push(minY + ((maxY - minY) * i) / 4)
    }

    // tooltip
    const [hoverX, setHoverX] = useState<number | null>(null)
    const nearestIndex = (mx: number) => {
      const target = minX + ((mx - padLeft) / (width - padLeft - padRight)) * (maxX - minX)
      let lo = 0,
        hi = points.length - 1
      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2)
        if (points[mid].x < target) lo = mid + 1
        else hi = mid
      }
      return Math.max(0, Math.min(points.length - 1, lo))
    }

    const idx = hoverX == null ? points.length - 1 : nearestIndex(hoverX)
    const focus = points[idx]

    return (
      <div className="p-4 border border-border rounded-lg bg-surface">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-text-secondary">价格走势（起始：{startDate}）</div>
          <div className="text-xs text-text-secondary space-x-4">
            <span>
              最新价：{focus.price.toFixed(2)} | 高：{maxY.toFixed(2)} | 低：{minY.toFixed(2)}
            </span>
            <span>定投市值：{focus.equity.toFixed(0)}</span>
          </div>
        </div>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-72"
          onMouseMove={(e) => setHoverX(e.nativeEvent.offsetX)}
          onMouseLeave={() => setHoverX(null)}
        >
          <rect x={0} y={0} width={width} height={height} fill="transparent" />
          {/* axes */}
          <line
            x1={padLeft}
            y1={height - padBottom}
            x2={width - padRight}
            y2={height - padBottom}
            className="stroke-border"
            strokeWidth={1}
          />
          <line
            x1={padLeft}
            y1={padTop}
            x2={padLeft}
            y2={height - padBottom}
            className="stroke-border"
            strokeWidth={1}
          />
          {xTicks.map((t, i) => (
            <g key={i}>
              <line
                x1={toX(t)}
                y1={height - padBottom}
                x2={toX(t)}
                y2={height - padBottom + 4}
                className="stroke-border"
              />
              <text
                x={toX(t)}
                y={height - 6}
                textAnchor="middle"
                className="fill-text-secondary text-[10px]"
              >
                {new Date(t).toISOString().slice(0, 7)}
              </text>
            </g>
          ))}
          {yTicks.map((t, i) => (
            <g key={i}>
              <line
                x1={padLeft - 4}
                y1={toY(t)}
                x2={padLeft}
                y2={toY(t)}
                className="stroke-border"
              />
              <text
                x={padLeft - 6}
                y={toY(t) + 3}
                textAnchor="end"
                className="fill-text-secondary text-[10px]"
              >
                {t.toFixed(0)}
              </text>
            </g>
          ))}

          {/* lines */}
          <path d={pathOf((p) => p.price)} fill="none" strokeWidth={2} className="stroke-primary" />
          <path d={pathOf((p) => p.equity)} fill="none" strokeWidth={1.5} className="stroke-green-500" />

          {/* focus line */}
          {hoverX != null && (
            <line
              x1={hoverX}
              y1={padTop}
              x2={hoverX}
              y2={height - padBottom}
              className="stroke-border"
              strokeDasharray="3 3"
            />
          )}
        </svg>
        <div className="flex items-center gap-3 text-xs text-text-secondary mt-2">
          <div className="flex items-center gap-1"><span className="inline-block w-3 h-1 bg-primary"></span> 价格</div>
          <div className="flex items-center gap-1"><span className="inline-block w-3 h-1 bg-green-500"></span> 定投市值</div>
        </div>
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


