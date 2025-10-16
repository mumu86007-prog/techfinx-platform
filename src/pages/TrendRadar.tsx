import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Flame, TrendingUp, Radar, Sparkles, Clock3, ArrowUpRight } from 'lucide-react'
import PageHero from '../sections/PageHero'
import {
  fetchTrendRadarData,
  formatTimeRange,
  getHeatLevelLabel,
  TrendRadarGroup,
  TrendRadarPayload,
} from '../services/trendRadar'

const heatLevelClassMap: Record<TrendRadarGroup['heatLevel'], string> = {
  hot: 'bg-red-500/10 text-red-500 border-red-500/40',
  warm: 'bg-orange-500/10 text-orange-500 border-orange-500/40',
  rising: 'bg-amber-500/10 text-amber-500 border-amber-500/40',
  steady: 'bg-blue-500/10 text-blue-500 border-blue-500/40',
}

const TrendRadar = () => {
  const [data, setData] = useState<TrendRadarPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const payload = await fetchTrendRadarData()
        if (isMounted) {
          setData(payload)
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  const pageTitle = 'TechFinX 趋势雷达 - 实时洞察金融科技热度'
  const pageDescription =
    '聚合金融科技与 AI 场景的最新趋势信号，覆盖智能支付、AI 风控、数据基础设施与合规科技等高价值主题，帮助你快速判断市场动向。'

  return (
    <div className="space-y-16">
      <Helmet>
        <title>{pageTitle}</title>
        <link rel="canonical" href="https://www.techfinx.top/trend-radar" />
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="金融科技趋势,FinTech 热点,AI 风控,智能支付,趋势雷达,TechFinX"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content="https://www.techfinx.top/trend-radar" />
        <meta property="og:site_name" content="TechFinX" />
        <meta property="og:image" content="https://www.techfinx.top/og-cover.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://www.techfinx.top/og-cover.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: pageTitle,
            url: 'https://www.techfinx.top/trend-radar',
            description: pageDescription,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: '首页',
                  item: 'https://www.techfinx.top/',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: '趋势雷达',
                  item: 'https://www.techfinx.top/trend-radar',
                },
              ],
            },
          })}
        </script>
      </Helmet>

      <PageHero
        eyebrow="实时热点 · 策略对齐"
        title="TechFinX 趋势雷达"
        description="把每天的金融科技噪声转化成可执行的趋势信号：聚焦 AI 支付、智能风控、数据基础设施与合规科技，帮助你判断市场热度与机会窗口。"
        primaryAction={{ label: '浏览今日热点', to: '/hot' }}
        secondaryAction={{ label: '下载执行清单', to: '/resources' }}
      />

      {isLoading && (
        <section className="rounded-2xl border border-border bg-surface p-10 shadow-light">
          <div className="flex items-center gap-3 text-text-secondary">
            <Radar className="h-5 w-5 animate-spin" />
            <span>正在加载趋势雷达数据，请稍候...</span>
          </div>
        </section>
      )}

      {!isLoading && data && (
        <>
          <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="rounded-2xl border border-border bg-surface p-8 shadow-light">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-3">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-primary/70">
                    <Flame className="h-4 w-4 text-primary" /> Trend Summary
                  </p>
                  <h2 className="text-2xl font-semibold text-text-primary">{data.summary.headline}</h2>
                  <p className="text-sm text-text-secondary">
                    对接热点抓取面板与 TechFinX 内部专家判断，输出对金融科技从业者最有价值的主题集合，帮助你快速对齐内容、产品与商务策略。
                  </p>
                </div>
                <div className="grid gap-3 text-sm text-text-secondary">
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-background/70 px-4 py-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-text-tertiary">今日信号总数</p>
                      <p className="text-base font-semibold text-text-primary">
                        {data.summary.totalSignals}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-background/70 px-4 py-3">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-text-tertiary">高优先级</p>
                      <p className="text-base font-semibold text-text-primary">
                        {data.summary.highPriority}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-background/70 px-4 py-3">
                    <Clock3 className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-text-tertiary">最新更新时间</p>
                      <p className="text-base font-semibold text-text-primary">
                        {new Date(data.generatedAt).toLocaleString('zh-CN', {
                          hour12: false,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="rounded-2xl border border-border bg-primary/5 p-6 shadow-light">
              <h3 className="text-base font-semibold text-text-primary">推荐操作清单</h3>
              <ul className="mt-4 space-y-3 text-sm text-text-secondary">
                <li>
                  <span className="font-medium text-text-primary">每晨 10 分钟</span>：团队晨会快速复盘趋势雷达，总结关键信号与可能的业务动作。
                </li>
                <li>
                  <span className="font-medium text-text-primary">周迭代</span>：将高热度话题同步到内容与产品迭代表，附加跟进负责人。
                </li>
                <li>
                  <span className="font-medium text-text-primary">客户沟通</span>：把洞察整理成对外 newsletter，强化专家形象。
                </li>
              </ul>
            </aside>
          </section>

          <section className="space-y-8">
            {data.groups.map((group) => (
              <article
                key={group.id}
                className="rounded-2xl border border-border bg-surface p-8 shadow-light"
              >
                <header className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-1 text-xs font-semibold ${heatLevelClassMap[group.heatLevel]}`}
                      >
                        <Radar className="h-3.5 w-3.5" />
                        {getHeatLevelLabel(group.heatLevel)}
                      </span>
                      <span className="text-xs uppercase tracking-[0.3em] text-text-tertiary">
                        Momentum {Math.round(group.momentum * 100)}%
                      </span>
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold text-text-primary">{group.title}</h3>
                    <p className="mt-2 text-sm text-text-secondary">
                      合并多平台热度 + TechFinX 内部专家判断后形成的主题集。信号越多代表机会越明确，适合作为内容与产品的重点投入方向。
                    </p>
                  </div>
                  <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-6 py-4 text-sm text-primary">
                    <p className="text-xs uppercase tracking-[0.3em]">Signals</p>
                    <p className="mt-1 text-2xl font-semibold">{group.signalCount}</p>
                    <p className="mt-1 text-xs text-primary/80">建议重点跟进数量</p>
                  </div>
                </header>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {group.insights.map((insight) => (
                    <div
                      key={insight.id}
                      className="group relative flex h-full flex-col justify-between rounded-xl border border-border bg-background/70 p-6 shadow-inner transition hover:-translate-y-1 hover:shadow-heavy"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs text-text-tertiary">
                          <span>{insight.platform}</span>
                          <span className="inline-flex items-center gap-1 text-primary">
                            排名 {insight.rank}
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-primary">
                          {insight.title}
                        </h4>
                        <p className="text-sm leading-relaxed text-text-secondary">{insight.summary}</p>
                      </div>

                      <div className="mt-6 flex items-center justify-between text-xs text-text-secondary">
                        <div>
                          <p>出现频次：{insight.appearances} 次</p>
                          <p className="mt-1">时间区间：{formatTimeRange(insight.firstSeen, insight.lastSeen)}</p>
                        </div>
                        {insight.callToAction && (
                          <a
                            href={insight.callToAction.to}
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                          >
                            {insight.callToAction.label}
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>

          <section className="rounded-2xl border border-border bg-primary/5 p-10 text-sm text-text-secondary">
            <h3 className="text-lg font-semibold text-text-primary">如何最大化趋势雷达价值</h3>
            <div className="mt-4 grid gap-6 lg:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary/70">内容运营</p>
                <p className="mt-2 text-base text-text-primary">将高热度话题拆成栏目企划</p>
                <p className="mt-2">
                  每日挑选 1 至 2 个热度最高的主题转化为首页提要，附带 CTA 引导用户持续关注。
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary/70">产品策略</p>
                <p className="mt-2 text-base text-text-primary">热点 → 功能优先级</p>
                <p className="mt-2">
                  将趋势与用户反馈结合，调整产品路线图。例如支付/风控类主题高热时，优先上线相关指南或工具包。
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary/70">销售支持</p>
                <p className="mt-2 text-base text-text-primary">洞察辅助商机沟通</p>
                <p className="mt-2">
                  将趋势雷达摘要整理成每周邮件或客户访谈材料，强化 TechFinX 作为行业顾问的角色。
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default TrendRadar


