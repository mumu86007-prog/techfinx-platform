import { Helmet } from 'react-helmet-async'

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>关于我们 - TechFinX</title>
        <meta name="description" content="了解TechFinX的使命和愿景，我们致力于为金融科技领域提供优质的信息聚合服务" />
      </Helmet>

      <div className="container-custom py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-text-primary mb-6">关于 TechFinX</h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            TechFinX 是专业的金融科技账号聚合平台，致力于帮助用户发现优质账号，
            获取最新行业热点，提升信息获取效率。
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="card-base p-8">
            <div className="w-16 h-16 bg-primary rounded-l flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">我们的使命</h2>
            <p className="text-text-secondary leading-relaxed">
              通过智能聚合和精准分类，为金融科技从业者提供高效的信息发现工具，
              让优质内容触手可及，让专业洞察更加便捷。
            </p>
          </div>

          <div className="card-base p-8">
            <div className="w-16 h-16 bg-secondary rounded-l flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">我们的愿景</h2>
            <p className="text-text-secondary leading-relaxed">
              成为金融科技领域最权威的信息聚合平台，连接全球优质内容创作者和行业从业者，
              推动行业信息流通和知识共享。
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">核心功能</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">账号聚合</h3>
              <p className="text-text-secondary">
                精选金融科技领域的优质账号，提供详细的账号介绍和专业标签分类
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">智能搜索</h3>
              <p className="text-text-secondary">
                支持关键词搜索和分类筛选，快速找到感兴趣的账号和内容
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">每日热点</h3>
              <p className="text-text-secondary">
                每日精选行业热点，提供深度分析和专业观点
              </p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">团队介绍</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">T</span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">技术团队</h3>
              <p className="text-text-secondary">
                专注于前端技术和用户体验，确保平台的稳定性和易用性
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">F</span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">金融团队</h3>
              <p className="text-text-secondary">
                拥有丰富的金融行业经验，负责内容筛选和质量把控
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">X</span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">产品团队</h3>
              <p className="text-text-secondary">
                负责产品规划和用户研究，持续优化产品功能和体验
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="card-base p-8 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">联系我们</h2>
          <p className="text-text-secondary mb-6">
            如果您有任何建议或合作意向，欢迎与我们联系
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:contact@techfinx.com" 
              className="btn-primary"
            >
              发送邮件
            </a>
            <a 
              href="https://twitter.com/techfinx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              关注我们
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutPage
