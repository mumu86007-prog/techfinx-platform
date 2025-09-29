import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Activity, ArrowUpRight, BarChart3, Flame, Newspaper, TrendingUp } from 'lucide-react'
import PageHero from '../sections/PageHero'

type HotEntry = {
  source: string
  title: string
  link: string
  publishedAt: string
  summary: string
}

type HotPayload = {
  generatedAt: string
  sources: string[]
  entries: HotEntry[]
}

const nextSteps = [
  '为焦点事件撰写 150 字深度点评，供《深度专栏》复用。',
  '制作 16:9 版资讯卡片，安排微博/小红书渠道下午 3 点前发布。',
  '与合作数据方同步市场情绪指标，实现自动化更新。',
]

const CATEGORY_MAP: Array<{ label: string; keywords: RegExp }> = [
  { label: '宏观政策', keywords: /(央行|监管|政策|政府|监管|法规|规制|authority|ban|regulation)/i },
  { label: '商业落地', keywords: /(发布|推出|合作|平台|产品|服务|部署|launch|platform)/i },
  { label: '投融资/资本', keywords: /(融资|投资|fund|valuation|并购|收购|venture|loan|raise)/i },
]

const getCategoryLabel = (entry: HotEntry) => {
  for (const { label, keywords } of CATEGORY_MAP) {
    if (keywords.test(`${entry.title} ${entry.summary}`)) return label
  }
  return '行业观察'
}

const formatDateLabel = (iso?: string) => {
  if (!iso) return ''
  const date = new Date(iso)
  return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
}

