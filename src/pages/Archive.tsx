import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'

type LinkItem = {
  id?: string
  title: string
  url: string
  text?: string
  summary?: string
  publishedAt?: string
  source?: string | { id?: string; name?: string }
  author?: string
  author_name?: string
  tags?: string[]
  views?: number | string
  likes?: number | string
  retweets?: number | string
}

const Header = () => (
  <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-3">
          <Link to="/" className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center hover:shadow-lg transition-shadow">
            <span className="text-white font-bold text-lg">X</span>
          </Link>
          <div>
            <Link to="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">TechFinX</Link>
            <p className="text-xs text-gray-500">科技金融 · 每日精选</p>
          </div>
          <div className="hidden sm:flex items-center space-x-3 text-sm ml-4">
            <Link to="/articles" className="text-gray-600 hover:text-blue-600 transition-colors">个人文章</Link>
            <Link to="/archive" className="text-blue-600 font-medium">历史归档</Link>
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">今日</Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <a href="https://x.com/mumu86007" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </header>
)

const formatNumber = (num: number | string | undefined): string => {
  if (!num) return '0'
  const n = typeof num === 'string' ? parseInt(num) : num
  if (isNaN(n)) return '0'
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

// 日期归档列表页
const ArchiveList = () => {
  const [dates, setDates] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    
    fetch('/data/links/index.json')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!mounted) return
        if (data && data.dates) {
          setDates(data.dates)
        }
        setLoading(false)
      })
      .catch(() => {
        if (!mounted) return
        setLoading(false)
      })
    
    return () => { mounted = false }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>TechFinX | 历史归档</title>
        <meta name="description" content="TechFinX 历史归档：查看过去每日精选的科技金融热点内容。" />
      </Helmet>
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">历史归档</h1>
            <p className="text-gray-500">查看过去每日精选内容</p>
          </div>

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          )}

          {!loading && dates.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <div className="text-gray-400 mb-2">暂无归档内容</div>
              <p className="text-sm text-gray-500">每日内容将自动保存至此</p>
            </div>
          )}

          <div className="grid gap-4">
            {dates.map(date => (
              <Link
                key={date}
                to={`/archive/${date}`}
                className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-2xl hover:border-blue-400 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">{date.slice(5)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {date} 每日精选
                    </h3>
                    <p className="text-sm text-gray-400">点击查看当日内容</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500 pb-8">
          <p>© {new Date().getFullYear()} TechFinX</p>
        </div>
      </main>
    </div>
  )
}

// 单日内容详情页
const ArchiveDetail = () => {
  const { date } = useParams<{ date: string }>()
  const [items, setItems] = useState<LinkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<LinkItem | null>(null)

  useEffect(() => {
    if (!date) return
    let mounted = true
    setLoading(true)
    
    fetch(`/data/links/${date}.json`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (!mounted) return
        setItems(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        if (!mounted) return
        setLoading(false)
      })
    
    return () => { mounted = false }
  }, [date])

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>TechFinX | {date} 每日精选</title>
        <meta name="description" content={`TechFinX ${date} 每日精选：X平台科技金融热点内容。`} />
      </Helmet>
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Detail Modal */}
        {selected && (
          <div
            className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <div
              className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white">
                <button
                  onClick={() => setSelected(null)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  ← 返回
                </button>
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  打开原文
                </a>
              </div>

              <div className="p-6 space-y-4">
                <div className="text-sm text-gray-500">
                  @{selected.author || selected.author_name || 'unknown'}
                </div>

                <h2 className="text-2xl font-bold leading-snug text-gray-900">{selected.title || '详情'}</h2>

                {(selected.summary || selected.text) && (
                  <div className="prose max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selected.summary || selected.text}
                  </div>
                )}

                <div className="flex flex-wrap gap-5 text-sm text-gray-500 pt-4 border-t border-gray-100">
                  {selected.views && <span>浏览 {formatNumber(selected.views)}</span>}
                  {selected.likes && <span>点赞 {formatNumber(selected.likes)}</span>}
                  {selected.retweets && <span>转发 {formatNumber(selected.retweets)}</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center space-x-4">
          <Link to="/archive" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回归档列表
          </Link>
          <span className="text-gray-300">|</span>
          <Link to="/" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
            回到首页
          </Link>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">{date} 每日精选</h1>
            <p className="text-gray-500">{formatDateDisplay(date || '')}</p>
          </div>

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <div className="text-gray-400 mb-2">暂无内容</div>
              <p className="text-sm text-gray-500">该日期可能还没有抓取到内容</p>
            </div>
          )}

          <div className="space-y-4">
            {items.map((item, idx) => (
              <article 
                key={item.id || idx} 
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelected(item)}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-900">@{item.author || item.author_name || 'unknown'}</span>
                </div>

                <h2 className="text-lg font-semibold text-gray-900 mb-2 leading-snug hover:text-blue-600 transition-colors">
                  {item.title || '查看详情'}
                </h2>

                {(item.summary || item.text) && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {item.summary || item.text}
                    <span className="text-blue-600 ml-1">展开</span>
                  </p>
                )}

                <div className="flex items-center space-x-6 text-sm text-gray-500 pt-3 border-t border-gray-100">
                  {item.views && (
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{formatNumber(item.views)}</span>
                    </div>
                  )}
                  {item.likes && (
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{formatNumber(item.likes)}</span>
                    </div>
                  )}
                  {item.retweets && (
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>{formatNumber(item.retweets)}</span>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500 pb-8">
          <p>© {new Date().getFullYear()} TechFinX</p>
        </div>
      </main>
    </div>
  )
}

export { ArchiveList, ArchiveDetail }
