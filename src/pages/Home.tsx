import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  Activity,
  ArrowUpRight,
  CalendarCheck,
  BarChart3,
  Clock3,
  Flame,
  ListChecks,
  LineChart,
  Users,
  Sparkles,
  Tag,
  Target,
  TrendingUp,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHero from '../sections/PageHero'

const insightTabs = ['全部', 'TechFinX 日报', '行业动态', '产品发布', '研究报告'] as const

type InsightCategory = (typeof insightTabs)[number]

type InsightItem = {
  id: string
  title: string
  summary: string
  cover: string
  author: string
  source: string
  timeAgo: string
  metrics: { likes: number; bookmarks: number }
  category: InsightCategory
  link: string
  tags: string[]
  content: string[]
}

type HotEntry = {
  source: string
  title: string
  link: string
  publishedAt: string
  summary: string
  category: string
}

const defaultInsightItems: InsightItem[] = [
  {
    id: 'gemini-os',
    title: 'Google 团队展示生成式操作系统原型：界面随需求实时生成',
    summary:
      'Gemini 2.5 Flash-Lite 推动“即时界面”，系统根据用户行为临时生成工具面板，探索下一代人机交互范式。',
    cover: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=960&q=80',
    author: 'TechFinX 情报组',
    source: 'TechFinX 内部监测',
    timeAgo: '3 小时前',
    metrics: { likes: 62, bookmarks: 24 },
    category: 'TechFinX 日报',
    link: '/hot',
    tags: ['界面生成', 'AI 操作系统', 'Gemini 2.5'],
    content: [
      'Google 团队用 Gemini 2.5 Flash-Lite 做了一个概念实验，人机交互不再靠死板菜单，而是 AI 根据行为实时生成界面。',
      '当用户操作“保存笔记”时，AI 会生成一个合适的工具页面，而不是跳出传统对话框。操作次数越多，界面越会理解你的偏好。',
      '对金融机构来说，这类真实生成界面意味着可以为不同业务线定制仪表盘，帮助合规、审计和客服更快调取所需数据。',
    ],
  },
  {
    id: 'gemini-upgrade',
    title: 'Gemini 2.5 Flash 系列升级：多模态推理时延下降 32%',
    summary: '聚焦金融风控与客服场景，提供低功耗推理方案，支持实时决策与风险评估。',
    cover: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=960&q=80',
    author: 'TechFinX 产品观察',
    source: 'TechFinX 产品雷达',
    timeAgo: '今日 09:15',
    metrics: { likes: 48, bookmarks: 31 },
    category: '产品发布',
    link: '/hot',
    tags: ['产品升级', '实时推理', '低时延'],
    content: [
      'Gemini Flash 升级后对多模态推理的响应时间缩短 32%，在智能客服、风控模型中可以显著降低排队等待。',
      '金融行业可以将其嵌入反洗钱监控、客服陪练等场景，实现实时策略推荐。',
      '配合安全沙箱能力，模型可对敏感数据做“只读分析”，符合银行内部访问规范。',
    ],
  },
  {
    id: 'deepmind-robot',
    title: 'Google DeepMind 推出智能机器人模型：主动思考与自主执行',
    summary: '服务金融线下网点的运营辅助场景，可拆解任务并结合环境信息自我规划步骤。',
    cover: 'https://images.unsplash.com/photo-1581091870627-3a4c98071b37?auto=format&fit=crop&w=960&q=80',
    author: 'TechFinX 行业研究',
    source: 'TechFinX 行业研究',
    timeAgo: '昨日',
    metrics: { likes: 35, bookmarks: 19 },
    category: '行业动态',
    link: '/hot',
    tags: ['机器人', '自动执行', '运营效率'],
    content: [
      'DeepMind 公布的机器人模型可以在理解环境的情况下自主执行任务，适合复杂、动态的操作场景。',
      '对银行网点来说，机器人可承担迎宾、资料递送、排队引导等工作，节省人力。',
      '核心卖点是“把任务拆成步骤”并不断复盘，与传统流程化机器人相比更有灵活性。',
    ],
  },
  {
    id: 'chatgpt-pulse',
    title: 'OpenAI 推出 ChatGPT Pulse：从被动回答升级为“主动助手”',
    summary: '自动抓取日程、邮件、文档触发提醒，金融机构可通过插件扩展内部流程。',
    cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=960&q=80',
    author: 'TechFinX 产品雷达',
    source: 'TechFinX 产品雷达',
    timeAgo: '2 天前',
    metrics: { likes: 54, bookmarks: 27 },
    category: '产品发布',
    link: '/hot',
    tags: ['主动助手', '流程自动化', '客户成功'],
    content: [
      'ChatGPT Pulse 让助手能主动查看你的上下文，比如邮件或文档，并在合适时机提醒或代办。',
      '企业可以基于插件系统扩展内部流程，如风控审批、投顾日报推送等。',
      '要点是限定权限，Pulse 可以只读取必要信息，做到“可解释的自动化”。',
    ],
  },
  {
    id: 'ap2-protocol',
    title: 'Google 发布 AP2 支付协议：AI 助手可安全帮你自动花钱',
    summary: '针对数字银行与财富管理，强调授权与审计机制，为投顾机器人开放支付接口。',
    cover: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=960&q=80',
    author: 'TechFinX 研究社',
    source: 'TechFinX 研究社',
    timeAgo: '1 周前',
    metrics: { likes: 41, bookmarks: 18 },
    category: '研究报告',
    link: '/hot',
    tags: ['支付协议', '授权系统', '金融合规'],
    content: [
      'AP2 协议允许 AI 助手在获得用户授权后执行支付指令，流程透明可追溯。',
      '对金融机构而言，可以把日常小额交易交给助手执行，降低人工成本。',
      '协议内置风控阈值，一旦参数异常会触发复核，为企业级使用提供安全保障。',
    ],
  },
]

