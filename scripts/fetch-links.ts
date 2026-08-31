/*
  Aggregate AI/tech stories from Hacker News' public Algolia API and
  output the latest top items to public/data/links/latest.json.

  This avoids the blocked public RSSHub mirrors that were returning 403.
*/
import { mkdir, writeFile } from 'fs/promises'
import { resolve } from 'path'

type Candidate = {
  id: string
  title: string
  url: string
  summary: string
  publishedAt: string
  source: {
    id: string
    name: string
    category: 'AI' | 'Industry' | 'Blockchain' | 'Product' | 'Social'
  }
  tags?: string[]
  score: number
  author?: string
  likes?: number
  views?: number
  retweets?: number
}

const OUTPUT_FILE = resolve(process.cwd(), 'public', 'data', 'links', 'latest.json')
const MAX_ITEMS = 20
const HN_SEARCHES = [
  'AI',
  'AI startup',
  'LLM',
  'Fintech',
  'OpenAI',
  'Anthropic',
]

function normalizeText(text?: string, limit = 180): string {
  if (!text) return ''
  const str = text.replace(/\s+/g, ' ').trim()
  if (!str) return ''
  return str.length > limit ? `${str.slice(0, limit).trimEnd()}…` : str
}

function scoreCandidate(item: Candidate): number {
  let score = item.score
  const haystack = `${item.title} ${item.summary}`.toLowerCase()
  if (/ai|llm|gpt|openai|anthropic|claude|model|agent|deepseek|xai|tesla/i.test(haystack)) score += 3
  if (/startup|funding|vc|fintech|payment|bank|market|earnings|ipo/i.test(haystack)) score += 2
  if (/security|policy|regulation|chip|gpu|inference/i.test(haystack)) score += 1.5
  return score
}

async function fetchHNStories(): Promise<Candidate[]> {
  const all: Candidate[] = []

  for (const query of HN_SEARCHES) {
    const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=10`
    const res = await fetch(url, { headers: { 'User-Agent': 'TechFinX Aggregator (+https://techfinx.top)' } })
    if (!res.ok) {
      console.warn(`HN query failed: ${query} => ${res.status}`)
      continue
    }

    const json = (await res.json()) as { hits?: Array<any> }
    const hits = json.hits ?? []

    for (const hit of hits) {
      if (!hit?.title || !hit?.url) continue
      const publishedAt = hit.created_at || new Date().toISOString()
      const id = String(hit.objectID || `${query}-${hit.title}`)
      all.push({
        id,
        title: normalizeText(hit.title, 120),
        url: String(hit.url),
        summary: normalizeText(hit.story_text || hit.title, 180),
        publishedAt,
        source: { id: 'hn', name: 'Hacker News', category: 'AI' },
        tags: ['AI', '科技'],
        score: Number(hit.points || 1),
        author: hit.author,
        likes: Number(hit.points || 0),
        views: Number(hit.num_comments || 0),
        retweets: 0,
      })
    }
  }

  return all
}

async function main() {
  const outDir = resolve(process.cwd(), 'public', 'data', 'links')
  await mkdir(outDir, { recursive: true })

  const items = await fetchHNStories()
  const unique = new Map<string, Candidate>()

  for (const item of items) {
    const publishedAt = new Date(item.publishedAt)
    if (!Number.isFinite(publishedAt.getTime())) continue
    const score = scoreCandidate(item)
    const candidate = { ...item, score }
    const existing = unique.get(candidate.url)
    if (!existing || score > existing.score) {
      unique.set(candidate.url, candidate)
    }
  }

  const ranked = Array.from(unique.values())
    .sort((a, b) => {
      const t1 = new Date(b.publishedAt).getTime()
      const t2 = new Date(a.publishedAt).getTime()
      if (t1 === t2) return (b.score ?? 0) - (a.score ?? 0)
      return t1 - t2
    })
    .slice(0, MAX_ITEMS)
    .map((item) => ({
      ...item,
      text: item.summary,
      source: item.source.name,
      author: item.author,
      author_name: item.author,
      views: item.views ?? item.likes ?? 0,
      likes: item.likes ?? 0,
      retweets: item.retweets ?? 0,
      title: item.title,
      summary: item.summary,
      publishedAt: item.publishedAt,
    }))

  await writeFile(OUTPUT_FILE, JSON.stringify(ranked, null, 2), 'utf8')
  console.log(`Wrote ${ranked.length} items to ${OUTPUT_FILE}`)
}

main().catch((error) => {
  console.error('Failed to refresh link data:', error)
  process.exit(1)
})
