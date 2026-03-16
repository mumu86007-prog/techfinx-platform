import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'

type Article = {
  title: string
  url: string
  date: string
}

const Articles = () => {
  const [items, setItems] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch('/data/articles.json')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!mounted) return
        setItems(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        if (!mounted) return
        setItems([])
        setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <Helmet>
        <title>TechFinX | 历史内容</title>
        <meta name="description" content="TechFinX 历史内容归档：每日速递与专题文章列表，便于检索与 SEO 收录。" />
        <link rel="canonical" href="https://techfinx.top/articles" />
      </Helmet>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">个人文章</h1>
        <p className="text-text-secondary">我的文章更新列表</p>
      </div>

      {loading && <div className="text-text-secondary">加载中…（编辑 public/data/articles.json 添加文章）</div>}
      {!loading && items.length === 0 && <div className="text-text-secondary">暂无文章</div>}

      <ul className="space-y-3">
        {items.map((a, idx) => (
          <li key={idx} className="flex items-center justify-between p-3 border border-border rounded-md bg-surface">
            <a href={a.url} target="_blank" rel="noreferrer" className="text-primary font-medium hover:underline">
              {a.title}
            </a>
            <span className="text-sm text-text-secondary">{new Date(a.date).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Articles