const signalCards = [
  {
    id: 'policy-tracker',
    label: '监管预警',
    metric: 'HKMA·今晨',
    delta: '两条新指引',
    caption: '第一时间拆解香港金管局公告，整理对银行及虚拟资产机构的影响。',
    icon: LineChart,
  },
  {
    id: 'capital-flow',
    label: '资本动向',
    metric: '3 亿美元',
    delta: '最新融资',
    caption: '追踪全球 FinTech 轮次与估值，帮助你判断赛道热度与下一步布局。',
    icon: BarChart3,
  },
  {
    id: 'product-watch',
    label: '产品速览',
    metric: '5 个上新',
    delta: '本周精选',
    caption: '筛选 AI、支付、风控等落地案例，给你可复用的产品灵感。',
    icon: Activity,
  },
  {
    id: 'workflow',
    label: '运营指南',
    metric: '3 套模版',
    delta: '免费下载',
    caption: '提供 KPI Dashboard、内容节奏表等工具，助你快速搭建增长流程。',
    icon: Users,
  },
]

const readerJourney = [
  {
    stage: '01 · 快速锁定趋势',
    channel: '热点追踪',
    objective: '用 3 分钟读完政策、融资、技术三类事件，附上影响等级参考。',
  },
  {
    stage: '02 · 深入理解场景',
    channel: 'TechFinX 日报',
    objective: '阅读分析稿件与数据图表，获取行业人士视角与实操建议。',
  },
  {
    stage: '03 · 直接上手应用',
    channel: '工具与资源',
    objective: '下载模版、对照案例，落地到你的风控、运营或产品迭代计划。',
  },
]

const contentSpotlight = {
  weekly: [
    '热点追踪：标记重点监管条款，附影响行业与应对策略。',
    'TechFinX 日报：拆解一家金融科技公司最新增长亮点与可借鉴动作。',
    '深度专栏：发布 AI 支付专辑第二篇，提供流程图与合规清单。',
  ],
  toolkit: [
    '获取「政策解读」速查表，快速确认合规要点。',
    '关注「投融资周报」，了解资本侧对细分市场的态度。',
    '收藏「内容节奏模版」，搭建自有媒体的生产/审核流程。',
  ],
}

const seoDescription =
  '每日洞察金融科技前沿趋势，聚合热点、深度专栏与实用资源，帮助金融科技从业者快速决策与布局。'

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'TechFinX',
  url: 'https://www.techfinx.top/',
  description: seoDescription,
  inLanguage: 'zh-CN',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.techfinx.top/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

