import { Helmet } from 'react-helmet-async'
import PageHero from '../sections/PageHero'

const Accounts = () => {
  return (
    <div className="space-y-10">
      <Helmet>
        <title>账号库 · TechFinX</title>
        <meta name="description" content="精选值得关注的金融科技领域账号，为你筛选信息流中的高信噪比声音。" />
      </Helmet>

      <PageHero
        eyebrow="栏目骨架"
        title="金融科技意见领袖账号库"
        description="聚合金融、科技、宏观、加密等领域的高质量账号，为后续内容编排与订阅推荐提供数据基础。"
      />

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="col-span-2 space-y-4">
          <div className="border border-border rounded-m p-6">
            <h2 className="text-lg font-semibold mb-2">内容规划</h2>
            <ul className="text-sm text-text-secondary space-y-2">
              <li>· 分组：宏观经济、投资策略、科技创新、AI 应用、区块链加密</li>
              <li>· 指标：粉丝规模、发声频率、影响力、推荐理由、典型观点</li>
              <li>· 后续扩展：关联近期发言、相关报道、订阅行动按钮</li>
            </ul>
          </div>

          <div className="border border-dashed border-primary rounded-m p-6 text-text-secondary">
            <p className="text-sm">
              后续填充：账号数据表格 / 卡片组件，提供筛选、搜索、收藏功能；结合爬虫数据自动更新，同时允许人工标记推荐理由。
            </p>
          </div>
        </div>

        <aside className="bg-surface border border-border rounded-l p-6 space-y-4">
          <h3 className="text-base font-semibold">栏目目标</h3>
          <p className="text-sm text-text-secondary">
            为 TechFinX 自有内容提供数据来源，也为访客提供“值得关注谁”的明确建议，让账号库成为获客入口之一。
          </p>

          <div className="text-sm text-text-secondary space-y-2">
            <p>联系方式：</p>
            <p>
              <a className="text-primary hover:underline" href="mailto:Mumu86007@gmail.com">
                Mumu86007@gmail.com
              </a>
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default Accounts



