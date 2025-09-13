import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { fetchHotItems } from '../../store/slices/hotSlice'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const FeaturedSection = () => {
  const dispatch = useDispatch()
  const { items, loading } = useSelector((state: RootState) => state.hot)

  useEffect(() => {
    dispatch(fetchHotItems())
  }, [dispatch])

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-primary to-secondary rounded-l p-8 mb-8">
        <div className="skeleton h-8 w-64 mb-4"></div>
        <div className="skeleton h-4 w-full mb-2"></div>
        <div className="skeleton h-4 w-3/4 mb-4"></div>
        <div className="skeleton h-4 w-48"></div>
      </div>
    )
  }

  const featuredItem = items[0]
  if (!featuredItem) return null

  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return '刚刚'
    if (diffInHours < 24) return `${diffInHours}小时前`
    return `${Math.floor(diffInHours / 24)}天前`
  }

  return (
    <div className="bg-gradient-to-r from-primary to-secondary rounded-l p-8 mb-8 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold">今日热点</h2>
        <Link 
          to="/hot" 
          className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium"
        >
          查看更多 →
        </Link>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">{featuredItem.title}</h3>
        <p className="text-white/90 leading-relaxed mb-4">
          {featuredItem.content}
        </p>
        <div className="flex items-center space-x-6 text-white/70 text-sm">
          <span>📊 {featuredItem.category}</span>
          <span>⏰ {formatTime(featuredItem.publishTime)}</span>
          <span>👀 {featuredItem.views.toLocaleString()} 浏览</span>
        </div>
      </div>

      {/* Analysis */}
      <div className="bg-white/10 rounded-m p-4">
        <h4 className="font-semibold mb-2">深度分析</h4>
        <p className="text-white/90 text-sm leading-relaxed">
          {featuredItem.analysis}
        </p>
      </div>
    </div>
  )
}

export default FeaturedSection
