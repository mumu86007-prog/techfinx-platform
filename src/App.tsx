import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

// 模拟数据
const mockAccounts = [
  {
    id: '1',
    username: 'JohnPowell',
    displayName: 'Jerome Powell',
    bio: '美联储主席',
    category: '宏观经济',
    tags: ['宏观经济', '货币政策', '金融监管'],
    followers: 2100000,
    tweets: 1200,
    activity: 98,
    description: '美联储主席，负责制定美国货币政策。在宏观经济分析、货币政策制定方面具有丰富经验，其言论对全球金融市场具有重要影响。',
    verified: true
  },
  {
    id: '2',
    username: 'ElonMusk',
    displayName: 'Elon Musk',
    bio: '特斯拉CEO',
    category: '科技创业',
    tags: ['电动汽车', '太空探索', '人工智能'],
    followers: 150000000,
    tweets: 25000,
    activity: 95,
    description: '特斯拉和SpaceX的CEO，在电动汽车、太空探索、人工智能等领域具有前瞻性视野。其推文经常引发市场波动，是科技和金融界的重要意见领袖。',
    verified: true
  },
  {
    id: '3',
    username: 'SamAltman',
    displayName: 'Sam Altman',
    bio: 'OpenAI CEO',
    category: '人工智能',
    tags: ['人工智能', '机器学习', '创业投资'],
    followers: 1500000,
    tweets: 3200,
    activity: 92,
    description: 'OpenAI CEO，在人工智能领域具有深厚造诣。领导开发了ChatGPT等革命性AI产品，是AI技术发展和应用的重要推动者。',
    verified: true
  },
  {
    id: '4',
    username: 'WarrenBuffett',
    displayName: 'Warren Buffett',
    bio: '伯克希尔·哈撒韦CEO',
    category: '投资分析',
    tags: ['价值投资', '股票分析', '长期投资'],
    followers: 1800000,
    tweets: 450,
    activity: 85,
    description: '传奇投资大师，伯克希尔·哈撒韦公司CEO。以价值投资理念闻名，其投资策略和年度股东信备受全球投资者关注。',
    verified: true
  },
  {
    id: '5',
    username: 'CathieWood',
    displayName: 'Cathie Wood',
    bio: 'ARK Invest CEO',
    category: '投资分析',
    tags: ['创新投资', '科技股', 'ETF'],
    followers: 1200000,
    tweets: 2800,
    activity: 88,
    description: 'ARK Invest创始人兼CEO，专注于颠覆性创新投资。其投资理念和ARK基金表现备受市场关注，是科技投资领域的重要声音。',
    verified: true
  },
  {
    id: '6',
    username: 'VitalikButerin',
    displayName: 'Vitalik Buterin',
    bio: '以太坊创始人',
    category: '区块链',
    tags: ['区块链', '以太坊', '加密货币'],
    followers: 4800000,
    tweets: 8900,
    activity: 90,
    description: '以太坊联合创始人，区块链技术的重要推动者。在加密货币、智能合约、去中心化应用等领域具有深远影响。',
    verified: true
  },
  {
    id: '7',
    username: 'Naval',
    displayName: 'Naval Ravikant',
    bio: 'AngelList CEO',
    category: '创业投资',
    tags: ['创业', '投资', '哲学'],
    followers: 1800000,
    tweets: 12000,
    activity: 95,
    description: 'AngelList联合创始人兼CEO，知名天使投资人。其关于创业、投资和人生的思考深受创业者喜爱，是硅谷重要的思想领袖。',
    verified: true
  },
  {
    id: '8',
    username: 'balajis',
    displayName: 'Balaji Srinivasan',
    bio: '前Coinbase CTO',
    category: '加密货币',
    tags: ['加密货币', '网络国家', '技术'],
    followers: 950000,
    tweets: 15000,
    activity: 92,
    description: '前Coinbase CTO，知名技术专家和投资人。在网络国家、加密货币、技术趋势等方面有独到见解，是科技界的重要意见领袖。',
    verified: true
  },
  {
    id: '9',
    username: 'sama',
    displayName: 'Sam Altman',
    bio: 'OpenAI CEO',
    category: '人工智能',
    tags: ['人工智能', '创业', '技术'],
    followers: 1500000,
    tweets: 3200,
    activity: 92,
    description: 'OpenAI CEO，在人工智能领域具有深厚造诣。领导开发了ChatGPT等革命性AI产品，是AI技术发展和应用的重要推动者。',
    verified: true
  },
  {
    id: '10',
    username: 'paulg',
    displayName: 'Paul Graham',
    bio: 'Y Combinator联合创始人',
    category: '创业投资',
    tags: ['创业', '投资', '编程'],
    followers: 1200000,
    tweets: 8500,
    activity: 88,
    description: 'Y Combinator联合创始人，知名创业导师和投资人。其关于创业、编程和人生的文章深受创业者喜爱，是硅谷重要的思想领袖。',
    verified: true
  }
]

