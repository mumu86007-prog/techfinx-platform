import { useEffect, useState } from 'react'

type LinkItem = {
  title: string
  url: string
  summary?: string
  publishedAt?: string
  source?: string
}

const TechLinks = () => {
  const [items, setItems] = useState<LinkItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    const base = import.meta.env.BASE_URL || '/'
    const withBase = (p: string) => `${base}${p.replace(/^\/+/, '')}`
    const candidates = [
      withBase('data/links/latest.json'),
      // root-relative and relative fallbacks
      '/data/links/latest.json',
      'data/links/latest.json',
      // fallback to GitHub raw to ensure content even if static asset not deployed yet
      'https://raw.githubusercontent.com/mumu86007-prog/techfinx-platform/main/public/data/links/latest.json',
    ]
    ;(async () => {
      for (const url of candidates) {
        try {
          const r = await fetch(url + '?v=' + Date.now())
          if (!r.ok) continue
          const data = await r.json()
          if (mounted) {
            setItems(Array.isArray(data) ? data.slice(0, 20) : [])
            setLoading(false)
          }
          return
        } catch (e) {
          // try next candidate
        }
      }
      if (mounted) {
        setItems([])
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">每日科技关注（20则）</h1>
        <p className="text-text-secondary">我每天关注的行业动态链接聚合</p>
      </div>

      {loading && <div className="text-text-secondary">加载中…（请先运行抓取脚本生成 latest.json）</div>}

      {!loading && items.length === 0 && (
        <div className="text-text-secondary">暂无数据。请运行数据脚本：/data/links/latest.json</div>
      )}

      <ul className="space-y-4">
        {items.map((it, idx) => (
          <li key={idx} className="p-4 border border-border rounded-lg bg-surface">
            <a href={it.url} target="_blank" rel="noreferrer" className="text-primary font-medium hover:underline">
              {it.title || it.url}
            </a>
            {it.source && <div className="text-xs text-text-secondary mt-1">来源：{it.source}</div>}
            {it.publishedAt && <div className="text-xs text-text-secondary">时间：{new Date(it.publishedAt).toLocaleString()}</div>}
            {it.summary && <p className="text-sm text-text-secondary mt-2">{it.summary}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TechLinks


