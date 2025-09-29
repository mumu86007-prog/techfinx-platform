import { Helmet } from 'react-helmet-async'
import PageHero from '../sections/PageHero'

const DeepDive = () => {
  return (
    <div className="space-y-10">
      <Helmet>
        <title>深度专栏 · TechFinX</title>
        <meta
          name="description"
          content="TechFinX 长篇深度内容的策划与占位，聚焦趋势洞察、案例拆解与商业模式分析。"
        />
      </Helmet>

      <PageHero
        eyebrow="Long-form Insight"
        title="深度专栏策划中"
        description="每周输出 1-2 篇高价值长文，从宏观趋势、行业案例、技术落地和资本动向四个维度进行分析。"
        primaryAction={{ label: '查看资源库', to: '/resources' }}
      />

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-border rounded-m p-6 space-y-3">
            <h2 className="text-lg font-semibold">首批选题方向（草案）</h2>
            <ul className="text-sm text-text-secondary space-y-2">
              <li>· 《AI 赋能资产管理：从投研到风控的全链路重构》</li>
              <li>· 《支付科技的跨境突围：合规、体验与网络效应》</li>
              <li>· 《金融机构的生成式 AI 试点：效率红利与风险敞口》</li>
            </ul>
          </div>

          <div className="border border-dashed border-primary/60 rounded-m p-6 text-sm text-text-secondary space-y-2">
            <p>结构占位：</p>
            <ul className="space-y-1">
              <li>· 导语引入 → 关键数据 → 案例拆解 → 专家观点 → 可执行建议</li>
              <li>· 后续补充 CTA：订阅newsletter / 下载 PDF 白皮书</li>
              <li>· 预留 adsense in-article 广告位</li>
            </ul>
          </div>
        </div>

        <aside className="bg-surface border border-border rounded-l p-6 space-y-4">
          <h3 className="text-base font-semibold">运营提醒</h3>
          <p className="text-sm text-text-secondary">
            深度专栏将是 SEO 与长尾流量的重要来源。发布前准备关键词、元描述、社交分享图，并与热点栏目建立互链。
          </p>

          <div className="border border-border rounded-m p-4 text-sm text-text-secondary">
            <p className="font-medium text-text-primary mb-2">合作与投稿</p>
            <p>
              欢迎行业专家投稿或合作采访，请联系：
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

export default DeepDive



