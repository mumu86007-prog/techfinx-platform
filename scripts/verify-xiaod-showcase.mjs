import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const pagePath = resolve(root, 'src/pages/Xiaod.tsx')
const routerPath = resolve(root, 'src/router.tsx')
const page = readFileSync(pagePath, 'utf8')
const router = readFileSync(routerPath, 'utf8')

for (const phrase of [
  '小D｜音视频转录整理助手',
  '展示页 · 只读 · 不接 API · 不处理上传内容',
  '无法处理',
  '本页为能力说明，不提供任务执行或数据访问。',
]) {
  if (!page.includes(phrase)) throw new Error(`Missing required phrase: ${phrase}`)
}

for (const forbidden of ['<form', '<input', 'fetch(', 'WebSocket', 'APP_SECRET', 'API_KEY']) {
  if (page.includes(forbidden)) throw new Error(`Forbidden content: ${forbidden}`)
}

if (!router.includes("path: '/xiaod'")) throw new Error('Missing /xiaod route')

console.log('xiaod_showcase_verification_ok')
