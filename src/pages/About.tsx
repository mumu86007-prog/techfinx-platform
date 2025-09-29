import { Helmet } from 'react-helmet-async'
import PageHero from '../sections/PageHero'

const About = () => {
  return (
    <div className="space-y-10">
      <Helmet>
        <title>关于 / 联系 · TechFinX</title>
        <meta name="description" content="了解 TechFinX 的定位与使命，获取商务合作与采访联系信息。" />
      </Helmet>

      <PageHero
        eyebrow="About TechFinX"
        title="TechFinX · AI × FinTech 洞察站"
        description="我们聚焦 AI 与金融科技领域的趋势洞察、市场动态与实用工具，帮助从业者与投资者更快掌握关键信息。"
      />

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-l p-6 space-y-3">
            <h2 className="text-lg font-semibold">我们的愿景</h2>
            <p className="text-sm text-text-secondary">
              打造一个兼具深度分析与实时洞察的金融科技媒体阵地，从账号库、热点追踪到深度专栏、资源工具，为读者提供持续复访的理由。
            </p>
          </div>

          <div className="bg-surface border border-border rounded-l p-6 space-y-3">
            <h2 className="text-lg font-semibold">团队特长</h2>
            <ul className="text-sm text-text-secondary space-y-2">
              <li>· 行业洞察：聚焦金融、AI、监管、资本市场的交叉变化</li>
              <li>· 内容策略：结合数据驱动与SEO优化，打造系列化主题</li>
              <li>· 技术落地：自动化信息抓取、内容管理与广告收益整合</li>
            </ul>
          </div>
        </div>

        <aside className="bg-primary text-white rounded-l p-6 space-y-5">
          <div>
            <h3 className="text-base font-semibold mb-1">联系我们</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              商务合作、采访邀请、资源推荐及内容反馈，欢迎通过邮件与我们联系。
            </p>
          </div>

          <div className="bg-white/10 rounded-m p-4 text-sm space-y-2">
            <p className="font-medium">官方邮箱</p>
            <p>
              <a className="text-white hover:underline" href="mailto:Mumu86007@gmail.com">
                Mumu86007@gmail.com
              </a>
            </p>
          </div>

          <div className="text-sm text-white/80 space-y-2">
            <p>运营节奏：每日内容更新，逐步扩展至专题与工具发布。</p>
            <p>期待与同行与读者建立长期合作关系，共建行业知识网络。</p>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default About



