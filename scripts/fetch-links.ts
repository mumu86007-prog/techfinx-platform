/*
  Read sources from external/tech-links/sources.txt (one URL per line),
  fetch each page, extract <title> and basic meta description, and
  write to public/data/links/latest.json (up to 20 items).

  Usage: pnpm tsx scripts/fetch-links.ts
*/
import { readFile, writeFile, mkdir } from 'fs/promises'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

type LinkItem = { title: string; url: string; summary?: string; publishedAt?: string; source?: string }

const SNIPPET_LIMIT = 50

function normalizeText(text?: string): string | undefined {
  if (!text) return undefined
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (!normalized) return undefined
  if (normalized.length <= SNIPPET_LIMIT) return normalized
  return normalized.slice(0, SNIPPET_LIMIT).trimEnd() + '…'
}

function extractTitle(html: string): string | undefined {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  if (m) return m[1].trim().replace(/\s+/g, ' ')
  return undefined
}

function extractMetaDescription(html: string): string | undefined {
  const metaRegex = /<meta[^>]+(?:name|property)=["'](?:description|og:description)["'][^>]*>/gi
  let match: RegExpExecArray | null
  while ((match = metaRegex.exec(html))) {
    const tag = match[0]
    const cm = tag.match(/content=["']([\s\S]*?)["']/i)
    const value = normalizeText(cm?.[1])
    if (value) return value
  }
  return undefined
}

async function fetchFallbackSnippet(url: string): Promise<string | undefined> {
  try {
    const jinaUrl = `https://r.jina.ai/${url}`
    const res = await fetch(jinaUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    if (!res.ok) return undefined
    const text = await res.text()
    const snippet = normalizeText(
      text
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .join(' ')
    )
    return snippet
  } catch {
    return undefined
  }
}

function hostnameOf(u: string): string | undefined {
  try {
    return new URL(u).hostname
  } catch {
    return undefined
  }
}

async function main() {
  const sourcesPath = resolve(__dirname, '..', 'external', 'tech-links', 'sources.txt')
  const outDir = resolve(__dirname, '..', 'public', 'data', 'links')
  await mkdir(outDir, { recursive: true })

  let content = ''
  try {
    content = await readFile(sourcesPath, 'utf8')
  } catch {
    console.error(`Missing sources list at ${sourcesPath}. Create it with one URL per line.`)
    // Preserve existing latest.json if present to avoid wiping data on CI runs
    try {
      const existing = await readFile(resolve(outDir, 'latest.json'), 'utf8')
      await writeFile(resolve(outDir, 'latest.json'), existing, 'utf8')
    } catch {
      await writeFile(resolve(outDir, 'latest.json'), '[]', 'utf8')
    }
    return
  }
  const urls = content
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('#'))
    .slice(0, 20)

  const items: LinkItem[] = []
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
      if (!res.ok) throw new Error(String(res.status))
      const html = await res.text()
      const title = extractTitle(html) ?? normalizeText(url) ?? url
      let summary = extractMetaDescription(html)
      if (!summary) {
        summary = await fetchFallbackSnippet(url)
      }
      if (!summary) {
        summary = normalizeText(title)
      }
      items.push({ title, url, summary, publishedAt: new Date().toISOString(), source: hostnameOf(url) })
    } catch (e) {
      items.push({ title: url, url })
      console.warn('Failed to fetch:', url, e)
    }
  }

  await writeFile(resolve(outDir, 'latest.json'), JSON.stringify(items, null, 2), 'utf8')
  console.log(`Wrote ${items.length} items to latest.json`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


