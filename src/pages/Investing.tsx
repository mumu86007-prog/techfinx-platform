import { useEffect, useMemo, useRef, useState } from 'react'

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

  // Quick range helpers for startDate
  const setYearsAgo = (years: number) => {
    const end = series?.timestamps?.[series.timestamps.length - 1] ?? Date.now()
    const d = new Date(end)
    d.setFullYear(d.getFullYear() - years)
    setStartDate(d.toISOString().slice(0, 10))
  }
  const setAll = () => {
    const first = series?.timestamps?.[0]
    if (first) setStartDate(new Date(first).toISOString().slice(0, 10))
  }

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

    const dataMinX = points[0].x
    const dataMaxX = points[points.length - 1].x

    // view aggregation: day/week/month/year
    const [agg, setAgg] = useState<'day' | 'week' | 'month' | 'year'>('day')
    const dayMs = 24 * 3600 * 1000
    const aggregate = (list: P[]) => {
      if (agg === 'day') return list
      const map = new Map<string, P>()
      for (const p of list) {
        const d = new Date(p.x)
        let key: string
        if (agg === 'week') {
          key = Math.floor(p.x / (7 * dayMs)).toString()
        } else if (agg === 'month') {
          key = `${d.getFullYear()}-${d.getMonth()}`
        } else {
          key = `${d.getFullYear()}`
        }
        // keep latest point in each bucket
        const existed = map.get(key)
        if (!existed || existed.x <= p.x) map.set(key, p)
      }
      return Array.from(map.values()).sort((a, b) => a.x - b.x)
    }
    const pts = aggregate(points)
    const minY = Math.min(
      ...pts.map((p) => Math.min(p.price, p.equity))
    )
    const maxY = Math.max(
      ...pts.map((p) => Math.max(p.price, p.equity))
    )

    // interactive view range
    const [viewMinX, setViewMinX] = useState<number>(dataMinX)
    const [viewMaxX, setViewMaxX] = useState<number>(dataMaxX)

    const clampRange = (min: number, max: number) => {
      const spanMin = 7 * 24 * 3600 * 1000 // at least a week
      let nmin = Math.max(dataMinX, Math.min(min, dataMaxX - spanMin))
      let nmax = Math.min(dataMaxX, Math.max(max, dataMinX + spanMin))
      if (nmax - nmin < spanMin) nmax = nmin + spanMin
      return [nmin, nmax] as const
    }

    const toX = (v: number) =>
      padLeft + ((v - viewMinX) / (viewMaxX - viewMinX)) * (width - padLeft - padRight)
    const toY = (v: number) =>
      padTop + (1 - (v - minY) / (maxY - minY)) * (height - padTop - padBottom)

    const pathOf = (getter: (p: P) => number) => {
      let d = ''
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]
        if (p.x < viewMinX || p.x > viewMaxX) continue
        const x = toX(p.x)
        const y = toY(getter(p))
        d += d ? ` L ${x} ${y}` : `M ${x} ${y}`
      }
      return d
    }

    // adaptive ticks (day-level when范围较短)
    const xTicks: number[] = []
    const rangeMs = viewMaxX - viewMinX
    const monthMs = 30 * dayMs
    const targetTicks = 10
    const step = rangeMs <= 180 * dayMs ? Math.max(dayMs, Math.floor(rangeMs / targetTicks / dayMs) * dayMs) : Math.max(monthMs, Math.floor(rangeMs / targetTicks / monthMs) * monthMs)
    const firstTick = Math.ceil(viewMinX / step) * step
    for (let t = firstTick; t <= viewMaxX; t += step) xTicks.push(t)
    const yTicks: number[] = []
    for (let i = 0; i <= 4; i++) {
      yTicks.push(minY + ((maxY - minY) * i) / 4)
    }

    // tooltip
    const [hoverX, setHoverX] = useState<number | null>(null)
    const nearestIndex = (mx: number) => {
      const target = viewMinX + ((mx - padLeft) / (width - padLeft - padRight)) * (viewMaxX - viewMinX)
      let lo = 0,
        hi = pts.length - 1
      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2)
        if (pts[mid].x < target) lo = mid + 1
        else hi = mid
      }
      return Math.max(0, Math.min(pts.length - 1, lo))
    }

    const idx = hoverX == null ? pts.length - 1 : nearestIndex(hoverX)
    const focus = pts[idx]

    // interactions: wheel zoom, mouse/touch pan and pinch
    const onWheel: React.WheelEventHandler<SVGSVGElement> = (e) => {
      e.preventDefault()
      const zoom = e.deltaY > 0 ? 1.1 : 0.9
      const rect = (e.target as SVGSVGElement).getBoundingClientRect()
      const mx = e.clientX - rect.left
      const pivot = viewMinX + ((mx - padLeft) / (width - padLeft - padRight)) * (viewMaxX - viewMinX)
      const newMin = pivot - (pivot - viewMinX) * zoom
      const newMax = pivot + (viewMaxX - pivot) * zoom
      const [nmin, nmax] = clampRange(newMin, newMax)
      setViewMinX(nmin)
      setViewMaxX(nmax)
    }

    const panState = useRef<{ dragging: boolean; startX: number; min: number; max: number; pinch?: number } | null>(null)
    const onPointerDown: React.PointerEventHandler<SVGSVGElement> = (e) => {
      const rect = (e.target as SVGSVGElement).getBoundingClientRect()
      panState.current = { dragging: true, startX: e.clientX - rect.left, min: viewMinX, max: viewMaxX }
      try { (e.target as Element).setPointerCapture?.(e.pointerId) } catch {}
    }
    const onPointerMove: React.PointerEventHandler<SVGSVGElement> = (e) => {
      if (!panState.current?.dragging) return
      const rect = (e.target as SVGSVGElement).getBoundingClientRect()
      const mx = e.clientX - rect.left
      const dx = mx - panState.current.startX
      const ratio = dx / (width - padLeft - padRight)
      const shift = ratio * (panState.current.max - panState.current.min)
      let nmin = panState.current.min - shift
      let nmax = panState.current.max - shift
      ;[nmin, nmax] = clampRange(nmin, nmax)
      setViewMinX(nmin)
      setViewMaxX(nmax)
    }
    const onPointerUp: React.PointerEventHandler<SVGSVGElement> = (e) => {
      if (panState.current) panState.current.dragging = false
      try { (e.target as Element).releasePointerCapture?.(e.pointerId) } catch {}
    }

    const onTouchMove: React.TouchEventHandler<SVGSVGElement> = (e) => {
      if (e.touches.length === 2) {
        const rect = (e.target as SVGSVGElement).getBoundingClientRect()
        const p1 = e.touches[0]
        const p2 = e.touches[1]
        const cx = (p1.clientX + p2.clientX) / 2 - rect.left
        const dist = Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY)
        const pivot = viewMinX + ((cx - padLeft) / (width - padLeft - padRight)) * (viewMaxX - viewMinX)
        const prev = panState.current?.pinch ?? dist
        const zoom = prev ? prev / dist : 1
        const newMin = pivot - (pivot - viewMinX) * zoom
        const newMax = pivot + (viewMaxX - pivot) * zoom
        const [nmin, nmax] = clampRange(newMin, newMax)
        setViewMinX(nmin)
        setViewMaxX(nmax)
        panState.current = { dragging: false, startX: 0, min: nmin, max: nmax, pinch: dist }
        e.preventDefault()
      }
    }

    const resetView = () => {
      setViewMinX(dataMinX)
      setViewMaxX(dataMaxX)
    }

    // export SVG/PNG
    const svgRef = useRef<SVGSVGElement | null>(null)
    const download = (name: string, href: string) => {
      const a = document.createElement('a')
      a.href = href
      a.download = name
      document.body.appendChild(a)
      a.click()
      a.remove()
    }
    const exportSVG = () => {
      if (!svgRef.current) return
      const blob = new Blob([svgRef.current.outerHTML], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      download(`${symbol.toLowerCase()}-chart.svg`, url)
      URL.revokeObjectURL(url)
    }
    const exportPNG = async () => {
      if (!svgRef.current) return
      const svg = svgRef.current
      const xml = new XMLSerializer().serializeToString(svg)
      const svg64 = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml)
      const img = new Image()
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      await new Promise<void>((res) => {
        img.onload = () => {
          ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--color-surface') || '#ffffff'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0)
          res()
        }
        img.src = svg64
      })
      download(`${symbol.toLowerCase()}-chart.png`, canvas.toDataURL('image/png'))
    }

    return (
      <div className="p-4 border border-border rounded-lg bg-surface">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="text-sm text-text-secondary">价格走势（起始：{startDate}）</div>
            <div className="flex items-center gap-1 text-xs">
              {(['day','week','month','year'] as const).map(k => (
                <button
                  key={k}
                  onClick={() => setAgg(k)}
                  className={`px-2 py-1 border border-border rounded ${agg===k? 'bg-primary text-white' : 'hover:bg-surface/60'}`}
                >
                  {k==='day'?'日':k==='week'?'周':k==='month'?'月':'年'}
                </button>
              ))}
            </div>
          </div>
          <div className="text-xs text-text-secondary space-x-2 flex items-center">
            <span>
              最新价：{focus.price.toFixed(2)} | 高：{maxY.toFixed(2)} | 低：{minY.toFixed(2)}
            </span>
            <span>定投市值：{focus.equity.toFixed(0)}</span>
            <button className="px-2 py-1 border border-border rounded hover:bg-surface/60" onClick={resetView}>重置视图</button>
            <button className="px-2 py-1 border border-border rounded hover:bg-surface/60" onClick={exportSVG}>导出SVG</button>
            <button className="px-2 py-1 border border-border rounded hover:bg-surface/60" onClick={exportPNG}>导出PNG</button>
          </div>
        </div>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-72"
          onMouseMove={(e) => setHoverX(e.nativeEvent.offsetX)}
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onTouchMove={onTouchMove}
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
                {rangeMs <= 180 * dayMs
                  ? new Date(t).toISOString().slice(0, 10)
                  : new Date(t).toISOString().slice(0, 7)}
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
          <div className="flex flex-wrap gap-2 text-xs mt-1">
            <button className="px-2 py-1 border border-border rounded hover:bg-surface/60" onClick={() => setYearsAgo(1)}>近1年</button>
            <button className="px-2 py-1 border border-border rounded hover:bg-surface/60" onClick={() => setYearsAgo(3)}>近3年</button>
            <button className="px-2 py-1 border border-border rounded hover:bg-surface/60" onClick={() => setYearsAgo(5)}>近5年</button>
            <button className="px-2 py-1 border border-border rounded hover:bg-surface/60" onClick={() => setYearsAgo(10)}>近10年</button>
            <button className="px-2 py-1 border border-border rounded hover:bg-surface/60" onClick={setAll}>全部</button>
          </div>
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


