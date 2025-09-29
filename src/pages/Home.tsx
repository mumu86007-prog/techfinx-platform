import { Helmet } from 'react-helmet-async'
import { ArrowUpRight, CalendarCheck, Sparkles, Target } from 'lucide-react'
import PageHero from '../sections/PageHero'

const Home = () => {
  return (
    <div className="space-y-16">
      <Helmet>
        <title>TechFinX - 金融科技情报站</title>
        <meta
          name="description"
          content="每日洞察金融科技前沿趋势，聚合热点、深度专栏与实用资源，助你稳抓行业机会。"
        />
      </Helmet>

      <PageHero
        eyebrow="每日增长计划 · Day 1"
        title="TechFinX 金融科技情报站"
        description="我们从首页体验出发，梳理栏目价值与更新节奏，以产品化思路持续打磨内容资产，助你在金融科技赛道中保持前瞻洞察。"
        primaryAction={{ label: '查看今日重点', to: '/hot' }}
        secondaryAction={{ label: '了解栏目规划', to: '/deep-dive' }}
      />

      <section className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <article className="rounded-l border border-border bg-surface p-6 shadow-light">
              <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                内容发布节奏
              </div>
              <h2 className="mb-3 text-xl font-semibold">栏目分发结构</h2>
              <p className="text-sm text-text-secondary">
                首页承担品牌定位与深度转化；热点追踪对接实时资讯；深度专栏输出长期价值；工具资源沉淀方法论；账号库聚合可信第三方视角。
              </p>
            </article>

            <article className="rounded-l border border-border bg-surface p-6 shadow-light">
              <div className="mb-4 inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                今日上线
              </div>
              <h2 className="mb-3 text-xl font-semibold">首批内容落地</h2>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>· 6 个栏目页面骨架 + 全局导航、页脚完成对齐</li>
                <li>· 首页模块化信息架构 + SEO 元信息准备</li>
                <li>· 联系邮箱与品牌定位在每个关键页面保持一致</li>
              </ul>
            </article>
          </div>

          <div className="rounded-l border border-border bg-surface p-6 shadow-light">
            <h2 className="mb-4 text-xl font-semibold">明日迭代清单</h2>
            <div className="space-y-4 text-sm text-text-secondary">
              <p>
                · 填充热点追踪首批内容卡片，增加数据驱动的热度标记；
              </p>
              <p>
                · 深度专栏页输出首篇提纲，明确价值主张和 CTA；
              </p>
              <p>
                · 账号库补充 5 个核心账号的画像与关注理由，形成转化路径；
              </p>
              <p>
                · 制定内容排程表，覆盖日更脚本、周度深度、月度主题策划。
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-l border border-border bg-gradient-to-br from-primary via-secondary to-primary/90 p-6 text-white shadow-medium">
            <div className="space-y-4">
              <span className="text-sm uppercase tracking-wide text-white/70">Traffic Snapshot</span>
              <h2 className="text-3xl font-semibold">过去 30 天 · 900 UV</h2>
              <p className="text-sm text-white/80">
                单页结构获取初始流量，今天开始用栏目化信息架构延长停留时间。同时预留广告位策略，为后续 Adsense 布局和合作内容打基础。
              </p>
            </div>
            <div className="mt-6 grid gap-4 rounded-m bg-white/10 p-4 text-sm text-white/85">
              <div>
                <h3 className="text-base font-semibold text-white">今日策略对齐</h3>
                <p className="text-white/70">明确 TechFinX 的“金融科技情报站”定位，提供精准入口和转化动线。</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-l bg-white/15 p-3 text-white">
                  <p className="text-xs uppercase tracking-wide text-white/70">核心栏目</p>
                  <p className="text-base font-semibold text-white">6 个</p>
                </div>
                <div className="rounded-l bg-white/15 p-3 text-white">
                  <p className="text-xs uppercase tracking-wide text-white/70">上线节奏</p>
                  <p className="text-base font-semibold text-white">日更 + 周深度</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-l border border-border bg-surface p-6 shadow-light">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-text-primary">
              <CalendarCheck className="h-4 w-4 text-primary" /> 站点关键任务
            </h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li>· 强化首页信息架构，突出 TechFinX 值得每日造访的理由。</li>
              <li>· 梳理栏目标签，搭建前端分类过滤和 SEO 关键词地图。</li>
              <li>
                · 建立联系渠道（邮箱：
                <a className="text-primary hover:underline" href="mailto:Mumu86007@gmail.com">
                  Mumu86007@gmail.com
                </a>
                ），同步建立社交媒体矩阵计划。
              </li>
            </ul>
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
              完成导航、顶部 Hero、价值区块、首页节奏信息，把“金融科技情报站”的定位讲清楚。</p>
            <ul className="mt-4 space-y-2 text-sm text-text-secondary/90">
              <li>· 3 大信息模块（策略概览 / 节奏规划 / 数据观察）</li>
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
              产出热点速览卡片、深度专栏提纲、资源推荐列表，形成可日更和沉淀的双轨内容矩阵。</p>
            <ul className="mt-4 space-y-2 text-sm text-text-secondary/90">
              <li>· 热点追踪：日更 3-5 条带指标的快讯</li>
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
              打通自动抓取 + 手动校正流程，配合 SEO 与广告位策略，持续放大 TechFinX 的商业价值。</p>
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
              <div className="h-10 w-10 rounded-full bg-primary/10 text-sm font-semibold text-primary flex items-center justify-center">
                D
              </div>
              <div className="space-y-2 text-sm text-text-secondary">
                <h3 className="text-base font-semibold text-text-primary">每日热点追踪</h3>
                <p>
                  结合 X/Google News/RSS 源，提炼 3-5 条核心事件，附观点导读和量化指标。内容发布后，同步在社交媒体推送，引导回站阅读。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-l border border-border/80 bg-background/60 p-4">
              <div className="h-10 w-10 rounded-full bg-secondary/10 text-sm font-semibold text-secondary flex items-center justify-center">
                W
              </div>
              <div className="space-y-2 text-sm text-text-secondary">
                <h3 className="text-base font-semibold text-text-primary">每周深度专题</h3>
                <p>
                  聚焦行业结构变化、新商业模式、监管动向等主题，产出深入分析文章，配合数据图表与延伸阅读，提高停留时长和收藏率。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-l border border-border/80 bg-background/60 p-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-sm font-semibold text-primary flex items-center justify-center">
                M
              </div>
              <div className="space-y-2 text-sm text-text-secondary">
                <h3 className="text-base font-semibold text-text-primary">每月策略复盘</h3>
                <p>
                  汇总数据趋势、重点事件、成长指标和商业化成绩，形成月度战报，为下一阶段策划提供依据。
                </p>
              </div>
            </div>
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-l border border-border bg-surface p-6 shadow-light">
            <h3 className="mb-3 text-base font-semibold text-text-primary">内容治理原则</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>· 数据与观点双向验证，保证信息可信度。</li>
              <li>· 所有栏目沿用统一语气、视觉，使品牌识别一致。</li>
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
    </div>
  )
}

export default Home