const formatRelativeTime = (dateString: string) => {
  const published = new Date(dateString)
  const diff = Date.now() - published.getTime()
  if (Number.isNaN(published.getTime()) || diff < 0) return '刚刚'
  const minutes = Math.floor(diff / (1000 * 60))
  if (minutes < 60) return `${minutes || 1} 分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} 小时前`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} 天前`
  return published.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

const extractTags = (entry: HotEntry) => {
  const base = [entry.category || '热点追踪']
  const summaryTags = entry.summary
    .split(/、|，|。|；/)
    .map((part) => part.trim())
    .filter((part) => part && part.length <= 8)
    .slice(0, 2)
  return Array.from(new Set([...base, ...summaryTags]))
}

const toInsightItem = (entry: HotEntry, index: number): InsightItem => {
  const id = `${entry.source}-${index}`.replace(/[^a-zA-Z0-9-]+/g, '').toLowerCase() || `hot-${index}`
  const tags = extractTags(entry)
  return {
    id,
    title: entry.title,
    summary: entry.summary,
    cover: `https://source.unsplash.com/collection/190727/960x540?sig=${index}`,
    author: entry.source,
    source: entry.source,
    timeAgo: formatRelativeTime(entry.publishedAt),
    metrics: {
      likes: 45 - index * 3 > 12 ? 45 - index * 3 : 12,
      bookmarks: 22 - index * 2 > 6 ? 22 - index * 2 : 6,
    },
    category: insightTabs.includes(entry.category as InsightCategory)
      ? (entry.category as InsightCategory)
      : '行业动态',
    link: '/hot',
    tags,
    content: [entry.summary, `原文来源：${entry.source} · 已纳入热点追踪列表。`],
  }
}

