import { Helmet } from 'react-helmet-async'

function App() {
  return (
    <>
      <Helmet>
        <title>TechFinX - 金融科技账号聚合站</title>
        <meta name="description" content="发现优质金融和科技领域账号，获取最新行业热点" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="text-xl font-bold text-text-primary">TechFinX</span>
              </div>
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#" className="text-sm font-medium text-primary">首页</a>
                <a href="#" className="text-sm font-medium text-text-secondary hover:text-text-primary">金融</a>
                <a href="#" className="text-sm font-medium text-text-secondary hover:text-text-primary">科技</a>
                <a href="#" className="text-sm font-medium text-text-secondary hover:text-text-primary">热点</a>
                <a href="#" className="text-sm font-medium text-text-secondary hover:text-text-primary">关于</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-text-primary mb-6">TechFinX</h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              专业的金融科技账号聚合平台，帮助用户发现优质账号，获取最新行业热点，提升信息获取效率。
            </p>
          </div>

          {/* Featured Section */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-l p-8 mb-8 text-white">
            <h2 className="text-3xl font-bold mb-4">今日热点</h2>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">美联储维持利率不变，市场反应积极</h3>
              <p className="text-white/90 leading-relaxed mb-4">
                美联储宣布维持利率不变，市场反应积极。多位金融专家认为这是对经济复苏的积极信号，科技股普遍上涨。同时，AI技术在金融领域的应用再次成为讨论焦点...
              </p>
              <div className="flex items-center space-x-6 text-white/70 text-sm">
                <span>📊 金融热点</span>
                <span>⏰ 2小时前</span>
                <span>👀 1.2k 浏览</span>
              </div>
            </div>
          </div>

          {/* Sample Accounts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Account Card 1 */}
            <div className="bg-surface border border-border rounded-m p-6 hover:shadow-medium hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary font-semibold text-lg">JP</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">@JohnPowell</h3>
                  <p className="text-text-secondary text-sm">美联储主席</p>
                </div>
              </div>
              <p className="text-text-primary text-sm leading-relaxed mb-4">
                美联储主席，负责制定美国货币政策。在宏观经济分析、货币政策制定方面具有丰富经验，其言论对全球金融市场具有重要影响。
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-2 py-1 rounded-s text-xs font-medium bg-background text-text-secondary">宏观经济</span>
                <span className="inline-flex items-center px-2 py-1 rounded-s text-xs font-medium bg-background text-text-secondary">货币政策</span>
                <span className="inline-flex items-center px-2 py-1 rounded-s text-xs font-medium bg-background text-text-secondary">金融监管</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <div className="text-primary font-semibold text-sm">2.1M</div>
                  <div className="text-text-secondary text-xs">关注者</div>
                </div>
                <div>
                  <div className="text-primary font-semibold text-sm">1.2K</div>
                  <div className="text-text-secondary text-xs">推文</div>
                </div>
                <div>
                  <div className="text-primary font-semibold text-sm">98%</div>
                  <div className="text-text-secondary text-xs">活跃度</div>
                </div>
              </div>
              <button className="w-full bg-primary text-white px-4 py-2 rounded-s font-medium hover:bg-primary-600 transition-colors duration-200">
                关注账号
              </button>
            </div>

            {/* Account Card 2 */}
            <div className="bg-surface border border-border rounded-m p-6 hover:shadow-medium hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary font-semibold text-lg">EM</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">@ElonMusk</h3>
                  <p className="text-text-secondary text-sm">特斯拉CEO</p>
                </div>
              </div>
              <p className="text-text-primary text-sm leading-relaxed mb-4">
                特斯拉和SpaceX的CEO，在电动汽车、太空探索、人工智能等领域具有前瞻性视野。其推文经常引发市场波动，是科技和金融界的重要意见领袖。
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-2 py-1 rounded-s text-xs font-medium bg-background text-text-secondary">电动汽车</span>
                <span className="inline-flex items-center px-2 py-1 rounded-s text-xs font-medium bg-background text-text-secondary">太空探索</span>
                <span className="inline-flex items-center px-2 py-1 rounded-s text-xs font-medium bg-background text-text-secondary">人工智能</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <div className="text-primary font-semibold text-sm">150M</div>
                  <div className="text-text-secondary text-xs">关注者</div>
                </div>
                <div>
                  <div className="text-primary font-semibold text-sm">25K</div>
                  <div className="text-text-secondary text-xs">推文</div>
                </div>
                <div>
                  <div className="text-primary font-semibold text-sm">95%</div>
                  <div className="text-text-secondary text-xs">活跃度</div>
                </div>
              </div>
              <button className="w-full bg-primary text-white px-4 py-2 rounded-s font-medium hover:bg-primary-600 transition-colors duration-200">
                关注账号
              </button>
            </div>

            {/* Account Card 3 */}
            <div className="bg-surface border border-border rounded-m p-6 hover:shadow-medium hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary font-semibold text-lg">SA</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">@SamAltman</h3>
                  <p className="text-text-secondary text-sm">OpenAI CEO</p>
                </div>
              </div>
              <p className="text-text-primary text-sm leading-relaxed mb-4">
                OpenAI CEO，在人工智能领域具有深厚造诣。领导开发了ChatGPT等革命性AI产品，是AI技术发展和应用的重要推动者。
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-2 py-1 rounded-s text-xs font-medium bg-background text-text-secondary">人工智能</span>
                <span className="inline-flex items-center px-2 py-1 rounded-s text-xs font-medium bg-background text-text-secondary">机器学习</span>
                <span className="inline-flex items-center px-2 py-1 rounded-s text-xs font-medium bg-background text-text-secondary">创业投资</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <div className="text-primary font-semibold text-sm">1.5M</div>
                  <div className="text-text-secondary text-xs">关注者</div>
                </div>
                <div>
                  <div className="text-primary font-semibold text-sm">3.2K</div>
                  <div className="text-text-secondary text-xs">推文</div>
                </div>
                <div>
                  <div className="text-primary font-semibold text-sm">92%</div>
                  <div className="text-text-secondary text-xs">活跃度</div>
                </div>
              </div>
              <button className="w-full bg-primary text-white px-4 py-2 rounded-s font-medium hover:bg-primary-600 transition-colors duration-200">
                关注账号
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-surface border-t border-border mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="text-xl font-bold text-text-primary">TechFinX</span>
              </div>
              <p className="text-text-secondary text-sm">
                © 2024 TechFinX. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default App