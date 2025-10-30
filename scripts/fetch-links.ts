/*
  Aggregate multi-source tech intelligence via RSSHub, score entries, and
  output top 20 stories to public/data/links/latest.json.

  Usage: pnpm tsx scripts/fetch-links.ts
*/
import Parser from 'rss-parser'
import { mkdir, writeFile } from 'fs/promises'
import { resolve } from 'path'

type Category = 'AI' | 'Industry' | 'Blockchain' | 'Product' | 'Social'

type FeedSource = {
  id: string
  name: string
  route: string
  category: Category
  weight: number
  tags?: string[]
}

type Candidate = {
  id: string
  title: string
  url: string
  summary: string
  publishedAt: string
  source: {
    id: string
    name: string
    category: Category
  }
  tags?: string[]
  score: number
}

const ENV_ENDPOINTS = (process.env.RSSHUB_ENDPOINTS || process.env.RSSHUB_ENDPOINT || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
const RSSHUB_ENDPOINTS = (ENV_ENDPOINTS.length > 0
  ? ENV_ENDPOINTS
  : ['https://rsshub.app', 'https://rsshub.rssforever.com', 'https://rsshub.uneasy.win']
).map((s) => s.replace(/\/$/, ''))
const OUTPUT_FILE = resolve(process.cwd(), 'public', 'data', 'links', 'latest.json')
const SNIPPET_LIMIT = 160
const MAX_ITEMS = 20

const FEEDS: FeedSource[] = [
  {
    id: 'hackernews',
    name: 'Hacker News',
    route: '/hackernews',
    category: 'AI',
    weight: 3,
    tags: ['开发者', '社区'],
  },
]

const KEYWORD_RULES: { pattern: RegExp; score: number }[] = [
  { pattern: /AI|人工智能|大模型|生成式|GenAI/i, score: 2 },
  { pattern: /投资|融资|IPO|收购|并购|估值/i, score: 1.5 },
  { pattern: /监管|政策|合规|SEC|欧盟|China/i, score: 1 },
  { pattern: /区块链|Web3|加密|crypto|DeFi|NFT/i, score: 1.5 },
  { pattern: /芯片|半导体|Nvidia|英伟达|ARM|TSMC/i, score: 1 },
]

const parser = new Parser({ headers: { 'User-Agent': 'TechFinX Aggregator (+https://techfinx.top)' } })

function normalizeText(text?: string, limit = SNIPPET_LIMIT): string {
  if (!text) return ''
  const str = text.replace(/\s+/g, ' ').trim()
  if (!str) return ''
  return str.length > limit ? `${str.slice(0, limit).trimEnd()}…` : str
}

function scoreItem(candidate: Candidate): number {
  let score = candidate.score
  const text = `${candidate.title} ${candidate.summary}`

  for (const rule of KEYWORD_RULES) {
    if (rule.pattern.test(text)) {
      score += rule.score
    }
  }

  const ageHours = (Date.now() - new Date(candidate.publishedAt).getTime()) / 36e5
  if (ageHours <= 6) score += 3
  else if (ageHours <= 12) score += 2
  else if (ageHours <= 24) score += 1
  else if (ageHours > 48) score -= 100 // will be filtered later

  return score
}

async function fetchFeed(feed: FeedSource): Promise<Candidate[]> {
  for (const endpoint of RSSHUB_ENDPOINTS) {
    const url = `${endpoint}${feed.route.startsWith('/') ? feed.route : `/${feed.route}`}`
    try {
      const data = await parser.parseURL(url)
      if (!data.items?.length) continue

      console.log(`Feed ${feed.id} loaded via ${endpoint}`)

      return data.items
        .filter((item) => item.link)
        .map((item, idx) => {
          const title = normalizeText(item.title || item.link || '')
          const summary = normalizeText(item.contentSnippet || item.content || item.summary || '')
          const publishedAt = item.isoDate || item.pubDate || new Date().toISOString()
          return {
            id: `${feed.id}-${item.guid || item.id || idx}`,
            title,
            url: item.link as string,
            summary,
            publishedAt,
            source: {
              id: feed.id,
              name: feed.name,
              category: feed.category,
            },
            tags: feed.tags,
            score: feed.weight,
          }
        })
    } catch (error) {
      console.warn(`Feed ${feed.id} failed on ${endpoint}:`, error instanceof Error ? error.message : error)
    }
  }

  console.warn(`Feed ${feed.id} skipped: all RSSHub endpoints failed`)
  return []
}

async function main() {
  const outDir = resolve(process.cwd(), 'public', 'data', 'links')
  await mkdir(outDir, { recursive: true })

  const candidates: Candidate[] = []
  for (const feed of FEEDS) {
    const items = await fetchFeed(feed)
    candidates.push(...items)
  }

  const unique = new Map<string, Candidate>()
  for (const candidate of candidates) {
    const publishedAt = new Date(candidate.publishedAt)
    if (!Number.isFinite(publishedAt.getTime())) continue
    if (Date.now() - publishedAt.getTime() > 1000 * 60 * 60 * 72) continue // ignore >72h

    candidate.score = scoreItem(candidate)
    if (candidate.score < 0) continue

    const key = candidate.url
    const existing = unique.get(key)
    if (!existing || candidate.score > existing.score) {
      unique.set(key, candidate)
    }
  }

  const ranked = Array.from(unique.values())
    .sort((a, b) => {
      if (b.score === a.score) {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      }
      return b.score - a.score
    })
    .slice(0, MAX_ITEMS)

  await writeFile(OUTPUT_FILE, JSON.stringify(ranked, null, 2), 'utf8')
  console.log(`Wrote ${ranked.length} items (from ${FEEDS.length} feeds) via RSSHub endpoints: ${RSSHUB_ENDPOINTS.join(', ')}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
