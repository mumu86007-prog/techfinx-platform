import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const AccountDetailPage = () => {
  const { id } = useParams<{ id: string }>()

  // TODO: 根据ID获取账号详情
  const account = {
    id: id || '1',
    username: 'JohnPowell',
    displayName: 'Jerome Powell',
    bio: '美联储主席',
    category: '宏观经济',
    tags: ['宏观经济', '货币政策', '金融监管'],
    followers: 2100000,
    tweets: 1200,
    activity: 98,
    description: '美联储主席，负责制定美国货币政策。在宏观经济分析、货币政策制定方面具有丰富经验，其言论对全球金融市场具有重要影响。',
    verified: true,
    location: 'Washington, DC',
    website: 'https://federalreserve.gov',
    joinedDate: '2018-02-05'
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <>
      <Helmet>
        <title>@{account.username} - TechFinX</title>
        <meta name="description" content={`${account.displayName} - ${account.bio}`} />
      </Helmet>

      <div className="container-custom py-8">
        {/* Account Header */}
        <div className="card-base p-8 mb-8">
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-2xl">
                {account.displayName.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-text-primary">
                  @{account.username}
                </h1>
                {account.verified && (
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-xl text-text-secondary mb-4">{account.bio}</p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {formatNumber(account.followers)}
                  </div>
                  <div className="text-text-secondary text-sm">关注者</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {formatNumber(account.tweets)}
                  </div>
                  <div className="text-text-secondary text-sm">推文</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {account.activity}%
                  </div>
                  <div className="text-text-secondary text-sm">活跃度</div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {account.tags.map((tag) => (
                  <span key={tag} className="tag-base">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <button className="btn-primary">
                  关注账号
                </button>
                <a
                  href={`https://twitter.com/${account.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  查看原账号
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Account Description */}
        <div className="card-base p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6">账号介绍</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-text-primary leading-relaxed mb-6">
              {account.description}
            </p>
            
            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-text-primary mb-2">专业领域</h3>
                <p className="text-text-secondary">{account.category}</p>
              </div>
              {account.location && (
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">所在地</h3>
                  <p className="text-text-secondary">{account.location}</p>
                </div>
              )}
              {account.website && (
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">官方网站</h3>
                  <a 
                    href={account.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-600 transition-colors duration-200"
                  >
                    {account.website}
                  </a>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-text-primary mb-2">加入时间</h3>
                <p className="text-text-secondary">
                  {new Date(account.joinedDate).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card-base p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6">最近动态</h2>
          <div className="text-center py-12">
            <div className="text-text-secondary text-lg mb-4">暂无最近动态</div>
            <p className="text-text-secondary">
              请访问原账号查看最新推文和动态
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default AccountDetailPage
