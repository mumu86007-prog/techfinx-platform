import { Helmet } from 'react-helmet-async'
import PageHero from '../sections/PageHero'

const Resources = () => {
  return (
    <div className="space-y-10">
      <Helmet>
        <title>工具与资源 · TechFinX</title>
        <meta name="description" content="精选 AI 与金融科技工具、报告、数据源与开放课程的资源索引。" />
      </Helmet>

      <PageHero
        eyebrow="Toolkit"
        title="工具与资源库"
        description="集成高质量的金融科技工具、API、研究报告与学习资源，为访客提供持续复访的理由。"
        primaryAction={{ label: '返回首页', to: '/' }}
      />

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-border rounded-m p-6 space-y-3">
            <h2 className="text-lg font-semibold">资源分组规划</h2>
            <ul className="text-sm text-text-secondary space-y-2">
              <li>· 数据/API：宏观经济、市场行情、AI 模型接口</li>
              <li>· 工具产品：投研分析、自动化运营、可视化工具</li>
              <li>· 报告与白皮书：行业趋势、监管解读、案例研究</li>
              <li>· 学习路径：课程、播客、社区推荐</li>
            </ul>
          </div>

          <div className="border border-dashed border-secondary/60 rounded-m p-6 text-sm text-text-secondary space-y-2">
            <p>后续填充建议：</p>
            <ul className="space-y-1">
              <li>· 每周至少更新 1 个新资源，并标注“更新日期”</li>
              <li>· 提供表格视图（名称、简介、适用场景、价格/免费）</li>
              <li>· 引导用户订阅邮箱通知，以获得资源更新提醒</li>
            </ul>
          </div>
        </div>

        <aside className="bg-surface border border-border rounded-l p-6 space-y-4">
          <h3 className="text-base font-semibold">联系合作</h3>
          <p className="text-sm text-text-secondary">
            如果你有优质工具或资源希望被 TechFinX 推荐，请发送介绍资料至：
          </p>
          <p>
            <a className="text-primary hover:underline" href="mailto:Mumu86007@gmail.com">
              Mumu86007@gmail.com
            </a>
          </p>
        </aside>
      </section>
    </div>
  )
}

export default Resources