const categories = ['全部', '投资分析', '宏观经济', '科技创业', '人工智能', '区块链', '加密货币', '创业投资']

function App() {
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredAccounts, setFilteredAccounts] = useState(mockAccounts)

  // 筛选账号
  const filterAccounts = () => {
    let filtered = mockAccounts

    // 按分类筛选
    if (selectedCategory !== '全部') {
      filtered = filtered.filter(account => 
        account.category.includes(selectedCategory) || 
        account.tags.some(tag => tag.includes(selectedCategory))
      )
    }

    // 按搜索关键词筛选
    if (searchQuery) {
      filtered = filtered.filter(account => 
        account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setFilteredAccounts(filtered)
  }

  // 当筛选条件改变时重新筛选
  useEffect(() => {
    filterAccounts()
  }, [selectedCategory, searchQuery])

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const handleFollow = (accountId: string) => {
    console.log('Follow account:', accountId)
    alert(`关注账号: ${accountId}`)
  }

  return (
    <>
      <Helmet>
        <title>TechFinX - 金融科技账号聚合站</title>
        <meta name="description" content="发现优质金融和科技领域账号，获取最新行业热点" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-surface border-b border-border sticky top-0 z-50">
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

          {/* Search Bar */}
          <div className="mb-8">
            <div className="max-w-2xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索账号、关键词或标签..."
                className="w-full px-4 py-3 border border-border rounded-s bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary transition-colors duration-200"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-s font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-background text-text-primary border border-border hover:bg-primary hover:text-white hover:border-primary'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
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

          {/* Accounts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccounts.map((account) => (
              <div key={account.id} className="bg-surface border border-border rounded-m p-6 hover:shadow-medium hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary font-semibold text-lg">
                      {account.displayName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-text-primary">@{account.username}</h3>
                      {account.verified && (
                        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-text-secondary text-sm">{account.bio}</p>
                  </div>
                </div>

                <p className="text-text-primary text-sm leading-relaxed mb-4">
                  {account.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {account.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2 py-1 rounded-s text-xs font-medium bg-background text-text-secondary">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-primary font-semibold text-sm">
                      {formatNumber(account.followers)}
                    </div>
                    <div className="text-text-secondary text-xs">关注者</div>
                  </div>
                  <div>
                    <div className="text-primary font-semibold text-sm">
                      {formatNumber(account.tweets)}
                    </div>
                    <div className="text-text-secondary text-xs">推文</div>
                  </div>
                  <div>
                    <div className="text-primary font-semibold text-sm">
                      {account.activity}%
                    </div>
                    <div className="text-text-secondary text-xs">活跃度</div>
                  </div>
                </div>

                <button
                  onClick={() => handleFollow(account.id)}
                  className="w-full bg-primary text-white px-4 py-2 rounded-s font-medium hover:bg-primary-600 transition-colors duration-200"
                >
                  关注账号
                </button>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAccounts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-text-secondary text-lg mb-4">未找到相关账号</div>
              <p className="text-text-secondary">请尝试其他分类或搜索关键词</p>
            </div>
          )}
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