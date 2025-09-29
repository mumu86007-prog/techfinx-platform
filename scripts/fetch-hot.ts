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
}

type HotPayload = {
  generatedAt: string
  sources: string[]
  entries: HotEntry[]
}

const SOURCES = [
  {
    name: 'Financial Times · Fintech',
    url: 'https://www.ft.com/technology?format=rss',
  },
  {
    name: 'Hong Kong Monetary Authority · Press Releases',
    url: 'https://www.hkma.gov.hk/eng/news-and-media/rss/press-releases.xml',
  },
]

const OUTPUT_DIR = path.resolve(process.cwd(), 'public', 'data', 'hot')
const LATEST_FILE = path.join(OUTPUT_DIR, 'latest.json')
const MAX_ITEMS = 10

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

const mapItemToEntry = (source: string, item: FeedItem): HotEntry => ({
  source,
  title: item.title ?? 'Untitled',
  link: item.link ?? '#',
  publishedAt: normalizeDate(item),
  summary: trimText(item.contentSnippet ?? item.content ?? ''),
})

async function fetchSourceFeed(source: { name: string; url: string }): Promise<HotEntry[]> {
  try {
    const feed = await parser.parseURL(source.url)
    return (feed.items ?? []).slice(0, MAX_ITEMS).map((item) => mapItemToEntry(source.name, item))
  } catch (error) {
    console.error(`Failed to fetch RSS from ${source.url}`, error)
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

