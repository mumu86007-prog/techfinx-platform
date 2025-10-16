import fs from 'node:fs/promises'
import path from 'node:path'

import Parser from 'rss-parser'

type FeedItem = {
  title: string
  link: string
  isoDate?: string
  pubDate?: string
  contentSnippet?: string
  content?: string
}

type HotEntry = {
  source: string
  title: string
  link: string
  publishedAt: string
  summary: string
  category: string
}

type HotPayload = {
  generatedAt: string
  sources: string[]
  entries: HotEntry[]
}

const SOURCES = [
  {
    name: 'Product Hunt · AI & Tech',
    url: 'https://www.producthunt.com/feed',
    category: 'AI 产品',
  },
  {
    name: 'Dev.to · AI',
    url: 'https://dev.to/api/articles?tag=ai&per_page=10',
    category: 'AI 技术',
  },
  {
    name: 'HackerNews · Top Stories',
    url: 'https://news.ycombinator.com/rss',
    category: '科技动态',
  },
]

const OUTPUT_DIR = path.resolve(process.cwd(), 'public', 'data', 'hot')
const LATEST_FILE = path.join(OUTPUT_DIR, 'latest.json')
const MAX_ITEMS = 15

const parser = new Parser({
  customFields: {
    item: [['content:encoded', 'encodedContent']],
  },
})

const trimText = (text?: string | null, max = 220) => {
  if (!text) return ''
  const cleaned = text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  if (cleaned.length <= max) return cleaned
  return `${cleaned.slice(0, max - 3)}...`
}

const normalizeDate = (item: FeedItem) => {
  const date = item.isoDate || item.pubDate
  if (!date) return new Date().toISOString()
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString()
}

const mapItemToEntry = (source: string, category: string, item: FeedItem): HotEntry => ({
  source,
  title: item.title ?? 'Untitled',
  link: item.link ?? '#',
  publishedAt: normalizeDate(item),
  summary: trimText(item.contentSnippet ?? item.content ?? ''),
  category,
})

async function fetchSourceFeed(source: { name: string; url: string; category: string }): Promise<HotEntry[]> {
  try {
    // 特殊处理 Dev.to API
    if (source.url.includes('dev.to')) {
      const response = await fetch(source.url)
      if (!response.ok) return []
      const data = await response.json() as Array<{ title: string; url: string; published_at: string; description: string }>
      return data.slice(0, MAX_ITEMS).map((item) => ({
        source: source.name,
        title: item.title,
        link: item.url,
        publishedAt: item.published_at,
        summary: trimText(item.description),
        category: source.category,
      }))
    }

    // RSS 源处理
    const feed = await parser.parseURL(source.url)
    return (feed.items ?? []).slice(0, MAX_ITEMS).map((item) => mapItemToEntry(source.name, source.category, item))
  } catch (error) {
    console.error(`Failed to fetch from ${source.url}`, error)
    return []
  }
}

async function ensureOutputDir() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true })
}

async function writeOutput(payload: HotPayload) {
  await ensureOutputDir()
  const filename = path.join(
    OUTPUT_DIR,
    `${new Date(payload.generatedAt).toISOString().slice(0, 10)}.json`,
  )
  const json = JSON.stringify(payload, null, 2)
  await fs.writeFile(filename, json, 'utf8')
  await fs.writeFile(LATEST_FILE, json, 'utf8')
  console.log(`✅ 最新热点数据已写入 ${filename} 和 latest.json`)
}

async function main() {
  const allEntries = (
    await Promise.all(SOURCES.map((source) => fetchSourceFeed(source)))
  ).flat()

  const sortedEntries = allEntries
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, MAX_ITEMS)

  const payload: HotPayload = {
    generatedAt: new Date().toISOString(),
    sources: SOURCES.map((item) => item.name),
    entries: sortedEntries,
  }

  await writeOutput(payload)
}

main().catch((error) => {
  console.error('❌ 抓取热点数据失败', error)
  process.exitCode = 1
})