const formatTime = (iso: string) => {
  const date = new Date(iso)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

const SentimentStat = ({ label, value, unit, hint }: { label: string; value: string; unit?: string; hint: string }) => (
  <div className="rounded-m border border-border/60 bg-background/80 p-4">
    <p className="text-xs uppercase tracking-wide text-text-secondary">{label}</p>
    <div className="mt-2 flex items-end gap-1 text-2xl font-semibold text-primary">
      <span>{value}</span>
      {unit ? <span className="text-sm font-medium text-text-secondary">{unit}</span> : null}
    </div>
    <p className="mt-2 text-xs text-text-tertiary">{hint}</p>
  </div>
)
const LOADING_STATE: HotPayload = {
  generatedAt: new Date().toISOString(),
  sources: [],
  entries: [],
}

const Hot = () => {
  const [payload, setPayload] = useState<HotPayload>(LOADING_STATE)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/data/hot/latest.json?ts=${Date.now()}`, {
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
          },
        })
        if (!response.ok) {
          throw new Error(`请求失败：${response.status}`)
        }
        const data = (await response.json()) as HotPayload
        setPayload(data)
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        console.error('加载热点数据失败', err)
        setError('热点数据暂时无法获取，请稍后刷新。')
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [])

  const entries = payload.entries ?? []
  const generatedLabel = formatDateLabel(payload.generatedAt)

  const focusStories = useMemo(() => entries.slice(0, 2), [entries])

  const boardHighlights = useMemo(() => {
    const map = new Map<string, HotEntry[]>()
    entries.forEach((entry) => {
      const label = getCategoryLabel(entry)
      const existing = map.get(label) ?? []
      if (existing.length < 4) {
        existing.push(entry)
      }
      map.set(label, existing)
    })

    return Array.from(map.entries()).map(([label, items]) => ({
      label,
      items,
    }))
  }, [entries])

  const timeline = useMemo(
    () =>
      entries
        .slice()
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
    [entries],
  )

  const sentiment = useMemo(() => {
    if (!entries.length) {
      return [
        { label: '今日更新', value: '0', unit: '篇', hint: '等待最新抓取' },
        { label: '数据源', value: `${payload.sources.length}`, unit: '个', hint: '已配置的 RSS 来源' },
        { label: '生成时间', value: '-:-', hint: '尚无时间线' },
      ]
    }

    const latest = entries[0]
    const firstTime = formatTime(latest.publishedAt)
    const earliest = entries[entries.length - 1]
    const coverageHours = (() => {
      const earliestDate = earliest ? new Date(earliest.publishedAt) : new Date(latest.publishedAt)
      const diff = new Date(latest.publishedAt).getTime() - earliestDate.getTime()
      return Math.max(1, Math.round(Math.abs(diff) / (1000 * 60 * 60)))
    })()

    return [
      { label: '今日更新', value: `${entries.length}`, unit: '篇', hint: '抓取到的金融科技相关新闻' },
      { label: '最新时间', value: firstTime, hint: '最近更新时间（本地时间）' },
      { label: '覆盖时长', value: `${coverageHours}`, unit: '小时', hint: '新闻覆盖时间跨度' },
    ]
  }, [entries, payload.sources])

  const todayLabel = generatedLabel || new Date().toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-12">
      <Helmet>
        <title>热点追踪 · TechFinX</title>
        <meta
          name="description"
          content="TechFinX 热点追踪栏目：筛选当日最值得关注的金融科技政策、商业化、创投事件，并结合市场情绪指标与行动建议。"
        />
      </Helmet>

      <PageHero
        eyebrow={`Real-time Pulse · ${todayLabel}`}
        title="热点追踪 · 当日必读"
        description="我们在每天上午 9:30 前完成资讯筛选，聚焦 AI+金融的政策动向、商业落地与投融资脉搏，让你 3 分钟掌握今日关键信号。"
        primaryAction={{ label: '订阅深度周报', to: '/deep-dive' }}
        secondaryAction={{ label: '查看栏目规划', to: '/about' }}
      />

      <section className="rounded-l border border-border bg-primary/5 p-4 text-sm text-text-secondary">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">数据来源</span>
          {payload.sources.length ? (
            <p>
              {payload.sources.join(' · ')}
              {loading ? '（更新中…）' : ''}
            </p>
          ) : (
            <p>正在收集数据源...</p>
          )}
        </div>
      </section>

      {error ? (
        <div className="rounded-l border border-red-300 bg-red-50 p-6 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="rounded-l border border-border bg-surface/60 p-6 shadow-light">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-wide text-primary/80">今日焦点</p>
                <h2 className="mt-2 text-2xl font-semibold text-text-primary">两大事件速览</h2>
              </div>
              <Flame className="h-8 w-8 text-primary" aria-hidden />
            </div>
            <div className="mt-6 space-y-6">
              {focusStories.length === 0 && !loading ? (
                <p className="text-sm text-text-secondary">暂无焦点，即将刷新。</p>
              ) : null}
              {focusStories.map((item) => (
                <article key={item.link} className="space-y-3 rounded-m border border-border/70 bg-background/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-text-secondary">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary">
                      <TrendingUp className="h-3.5 w-3.5" aria-hidden />
                      {getCategoryLabel(item)}
                    </span>
                    <span>{formatTime(item.publishedAt)}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-text-secondary">{item.summary || '暂无摘要'}</p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-600"
                  >
                    查看原文 <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </a>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-l border border-border bg-surface p-6 shadow-light">
            <div className="flex items-center gap-3">
              <Newspaper className="h-6 w-6 text-primary" aria-hidden />
              <h2 className="text-xl font-semibold text-text-primary">板块脉搏</h2>
            </div>
            <div className="mt-5 grid gap-6 md:grid-cols-2">
              {boardHighlights.length === 0 && !loading ? (
                <p className="text-sm text-text-secondary md:col-span-2">等待最新板块数据...</p>
              ) : null}
              {boardHighlights.map((board) => (
                <div key={board.label} className="rounded-m border border-border/70 bg-background/60 p-4">
                  <p className="text-xs uppercase tracking-wide text-text-secondary">{board.label}</p>
                  <ul className="mt-3 space-y-3 text-sm text-text-secondary">
                    {board.items.map((news) => (
                      <li key={news.link} className="leading-relaxed">
                        <a
                          href={news.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-text-primary hover:text-primary"
                        >
                          {news.title}
                        </a>
                        <p className="mt-1 text-xs text-text-tertiary">{news.summary}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-l border border-primary/50 bg-gradient-to-tr from-primary/10 via-background to-background p-6 shadow-light">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-primary" aria-hidden />
              <h2 className="text-xl font-semibold text-text-primary">今日情绪指标</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {sentiment.map((metric) => (
                <SentimentStat key={metric.label} {...metric} />
              ))}
            </div>
          </div>

          <div className="rounded-l border border-border bg-surface p-6 shadow-light">
            <div className="flex items-center gap-3">
              <Activity className="h-6 w-6 text-primary" aria-hidden />
              <h2 className="text-xl font-semibold text-text-primary">时间线速递</h2>
            </div>
            <ol className="mt-6 space-y-4">
              {timeline.length === 0 && !loading ? (
                <p className="text-sm text-text-secondary">暂无时间线数据，稍后自动刷新。</p>
              ) : null}
              {timeline.map((item) => (
                <li key={item.link} className="relative border-l border-border/70 pl-6">
                  <span className="absolute left-[-6px] top-1.5 h-3 w-3 rounded-full border border-primary bg-background" aria-hidden />
                  <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                    <span className="font-semibold text-text-primary">{formatTime(item.publishedAt)}</span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{item.source}</span>
                    <a
                      className="inline-flex items-center gap-1 text-primary hover:text-primary-600"
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      原文来源 <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-text-primary">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.summary}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-l border border-border bg-surface p-6 shadow-light">
            <h3 className="text-base font-semibold text-text-primary">今天的执行清单</h3>
            <ul className="mt-4 space-y-3 text-sm text-text-secondary">
              {nextSteps.map((step) => (
                <li key={step} className="flex gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary" aria-hidden />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-l border border-dashed border-primary/60 bg-primary/5 p-6 text-sm text-text-secondary shadow-light">
            <p className="text-base font-semibold text-text-primary">内容来源与协同</p>
            <ul className="mt-3 space-y-2">
              <li>· RSS：金融时报、财联社、The Information FinTech 专栏</li>
              <li>· X 列表：金融科技政策、风投观察账号 30+ 个</li>
              <li>· 数据库：CB Insights、PitchBook、Wind 行业快报</li>
            </ul>
            <p className="mt-4">
              合作与勘误请联系
              <a className="ml-1 text-primary hover:underline" href="mailto:Mumu86007@gmail.com">
                Mumu86007@gmail.com
              </a>
            </p>
          </div>

          <div className="rounded-l border border-border bg-surface p-6 shadow-light">
            <h3 className="text-base font-semibold text-text-primary">如何使用本栏目</h3>
            <p className="mt-3 text-sm text-text-secondary">
              建议收藏此页面，并在每日开盘前的晨会或团队例会上使用。上方焦点事件可进入深度专栏，情绪指标与时间线用于把握短期市场节奏。
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default Hot



