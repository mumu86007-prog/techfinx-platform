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
  interpretation?: string
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
const SUMMARY_LIMIT = 320
const MIN_SUMMARY_LENGTH = 120
const DESIRED_TOPICS = [
  'ai',
  'llm',
  'machine learning',
  'model',
  'fintech',
  'payment',
  'banking',
  'security',
  'cybersecurity',
  'infra',
  'infrastructure',
  'cloud',
  'devops',
  'product',
  'startup',
  'saas',
  'risk',
  'compliance',
  'data',
  'agent',
]
const HN_SEARCHES = [
  'AI',
  'AI startup',
  'LLM',
  'Fintech',
  'OpenAI',
  'Anthropic',
  'security AI',
]

const HIGH_PRIORITY_DOMAINS = [
  'openai.com',
  'anthropic.com',
  'deepmind.com',
  'google.com',
  'microsoft.com',
  'meta.com',
  'x.com',
  'techcrunch.com',
  'theverge.com',
  'wired.com',
  'arstechnica.com',
  'venturebeat.com',
  'forbes.com',
  'fastcompany.com',
  'substack.com',
  'medium.com',
  'github.com',
  'news.ycombinator.com',
]

const LOW_PRIORITY_PATTERNS = [
  /show hn/i,
  /hn:/i,
  /hiring/i,
  /job/i,
  /remote job/i,
  /looking for/i,
  /sale$/i,
  /for sale/i,
  /just a quick thought/i,
  /rant/i,
  /ask hn/i,
  /poll/i,
]

function normalizeText(text?: string, limit = 180): string {
  if (!text) return ''
  const str = text.replace(/\s+/g, ' ').trim()
  if (!str) return ''
  return str.length > limit ? `${str.slice(0, limit).trimEnd()}…` : str
}

function getDomainPriority(url: string): number {
  try {
    const hostname = new URL(url).hostname.toLowerCase()
    if (HIGH_PRIORITY_DOMAINS.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))) return 20
    if (hostname.includes('github.com')) return 8
    if (hostname.includes('medium.com')) return 10
    if (hostname.includes('substack.com')) return 10
    if (hostname.includes('x.com') || hostname.includes('twitter.com')) return 6
    if (hostname.includes('blog')) return 8
    return 5
  } catch {
    return 0
  }
}

function isLowSignalTitle(title: string): boolean {
  const clean = title.trim()
  if (!clean) return true
  if (clean.length < 28) return true
  if (clean.length > 140) return false
  if (LOW_PRIORITY_PATTERNS.some((pattern) => pattern.test(clean))) return true
  const words = clean.split(/\s+/).filter(Boolean)
  return words.length < 5
}

function isMeaningfulSummary(summary: string): boolean {
  const clean = summary.trim()
  if (!clean) return false
  if (clean.length < MIN_SUMMARY_LENGTH) return false
  if (/^(?:https?:\/\/|www\.)/i.test(clean)) return false
  return true
}

function matchesDesiredTopic(title: string, summary: string): boolean {
  const haystack = `${title} ${summary}`.toLowerCase()
  return DESIRED_TOPICS.some((topic) => haystack.includes(topic))
}

function buildInterpretation(title: string, summary: string): string {
  const text = `${title} ${summary}`.toLowerCase()

  if (/openai|anthropic|claude|gpt|llm|deepseek|model|agent/.test(text)) {
    return '这条信息说明模型能力、商业化速度或产品落地正在继续往前走，核心问题不再是“能不能做”，而是“谁先把能力变成持续收入”。'
  }

  if (/fintech|payment|bank|lending|compliance|regulation|risk/.test(text)) {
    return '这类内容通常反映金融基础设施、监管边界或客户风险控制正在被重新定义，意味着行业真正的竞争将落在合规与规模效率上。'
  }

  if (/security|cybersecurity|supply chain|chip|gpu|data center|cloud|infra/.test(text)) {
    return '这类事件往往暴露真实瓶颈：算力、数据中心和安全性才是大规模落地的关键变量，而不只是模型名称本身。'
  }

  if (/startup|funding|vc|saas|product|revenue|growth/.test(text)) {
    return '这条信息更像是市场信号：产品正在从概念迭代走向商业模型验证，真正决定胜负的，是是否能快速形成持续增长。'
  }

  if (/tesla|robot|autonomous|self-driving|hardware|manufacturing/.test(text)) {
    return '这里的关键不只是技术展示，而是硬件落地能力和供应链执行力——这往往决定一项技术是否能真正形成护城河。'
  }

  return '这条消息值得关注的地方，是它揭示的行业趋势：技术创新正在从实验室走向真实业务、监管和规模化落地。'
}

function scoreCandidate(item: Candidate): number {
  let score = item.score
  const haystack = `${item.title} ${item.summary}`.toLowerCase()
  if (/ai|llm|gpt|openai|anthropic|claude|model|agent|deepseek|xai|tesla/i.test(haystack)) score += 3
  if (/startup|funding|vc|fintech|payment|bank|market|earnings|ipo|regulation|chip|gpu|inference|security|compliance|saas|infra|cloud|risk/i.test(haystack)) score += 2
  if (matchesDesiredTopic(item.title, item.summary)) score += 4
  score += getDomainPriority(item.url)
  if (item.summary && item.summary.length > 120) score += 2
  if (item.summary && item.summary.length > 220) score += 2
  if (isLowSignalTitle(item.title)) score -= 7
  return score
}

async function fetchPageSummary(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'TechFinX Aggregator (+https://techfinx.top)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })

    if (!res.ok) return ''

    const html = await res.text()
    const metaMatch = html.match(/<meta[^>]+(?:property|name)=["'](?:og:description|description)["'][^>]*content=["']([^"']+)["'][^>]*>/i)
    if (metaMatch?.[1]) {
      return normalizeText(metaMatch[1].replace(/&amp;/g, '&'), SUMMARY_LIMIT)
    }

    const titleMatch = html.match(/<title>([^<]+)<\/title>/i)
    if (titleMatch?.[1]) {
      return normalizeText(titleMatch[1], SUMMARY_LIMIT)
    }

    const plainText = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    return normalizeText(plainText, SUMMARY_LIMIT)
  } catch {
    return ''
  }
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
      const title = String(hit.title)
      if (isLowSignalTitle(title)) continue

      const publishedAt = hit.created_at || new Date().toISOString()
      const id = String(hit.objectID || `${query}-${hit.title}`)
      const sourceSummary = (hit.story_text || hit.comment_text || '').trim()
      const resolvedSummary = sourceSummary || (await fetchPageSummary(String(hit.url)))
      const normalizedSummary = normalizeText(resolvedSummary || title, SUMMARY_LIMIT)

      if (!isMeaningfulSummary(normalizedSummary)) continue

      const interpretation = buildInterpretation(title, normalizedSummary)

      all.push({
        id,
        title: normalizeText(title, 120),
        url: String(hit.url),
        summary: normalizedSummary,
        interpretation,
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
    .filter((item) => {
      if (isLowSignalTitle(item.title)) return false
      if (!isMeaningfulSummary(item.summary)) return false
      if (!matchesDesiredTopic(item.title, item.summary)) return false
      return true
    })
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
      interpretation: item.interpretation || buildInterpretation(item.title, item.summary),
      publishedAt: item.publishedAt,
    }))

  await writeFile(OUTPUT_FILE, JSON.stringify(ranked, null, 2), 'utf8')
  console.log(`Wrote ${ranked.length} items to ${OUTPUT_FILE}`)
}

main().catch((error) => {
  console.error('Failed to refresh link data:', error)
  process.exit(1)
})
