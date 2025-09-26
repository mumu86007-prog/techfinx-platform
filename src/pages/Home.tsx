import { Helmet } from 'react-helmet-async'
import PageHero from '../sections/PageHero'

const Home = () => {
  return (
    <div className="space-y-12">
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
        description="从重点页面骨架和内容节奏开始，持续输出有洞察的内容，打造高价值的 TechFinX 品牌阵地。"
        primaryAction={{ label: '查看今日重点', to: '/hot' }}
        secondaryAction={{ label: '了解栏目规划', to: '/deep-dive' }}
      />

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-surface border border-border rounded-l p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">今日内容构架</h2>
            <p className="text-text-secondary text-sm">
              首先搭建好站点骨架与视觉节奏，铺设后续内容更新的“轨道”。
            </p>
          </div>

          <div className="space-y-4">
            <article className="border border-border rounded-m p-4">
              <h3 className="font-semibold mb-1">栏目分发结构</h3>
              <p className="text-text-secondary text-sm">
                首页负责总览与转化路径，热点追踪快速呈现时效内容，深度专栏承载高价值长文，资源库提供工具合集，账号库沉淀值得订阅的专家账号。
              </p>
            </article>

            <article className="border border-border rounded-m p-4">
              <h3 className="font-semibold mb-1">首日上线重点</h3>
              <ul className="text-text-secondary text-sm space-y-2">
                <li>· 架设 React Router 多页面骨架</li>
                <li>· 首页 / 热点 / 深度 / 资源 / 账号库 / 关于页的占位内容</li>
                <li>· 统一导航与页脚信息（含联系邮箱 <a className="text-primary" href="mailto:Mumu86007@gmail.com">Mumu86007@gmail.com</a>）</li>
              </ul>
            </article>

            <article className="border border-border rounded-m p-4">
              <h3 className="font-semibold mb-1">明日行动提示</h3>
              <p className="text-text-secondary text-sm">
                根据今日骨架，开始填充首批内容模块（如热点追踪卡片、账号库数据、深度专栏预告等），并结合 Cloudflare 数据校正栏目策略。
              </p>
            </article>
          </div>
        </div>

        <aside className="bg-primary text-white rounded-l p-8 space-y-6 shadow-medium">
          <div className="space-y-4">
            <span className="text-sm uppercase tracking-wide text-white/70">Traffic Snapshot</span>
            <h2 className="text-3xl font-semibold">过去 30 天 · 900 UV</h2>
            <p className="text-white/80 text-sm leading-relaxed">
              当前以单页面结构获得初始访客。我们通过栏目化内容来延长停留、增加访问深度，同时为后续 SEO 与广告布局打基础。
            </p>
          </div>

          <div className="bg-white/10 rounded-m p-4 space-y-3 text-sm text-white/90">
            <div>
              <h3 className="font-semibold">今日策略对齐</h3>
              <p className="text-white/70">
                核心目标是让访客清楚我们日更的节奏与价值，首个横向骨架搭建完成后，确保每个页面都有明确目标与转化路径。
              </p>
            </div>

            <div>
              <h3 className="font-semibold">站点关键任务</h3>
              <ul className="space-y-1 text-white/70">
                <li>· 强化首页信息架构</li>
                <li>· 明确栏目定位与入口</li>
                <li>· 建立联系渠道（邮箱）</li>
              </ul>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default Home

