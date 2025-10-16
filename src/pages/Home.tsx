import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  ArrowUpRight,
  Flame,
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

const readerJourney = [
  {
    stage: '01 · 今日金融',
    channel: '政策与监管速览',
    objective: '聚焦金融监管、支付结算、数据安全等核心政策动态，帮助决策者快速掌握合规重点。',
  },
  {
    stage: '02 · AI热点',
    channel: '生成式AI应用',
    objective: '追踪大模型、生成式AI在金融风控、客服、投研等场景的创新应用和融资进展。',
  },
  {
    stage: '03 · 科技热点',
    channel: '全球科技动态',
    objective: '覆盖硅谷、中国科技公司的产品发布、战略调整和行业趋势，为业务布局提供参考。',
  },
]

const seoDescription =
  '每日洞察金融科技前沿趋势，聚合热点、深度专栏与实用资源，帮助金融科技从业者快速决策与布局。'

// Cache bust version - update to force redeploy
const VERSION = '1.0.2'

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

  return (
    <div className="space-y-16">
      <Helmet>
        <title>TechFinX - 金融科技情报站</title>
        <link rel="canonical" href="https://www.techfinx.top/" />
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content="金融科技,FinTech,监管动向,AI 支付,金融合规,行业研究" />
        <meta name="version" content={VERSION} />
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
        eyebrow="每日必读 · 实时更新"
        title="TechFinX 金融科技情报站"
        description="聚合全球金融科技、生成式 AI、数字商业模式的最新落地案例与策略洞察，让你更快找到可执行的增长机会。"
        primaryAction={{ label: '查看今日重点', to: '/hot' }}
        secondaryAction={{ label: '获取工具与模板', to: '/resources' }}
      />

      <section className="grid gap-6 md:grid-cols-3">
        {readerJourney.map((step) => (
          <article key={step.stage} className="rounded-2xl border border-border bg-surface p-6 shadow-light">
            <p className="text-xs uppercase tracking-[0.3em] text-primary/70">{step.stage}</p>
            <h3 className="mt-3 text-xl font-semibold text-text-primary">{step.channel}</h3>
            <p className="mt-3 text-sm text-text-secondary">{step.objective}</p>
          </article>
        ))}
      </section>

      <section className="rounded-l border border-border bg-surface p-8 shadow-light">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-primary/80">实时资讯 · Real-time News</p>
            <h2 className="mt-3 text-2xl font-semibold text-text-primary">今日热点资讯速览</h2>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              从金融监管、AI应用到全球科技动态，每日自动更新最新资讯，帮助快速了解行业趋势。
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary px-3 py-1 text-xs text-primary">
            <Flame className="h-3.5 w-3.5" /> 每30分钟更新
          </div>
        </div>

        <div className="space-y-4">
          {insights.slice(0, 6).map((item) => (
            <article
              key={item.id}
              className="flex items-start gap-4 rounded-lg border border-border/50 bg-background/60 p-4 transition hover:border-primary/30 hover:bg-background/80"
            >
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {item.tags[0]?.slice(0, 1) || '•'}
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-base font-semibold text-text-primary leading-snug">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.summary}</p>
                <div className="flex items-center gap-3 text-xs text-text-tertiary">
                  <span>{item.source}</span>
                  <span>•</span>
                  <span>{item.timeAgo}</span>
                </div>
              </div>
              <Link
                to={item.link}
                className="flex-shrink-0 text-primary hover:text-primary/80 transition"
              >
                <ArrowUpRight className="h-5 w-5" />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            to="/hot"
            className="inline-flex items-center gap-2 rounded-lg border border-primary px-6 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white transition"
          >
            查看全部热点 <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <article className="relative max-h-96 w-full max-w-2xl overflow-auto rounded-2xl border border-border bg-surface shadow-heavy">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute right-4 top-4 rounded-full bg-primary/10 p-2 text-primary hover:bg-primary hover:text-white"
              type="button"
            >
              <ArrowUpRight className="h-4 w-4" />
            </button>
            <div className="h-56 overflow-hidden rounded-t-2xl">
              <img src={selectedItem.cover} alt={selectedItem.title} className="h-full w-full object-cover" />
            </div>
            <div className="space-y-4 p-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-text-primary">{selectedItem.title}</h2>
                <p className="text-sm text-text-secondary">来自 {selectedItem.source} · {selectedItem.timeAgo}</p>
              </div>
              <p className="text-base leading-relaxed text-text-secondary">{selectedItem.summary}</p>
              <div className="flex flex-wrap gap-2">
                {selectedItem.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-xs text-primary">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                to={selectedItem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                查看原文 <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        </div>
      )}
    </div>
  )
}

export default Home


