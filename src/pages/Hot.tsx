import { Helmet } from 'react-helmet-async'
import PageHero from '../sections/PageHero'

const Hot = () => {
  return (
    <div className="space-y-10">
      <Helmet>
        <title>热点追踪 · TechFinX</title>
        <meta name="description" content="快速集合当天值得关注的金融科技事件、政策动向与市场情绪。" />
      </Helmet>

      <PageHero
        eyebrow="Real-time Pulse"
        title="热点追踪 · 当日必读"
        description="聚焦 AI 与金融科技领域的即时资讯，结合市场指标与观点，为访客提供快速吸收的“今日必读”栏目。"
        primaryAction={{ label: '查看深度专栏预告', to: '/deep-dive' }}
      />

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-border rounded-m p-6 space-y-3">
            <h2 className="text-lg font-semibold">栏目结构（占位）</h2>
            <ul className="text-sm text-text-secondary space-y-2">
              <li>· 顶部焦点：1-2 条核心事件，配简短解读与影响方向</li>
              <li>· 板块分类：宏观政策 / AI 商业化 / 金融市场 / 创投动态</li>
              <li>· 情绪指标：结合市场涨跌、社媒热度、搜索趋势</li>
            </ul>
          </div>

          <div className="border border-dashed border-primary/60 bg-primary/5 rounded-m p-6 text-sm text-text-secondary space-y-3">
            <p>
              后续数据来源：
            </p>
            <ul className="space-y-1">
              <li>· RSS 抓取行业媒体 + 官方公告</li>
              <li>· X(Twitter) 关键词流 + 关注账号发言</li>
              <li>· Google News 搜索“AI FinTech”“RegTech”等关键词</li>
            </ul>
          </div>
        </div>

        <aside className="bg-surface border border-border rounded-l p-6 space-y-4">
          <h3 className="text-base font-semibold">内容更新节奏</h3>
          <p className="text-sm text-text-secondary">
            每日固定时段更新（建议上午 10:00 前完成），并在社交媒体同步发布精简版，带动站内访问。
          </p>

          <div className="border border-border rounded-m p-4 text-sm text-text-secondary">
            <p className="font-medium text-text-primary mb-2">联系协调</p>
            <p>
              需要补充来源或合作内容时，请邮件至
              <a className="text-primary hover:underline ml-1" href="mailto:Mumu86007@gmail.com">
                Mumu86007@gmail.com
              </a>
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default Hot