const Home = () => {
  const [activeTab, setActiveTab] = useState<InsightCategory>('全部')
  const [selectedItem, setSelectedItem] = useState<InsightItem | null>(null)
  const [insights, setInsights] = useState<InsightItem[]>(defaultInsightItems)

  useEffect(() => {
    let isMounted = true

    const fetchHot = async () => {
      try {
        const response = await fetch(`/data/hot/latest.json?ts=${Date.now()}`)
        if (!response.ok) return
        const data = await response.json()
        if (!data?.entries?.length) return
        const mapped = (data.entries as HotEntry[]).slice(0, 8).map(toInsightItem)
        if (isMounted && mapped.length) {
          const existingIds = new Set(mapped.map((item) => item.id))
          const fallback = defaultInsightItems.filter((item) => !existingIds.has(item.id))
          setInsights([...mapped, ...fallback])
        }
      } catch (error) {
        console.warn('获取热点数据失败，将展示默认内容', error)
      }
    }

    fetchHot()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredItems = useMemo(() => {
    if (activeTab === '全部') return insights
    return insights.filter((item) => item.category === activeTab)
  }, [activeTab, insights])

  return (
    <div className="space-y-16">
      <Helmet>
        <title>TechFinX - 金融科技情报站</title>
        <link rel="canonical" href="https://www.techfinx.top/" />
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content="金融科技,FinTech,监管动向,AI 支付,金融合规,行业研究" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="TechFinX - 金融科技情报站" />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content="https://www.techfinx.top/" />
        <meta property="og:site_name" content="TechFinX" />
        <meta property="og:image" content="https://www.techfinx.top/og-cover.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TechFinX - 金融科技情报站" />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content="https://www.techfinx.top/og-cover.png" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <PageHero
        eyebrow="每日增长计划 · Day 1"
        title="TechFinX 金融科技情报站"
        description="我们从首页体验出发，梳理栏目价值与更新节奏，以产品化思路持续打磨内容资产，助你在金融科技赛道中保持前瞻洞察。"
        primaryAction={{ label: '查看今日重点', to: '/hot' }}
        secondaryAction={{ label: '了解栏目规划', to: '/deep-dive' }}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {signalCards.map((item) => {
          const Icon = item.icon
          return (
            <article
              key={item.id}
              className="rounded-l border border-border bg-surface p-6 shadow-light transition hover:-translate-y-0.5 hover:shadow-heavy"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.3em] text-text-secondary">{item.label}</span>
                <span className="rounded-full bg-primary/10 p-2 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <p className="text-3xl font-semibold text-text-primary">{item.metric}</p>
                <span className="text-xs font-medium text-success">{item.delta}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{item.caption}</p>
            </article>
          )
        })}
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-l border border-border bg-surface p-6 shadow-light">
          <div className="flex items-center gap-3 text-primary">
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em]">今日热度</span>
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-text-primary">快速掌握监管与行业情绪</h3>
          <p className="mt-2 text-sm text-text-secondary">
            当天最重要的政策、技术与融资动态都会集中呈现，附上影响等级和可能的应对建议，帮你 5 分钟锁定风险与机会。
          </p>
          <div className="mt-4 flex flex-col gap-2 text-xs text-text-secondary/80">
            <p>· 自动抓取 FT、HKMA 等权威源，保证资讯及时而可信。</p>
            <p>· 每条卡片标注影响等级，方便你判断是否需要立即行动。</p>
          </div>
        </div>
        <div className="rounded-l border border-border bg-surface p-6 shadow-light">
          <div className="flex items-center gap-3 text-secondary">
            <Activity className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em]">活跃栏目</span>
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-text-primary">按场景找到你要的内容</h3>
          <p className="mt-2 text-sm text-text-secondary">
            无论你关注监管趋势、产品案例还是工具方法，都能在对应栏目里快速定位，减少无效检索时间。
          </p>
          <div className="mt-4 flex flex-col gap-2 text-xs text-text-secondary/80">
            <p>· 热点追踪、深度专栏、工具资源等栏目按日/周更新。</p>
            <p>· 每个栏目都会提供推荐阅读路径，帮助你建立完整知识链路。</p>
          </div>
        </div>
        <div className="rounded-l border border-border bg-gradient-to-br from-primary via-secondary to-primary/90 p-6 text-white shadow-medium">
          <div className="flex items-center gap-3 text-white/80">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em]">今日上线</span>
          </div>
          <h3 className="mt-4 text-2xl font-semibold">今日为你准备的亮点</h3>
          <p className="mt-2 text-sm text-white/85">
            新增热点信息流、互动详情页与栏目导览，帮助你从首页直接跳到最有价值的内容板块。
          </p>
          <div className="mt-4 space-y-2 text-xs text-white/75">
            <p>· 点击卡片即可获取观点扩展与延伸阅读建议。</p>
            <p>· 推荐关注「深度专栏」「工具资源」，为项目执行提供灵感。</p>
          </div>
        </div>
      </section>

      <section className="rounded-l border border-border bg-surface p-8 shadow-light">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.35em] text-primary/80">体验路径 · Reader Journey</p>
            <h2 className="text-2xl font-semibold text-text-primary">你在 TechFinX 一次就能收获三种信息</h2>
            <p className="text-sm text-text-secondary">
              首先给你最紧迫的政策、融资、技术信号；接着用深度文章帮你看懂背后的逻辑；最后提供工具和模板，让你当天就可以把洞察带回团队执行。
            </p>
          </div>
          <div className="rounded-l border border-dashed border-primary/40 bg-primary/5 px-5 py-4 text-xs text-primary">
            <p className="font-medium">如何快速使用</p>
            <p>先读监管速览确认影响 → 参考深度解读获取观点 → 下载工具包落地到你的项目里。</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {readerJourney.map((step) => (
            <article key={step.stage} className="rounded-l border border-border bg-background/70 p-6 shadow-inner">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-secondary">{step.stage}</p>
              <h3 className="mt-3 text-lg font-semibold text-text-primary">{step.channel}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{step.objective}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[2fr,1fr]">
        <div className="rounded-l border border-border bg-surface p-6 shadow-light">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-primary/80">实时情报流 · Insight Stream</p>
              <h2 className="mt-2 text-2xl font-semibold text-text-primary">精选卡片式快讯</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-text-secondary">
              <Flame className="h-3.5 w-3.5 text-primary" /> 自动每 30 分钟刷新
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {insightTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow-light'
                    : 'bg-background text-text-secondary hover:bg-primary/10 hover:text-primary'
                }`}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-background/80 shadow-light transition-all hover:-translate-y-1 hover:shadow-heavy"
                onClick={() => setSelectedItem(item)}
              >
                <div className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                  {item.category}
                </div>
                <img src={item.cover} alt={item.title} className="h-40 w-full object-cover" loading="lazy" />
                <div className="space-y-4 p-5">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary" title={item.title}>
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-text-secondary">{item.summary}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-text-tertiary">
                    <div className="flex items-center gap-2">
                      <span>{item.source}</span>
                      <span>·</span>
                      <span>{item.timeAgo}</span>
                    </div>
                    <div className="flex items-center gap-3 text-text-secondary">
                      <span>👍 {item.metrics.likes}</span>
                      <span>📌 {item.metrics.bookmarks}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex flex-wrap gap-2">
                      {item.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-2 py-1 text-xs text-primary"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                      查看详情
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-l border border-border bg-surface p-6 shadow-light">
            <h3 className="flex items-center gap-2 text-base font-semibold text-text-primary">
              <Clock3 className="h-4 w-4 text-primary" /> 今天的追更清单
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-2 w-2 rounded-full bg-primary" />
                热点追踪：更新政策类事件 3 条，补充监管影响评级。
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-2 w-2 rounded-full bg-secondary" />
                深度专栏：准备《AI 支付清算》专题，整理提纲与数据源。
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-2 w-2 rounded-full bg-primary" />
                资源库：新增 5 个工具条目，补充标签和使用场景截图。
              </li>
            </ul>
            <div className="mt-6 rounded-l border border-dashed border-primary/50 bg-primary/5 p-4 text-xs text-text-secondary">
              <p className="font-medium text-primary">站点内测笔记</p>
              <p className="mt-1">信息流滚动交互已部署，邀请用户反馈加载速度与可读性体验。</p>
            </div>
          </div>

          <div className="rounded-l border border-border bg-surface p-6 shadow-light">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-text-primary">
              <ListChecks className="h-4 w-4 text-primary" /> 未来 7 日迭代节奏
            </h3>
            <div className="space-y-4 text-sm text-text-secondary">
              <div>
                <p className="font-medium text-text-primary">Day 2 · 账号库</p>
                <p>上线 10 个核心账号画像，支持场景、影响力、代表内容快速浏览。</p>
              </div>
              <div>
                <p className="font-medium text-text-primary">Day 3 · 深度专栏首篇</p>
                <p>发布《合规风控 Copilot》专题，附数据可视化与延伸阅读 CTA。</p>
              </div>
              <div>
                <p className="font-medium text-text-primary">Day 5 · 自动化数据</p>
                <p>完成热点 RSS 自动更新与人工校验流程，对接 CMS 管理后台。</p>
              </div>
            </div>
          </div>

          <div className="rounded-l border border-border bg-primary/5 p-6 shadow-light text-sm text-text-secondary">
            <h3 className="text-base font-semibold text-text-primary">联系 TechFinX</h3>
            <p className="mt-2">
              内容合作、数据交换或广告洽谈，请联系
              <a className="ml-1 text-primary hover:underline" href="mailto:Mumu86007@gmail.com">
                Mumu86007@gmail.com
              </a>
              。
            </p>
          </div>
        </aside>
      </section>

      <section className="rounded-l border border-border bg-surface p-8 shadow-light">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-primary">Content Pipeline</p>
            <h2 className="mt-3 text-2xl font-semibold">今日上线内容优先级</h2>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              通过分阶段推进让 TechFinX 快速具备“日更 + 深度”内容节奏。每个模块都明确产出物和衡量标准，便于追踪进度与效果。
            </p>
          </div>
          <a
            href="mailto:Mumu86007@gmail.com"
            className="inline-flex items-center gap-2 rounded-m border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
          >
            需求协同 <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-l border border-border bg-background/60 p-6 shadow-inner">
            <div className="mb-4 flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">今日交付</span>
            </div>
            <h3 className="text-lg font-semibold text-text-primary">首页内容架构</h3>
            <p className="mt-2 text-sm text-text-secondary">
              完成导航、顶部 Hero、价值区块、首页节奏信息，把“金融科技情报站”的定位讲清楚。
            </p>
            <ul className="mt-4 space-y-2 text-sm text-text-secondary/90">
              <li>· 3 大信息模块（策略概览 / 节奏规划 / 数据面板）</li>
              <li>· CTA 链接串联至热点与深度栏目</li>
              <li>· 页面平均滚动深度目标：60%</li>
            </ul>
          </article>

          <article className="rounded-l border border-border bg-background/60 p-6 shadow-inner">
            <div className="mb-4 flex items-center gap-2 text-secondary">
              <Target className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">本周重点</span>
            </div>
            <h3 className="text-lg font-semibold text-text-primary">栏目内容矩阵</h3>
            <p className="mt-2 text-sm text-text-secondary">
              产出热点速览卡片、深度专栏提纲、资源推荐列表，形成可日更与沉淀并行的内容矩阵。
            </p>
            <ul className="mt-4 space-y-2 text-sm text-text-secondary/90">
              <li>· 热点追踪：日更 3-5 条带指标快讯</li>
              <li>· 深度专栏：周更 1 篇洞察 + 延伸讨论 CTA</li>
              <li>· 资源库：整理工具、报告、数据源</li>
            </ul>
          </article>

          <article className="rounded-l border border-border bg-background/60 p-6 shadow-inner">
            <div className="mb-4 flex items-center gap-2 text-primary">
              <CalendarCheck className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">下阶段计划</span>
            </div>
            <h3 className="text-lg font-semibold text-text-primary">自动化与商业化</h3>
            <p className="mt-2 text-sm text-text-secondary">
              打通自动抓取 + 手动校正流程，配合 SEO 与广告位策略，持续放大 TechFinX 的商业价值。
            </p>
            <ul className="mt-4 space-y-2 text-sm text-text-secondary/90">
              <li>· 爬虫管线 + CMS 后台联动</li>
              <li>· SEO 策划：Topic Cluster & Schema</li>
              <li>· Adsense 广告位：首页 Banner / 内容内嵌 / 侧边栏</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.35fr,1fr]">
        <article className="rounded-l border border-border bg-surface p-8 shadow-light">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-primary/80">运营笔记</p>
              <h2 className="mt-2 text-2xl font-semibold">频道内容更新节奏</h2>
              <p className="mt-2 max-w-xl text-sm text-text-secondary">
                保持“日更快讯 + 周度深度 + 月度主题”的节奏，使访客形成固定回访习惯，同时积累可搜索的长尾内容资产。
              </p>
            </div>
            <div className="rounded-l border border-primary/30 bg-primary/5 px-4 py-3 text-xs text-primary">
              今日已完成：Homepage Revamp
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-4 rounded-l border border-border/80 bg-background/60 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                D
              </div>
              <div className="space-y-2 text-sm text-text-secondary">
                <h3 className="text-base font-semibold text-text-primary">每日热点追踪</h3>
                <p>
                  结合 X / Google News / RSS 源提炼 3-5 条核心事件，附观点导读和量化指标；发布后同步社交渠道，引导回站阅读。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-l border border-border/80 bg-background/60 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-sm font-semibold text-secondary">
                W
              </div>
              <div className="space-y-2 text-sm text-text-secondary">
                <h3 className="text-base font-semibold text-text-primary">每周深度专题</h3>
                <p>
                  聚焦行业结构变化、新商业模式、监管动向等主题，产出深入分析文章，配合数据图表与延伸阅读，提升停留时长和收藏率。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-l border border-border/80 bg-background/60 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                M
              </div>
              <div className="space-y-2 text-sm text-text-secondary">
                <h3 className="text-base font-semibold text-text-primary">每月策略复盘</h3>
                <p>
                  汇总数据趋势、重点事件、成长指标和商业化成果，形成月度战报，为下一阶段策划提供依据。
                </p>
              </div>
            </div>
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-l border border-border bg-surface p-6 shadow-light">
            <h3 className="mb-3 text-base font-semibold text-text-primary">SEO 作战室 · Weekly Sprint</h3>
            <div className="space-y-3 text-sm text-text-secondary">
              {seoSprint.weekly.map((item, index) => (
                <p key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 block h-2 w-2 rounded-full bg-primary" />
                  <span>
                    <span className="font-medium text-text-primary">Day {index + 1}</span>
                    <span className="ml-2">{item}</span>
                  </span>
                </p>
              ))}
            </div>
            <div className="mt-5 rounded-l border border-dashed border-border bg-background/70 p-4 text-xs text-text-secondary">
              <p className="font-medium text-text-primary">Backlog</p>
              <ul className="mt-2 space-y-1">
                {seoSprint.backlog.map((task) => (
                  <li key={task}>· {task}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-l border border-border bg-surface p-6 shadow-light">
            <h3 className="mb-3 text-base font-semibold text-text-primary">内容治理原则</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>· 数据与观点双向验证，保证信息可信度。</li>
              <li>· 栏目沿用统一语气、视觉，使品牌识别一致。</li>
              <li>· 每篇内容包含 CTA，引导订阅、关注、合作等动作。</li>
            </ul>
          </div>

          <div className="rounded-l border border-border bg-surface p-6 shadow-light">
            <h3 className="mb-3 text-base font-semibold text-text-primary">快速 FAQ</h3>
            <div className="space-y-4 text-sm text-text-secondary">
              <div>
                <p className="font-medium text-text-primary">Q：内容多久更新一次？</p>
                <p>A：热点追踪日更；深度专栏周更；账号库与资源库按月维护。</p>
              </div>
              <div>
                <p className="font-medium text-text-primary">Q：是否支持合作投稿？</p>
                <p>
                  A：支持。请发送内容提案至
                  <a className="text-primary hover:underline" href="mailto:Mumu86007@gmail.com">
                    Mumu86007@gmail.com
                  </a>
                  ，我们会在三个工作日内回复。
                </p>
              </div>
              <div>
                <p className="font-medium text-text-primary">Q：何时上线自动化抓取？</p>
                <p>A：预计在完成手动 CMS 流程验证后，分阶段接入爬虫与数据同步。</p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="rounded-l border border-border bg-primary/5 p-10 text-center shadow-light">
        <div className="mx-auto max-w-3xl space-y-4">
          <h2 className="text-3xl font-semibold text-text-primary">准备好和我们一起打造金融科技情报站了吗？</h2>
          <p className="text-sm text-text-secondary">
            每一次页面迭代、每篇内容上线，都是为了让金融科技从业者更快获取洞察。如果你有合作、投稿或需求交流，随时联系 TechFinX 团队。
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="mailto:Mumu86007@gmail.com"
              className="btn-primary inline-flex items-center justify-center rounded-m px-6 py-3 text-sm"
            >
              联系团队
            </a>
            <a
              href="/hot"
              className="btn-secondary inline-flex items-center justify-center rounded-m px-6 py-3 text-sm"
            >
              查看热点栏目
            </a>
          </div>
        </div>
      </section>

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 px-4 py-10 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl rounded-2xl border border-border bg-background shadow-heavy">
            <button
              type="button"
              aria-label="关闭"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition hover:text-primary"
              onClick={() => setSelectedItem(null)}
            >
              <X className="h-4 w-4" />
            </button>
            <div className="h-56 overflow-hidden rounded-t-2xl">
              <img src={selectedItem.cover} alt={selectedItem.title} className="h-full w-full object-cover" />
            </div>
            <div className="space-y-6 p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-primary/70">{selectedItem.category}</p>
                  <h3 className="text-2xl font-semibold text-text-primary">{selectedItem.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary">
                    <span>{selectedItem.source}</span>
                    <span>·</span>
                    <span>{selectedItem.timeAgo}</span>
                    <span className="inline-flex items-center gap-1 text-primary">
                      👍 {selectedItem.metrics.likes}
                    </span>
                    <span className="inline-flex items-center gap-1 text-primary">
                      📌 {selectedItem.metrics.bookmarks}
                    </span>
                  </div>
                </div>
                <Link
                  to={selectedItem.link}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-light transition hover:shadow-heavy"
                >
                  查看热点详情
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedItem.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-xs text-primary">
                    <Tag className="h-3.5 w-3.5" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-text-secondary">
                {selectedItem.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home


