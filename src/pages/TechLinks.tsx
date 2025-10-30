import { useEffect, useState } from 'react'
// Fallback: bundle the raw sources list and render URLs if JSON is empty
// Vite will inline the text content at build time
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - raw import for text file
import sourcesRaw from '../../external/tech-links/sources.txt?raw'

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
    // Avoid relying on Vite types in CI: compute a simple root-based path
    const withBase = (p: string) => `/${p.replace(/^\/+/, '')}`
    const candidates = [
      // Prefer remote raw to avoid static-asset timing issues
      'https://raw.githubusercontent.com/mumu86007-prog/techfinx-platform/main/public/data/links/latest.json',
      // jsDelivr mirror as an additional fallback
      'https://cdn.jsdelivr.net/gh/mumu86007-prog/techfinx-platform@main/public/data/links/latest.json',
      // Same-origin copies (should be present when public assets are deployed)
      withBase('data/links/latest.json'),
      '/data/links/latest.json',
      'data/links/latest.json',
    ]
    ;(async () => {
      for (const url of candidates) {
        try {
          const r = await fetch(url + '?v=' + Date.now())
          if (!r.ok) continue
          const data = await r.json()
          if (mounted) {
            const arr = Array.isArray(data) ? data : []
            if (arr.length > 0) {
              setItems(arr.slice(0, 20))
              setLoading(false)
              return
            }
          }
          // continue to next candidate when empty
        } catch (e) {
          // try next candidate
        }
      }
      // Final fallback: render plain URLs from sources.txt so the page always has content
      if (mounted) {
        const urls = String(sourcesRaw)
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter((s) => s && !s.startsWith('#'))
          .slice(0, 20)
        const fallback = urls.map((u) => ({ title: u, url: u }))
        setItems(fallback)
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


