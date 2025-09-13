import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { RootState } from '../store'
import { fetchHotItems } from '../store/slices/hotSlice'

const HotPage = () => {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector((state: RootState) => state.hot)

  useEffect(() => {
    dispatch(fetchHotItems())
  }, [dispatch])

  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return '刚刚'
    if (diffInHours < 24) return `${diffInHours}小时前`
    return `${Math.floor(diffInHours / 24)}天前`
  }

  if (error) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="text-error text-lg mb-4">加载失败</div>
        <p className="text-text-secondary">{error}</p>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>每日热点 - TechFinX</title>
        <meta name="description" content="获取金融科技领域的最新热点和深度分析，了解行业趋势" />
      </Helmet>

      <div className="container-custom py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-4">每日热点</h1>
          <p className="text-text-secondary text-lg">
            精选金融科技领域的最新热点，深度分析行业趋势
          </p>
        </div>

        {/* Hot Items */}
        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="card-base p-8">
                <div className="skeleton h-8 w-3/4 mb-4"></div>
                <div className="skeleton h-4 w-full mb-2"></div>
                <div className="skeleton h-4 w-5/6 mb-4"></div>
                <div className="skeleton h-20 w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <article key={item.id} className="card-base p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-text-primary mb-3">
                      {item.title}
                    </h2>
                    <div className="flex items-center space-x-4 text-text-secondary text-sm mb-4">
                      <span>📊 {item.category}</span>
                      <span>⏰ {formatTime(item.publishTime)}</span>
                      <span>👀 {item.views.toLocaleString()} 浏览</span>
                      <span>❤️ {item.likes} 点赞</span>
                      <span>🔄 {item.shares} 分享</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <p className="text-text-primary leading-relaxed mb-4">
                    {item.content}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag) => (
                      <span key={tag} className="tag-base">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Analysis */}
                <div className="bg-background rounded-m p-6 mb-6">
                  <h3 className="font-semibold text-text-primary mb-3">深度分析</h3>
                  <p className="text-text-primary leading-relaxed">
                    {item.analysis}
                  </p>
                </div>

                {/* Tweet Screenshots */}
                {item.tweetScreenshots && item.tweetScreenshots.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-text-primary mb-3">相关推文</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {item.tweetScreenshots.map((_, index) => (
                        <div key={index} className="border border-border rounded-m overflow-hidden">
                          <div className="bg-background p-4 text-center text-text-secondary">
                            推文截图 {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Info */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {item.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">@{item.author}</div>
                      <div className="text-text-secondary text-sm">分析师</div>
                    </div>
                  </div>
                  <div className="text-text-secondary text-sm">
                    发布于 {formatTime(item.publishTime)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <div className="text-center py-16">
            <div className="text-text-secondary text-lg mb-4">暂无热点内容</div>
            <p className="text-text-secondary">请稍后再来查看最新热点</p>
          </div>
        )}
      </div>
    </>
  )
}

export default HotPage
