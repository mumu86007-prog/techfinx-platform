import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'

type SourceInfo = string | { id?: string; name?: string; category?: string }

type LinkItem = {
  id?: string
  title: string
  url: string
  text?: string
  summary?: string
  publishedAt?: string
  source?: SourceInfo
  author?: string
  author_name?: string
  tags?: string[]
  views?: number | string
  likes?: number | string
  retweets?: number | string
  score?: number
}

const TechLinks = () => {
  const [items, setItems] = useState<LinkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [selected, setSelected] = useState<LinkItem | null>(null)

  const closeModal = () => setSelected(null)

  const formatNumber = (num: number | string | undefined): string => {
    if (!num) return '0'
    const n = typeof num === 'string' ? parseInt(num) : num
    if (isNaN(n)) return '0'
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
    return n.toString()
  }

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return '刚刚'
    if (hours < 24) return `${hours}小时前`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString('zh-CN')
  }

  const sourceLabel = (source?: SourceInfo, author?: string, authorName?: string): string => {
    if (author || authorName) return `@${author || authorName}`
    if (!source) return 'X/Twitter'
    if (typeof source === 'string') return source
    return source.name || source.id || 'X/Twitter'
  }

  useEffect(() => {
    let mounted = true
    setLoading(true)

    const urls = [
      'https://raw.githubusercontent.com/mumu86007-prog/techfinx-platform/main/public/data/links/latest.json',
      '/data/links/latest.json',
    ]

    ;(async () => {
      for (const url of urls) {
        try {
          const r = await fetch(url + '?v=' + Date.now())
          if (!r.ok) continue
          const data = await r.json()
          if (mounted && Array.isArray(data) && data.length > 0) {
            setItems(data.slice(0, 20))
            setLoading(false)
            return
          }
        } catch (e) {
          continue
        }
      }
      if (mounted) setLoading(false)
    })()

    return () => { mounted = false }
  }, [])

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.tags?.includes(filter))

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>TechFinX | 科技金融每日精选（X 热门推文）</title>
        <meta
          name="description"
          content="TechFinX：每天精选 X 平台科技与金融热点，提供专业翻译与行业解读，并沉淀可检索的历史内容。"
        />
        <link rel="canonical" href="https://techfinx.top/" />
      </Helmet>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">X</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TechFinX</h1>
                <p className="text-xs text-gray-500">科技金融 · 每日精选</p>
              </div>
              <div className="hidden sm:flex items-center space-x-3 text-sm">
                <a href="/articles" className="text-gray-600 hover:text-blue-600">历史</a>
                <a href="/daily/2026-03-16.html" className="text-gray-600 hover:text-blue-600">今日</a>
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Detail Modal */}
        {selected && (
          <div
            className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div
              className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <button
                  onClick={closeModal}
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
                  {sourceLabel(selected.source, selected.author, selected.author_name)} · {formatDate(selected.publishedAt)}
                </div>

                <h2 className="text-2xl font-bold leading-snug text-gray-900">{selected.title || '详情'}</h2>

                {(selected.text || selected.summary) && (
                  <div className="prose max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selected.text || selected.summary}
                  </div>
                )}

                {selected.tags && selected.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {selected.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                        #{tag}
                      </span>
                    ))}
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
        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFilter('AI')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === 'AI' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            AI
          </button>
          <button
            onClick={() => setFilter('科技')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === '科技' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            科技
          </button>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-2xl p-4 mb-6 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div>
              <span className="text-gray-500">今日精选</span>
              <span className="ml-2 font-bold text-gray-900">{filteredItems.length}</span>
              <span className="text-gray-400">条</span>
            </div>
            <div className="text-gray-300">|</div>
            <div className="text-gray-500">
              更新于 {new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        )}

        {/* Content Cards */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">暂无内容</div>
            <p className="text-sm text-gray-500">请稍后再来查看</p>
          </div>
        )}

        <div className="space-y-4">
          {filteredItems.map((item, idx) => (
            <article 
              key={item.id || idx} 
              className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-200 border border-gray-100"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {sourceLabel(item.source, item.author, item.author_name)}
                    </span>
                    <span className="mx-2 text-gray-300">·</span>
                    <span className="text-sm text-gray-500">{formatDate(item.publishedAt)}</span>
                  </div>
                </div>
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              {/* Title */}
              <h2
                className="text-lg font-semibold text-gray-900 mb-2 leading-snug hover:text-blue-600 transition-colors cursor-pointer"
                onClick={() => setSelected(item)}
              >
                {item.title || '查看详情'}
              </h2>

              {/* Summary/Text */}
              {(item.summary || item.text) && (
                <p 
                  className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 cursor-pointer hover:text-gray-800"
                  onClick={() => setSelected(item)}
                >
                  {item.summary || item.text}
                  <span className="text-blue-600 ml-1 hover:underline">展开</span>
                </p>
              )}

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex items-center space-x-2 mb-4">
                  {item.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
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

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500 pb-8">
          <p>© {new Date().getFullYear()} TechFinX · 数据来源 X/Twitter</p>
          <p className="mt-2">
            联系邮箱：
            <a className="text-blue-500 hover:underline" href="mailto:Mumu86007@gmail.com">
              Mumu86007@gmail.com
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}

export default TechLinks
