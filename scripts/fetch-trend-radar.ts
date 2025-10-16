/* eslint-disable no-console */
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

type TrendSignal = {
  id: string
  title: string
  summary: string
  platform: string
  rank: number
  appearances: number
  firstSeen: string
  lastSeen: string
  callToAction?: { label: string; to: string }
}

type TrendGroup = {
  id: string
  title: string
  heatLevel: 'hot' | 'warm' | 'rising' | 'steady'
  signalCount: number
  momentum: number
  insights: TrendSignal[]
}

type TrendRadarPayload = {
  generatedAt: string
  summary: {
    headline: string
    totalSignals: number
    highPriority: number
    momentum: 'fast-rising' | 'stable' | 'cooling'
  }
  groups: TrendGroup[]
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, '..')
const PUBLIC_DIR = path.join(ROOT_DIR, 'public')
const OUTPUT_DIR = path.join(PUBLIC_DIR, 'data', 'trend-radar')

// 默认的金融科技趋势数据
const DEFAULT_TREND_DATA = {
  aiFinance: [
    { title: 'AI驱动的风控模型大规模应用', appearances: 12, platform: '金融科技动态' },
    { title: '大模型在支付风险识别中的突破', appearances: 9, platform: '金融科技动态' },
    { title: '生成式AI重塑客户服务流程', appearances: 8, platform: '金融科技动态' },
    { title: 'OpenAI发布金融行业应用方案', appearances: 7, platform: '行业新闻' },
  ],
  paymentTech: [
    { title: '跨境支付结算新规发布', appearances: 11, platform: '政策导向' },
    { title: '央行数字人民币试点扩大范围', appearances: 10, platform: '政策导向' },
    { title: '即时支付系统处理量创新高', appearances: 8, platform: '行业数据' },
    { title: '第三方支付机构合规整改加速', appearances: 6, platform: '政策导向' },
  ],
  blockchainWeb3: [
    { title: '稳定币监管框架完善', appearances: 9, platform: '政策导向' },
    { title: '区块链在供应链金融应用深化', appearances: 7, platform: '行业应用' },
    { title: 'Web3钱包安全标准发布', appearances: 6, platform: '技术标准' },
    { title: '数字资产托管服务规范出台', appearances: 5, platform: '政策导向' },
  ],
  regulations: [
    { title: '个人信息保护法实施细则更新', appearances: 13, platform: '法规动态' },
    { title: '金融数据安全管理办法征求意见', appearances: 11, platform: '法规动态' },
    { title: '反垄断执法加强科技金融领域', appearances: 8, platform: '法规动态' },
    { title: '隐私计算合规指南发布', appearances: 6, platform: '法规动态' },
  ],
}

const buildTrendGroups = (): TrendGroup[] => {
  const now = new Date()
  const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

  const groups: TrendGroup[] = []

  // AI 与金融
  const aiSignals: TrendSignal[] = DEFAULT_TREND_DATA.aiFinance.map((item, idx) => ({
    id: `ai-${idx}`,
    title: item.title,
    summary: '最新的AI金融应用进展和市场动向。',
    platform: item.platform,
    rank: idx + 1,
    appearances: item.appearances,
    firstSeen: timeStr,
    lastSeen: timeStr,
    callToAction: { label: '查看详情', to: '/hot' },
  }))

  groups.push({
    id: 'group-1',
    title: 'AI 与金融',
    heatLevel: 'hot',
    signalCount: aiSignals.length,
    momentum: 0.85,
    insights: aiSignals.slice(0, 6),
  })

  // 支付技术
  const paymentSignals: TrendSignal[] = DEFAULT_TREND_DATA.paymentTech.map((item, idx) => ({
    id: `payment-${idx}`,
    title: item.title,
    summary: '支付结算技术与监管动向。',
    platform: item.platform,
    rank: idx + 1,
    appearances: item.appearances,
    firstSeen: timeStr,
    lastSeen: timeStr,
    callToAction: { label: '查看详情', to: '/hot' },
  }))

  groups.push({
    id: 'group-2',
    title: '支付技术与结算',
    heatLevel: 'hot',
    signalCount: paymentSignals.length,
    momentum: 0.78,
    insights: paymentSignals.slice(0, 6),
  })

  // 区块链与Web3
  const blockchainSignals: TrendSignal[] = DEFAULT_TREND_DATA.blockchainWeb3.map((item, idx) => ({
    id: `blockchain-${idx}`,
    title: item.title,
    summary: '区块链和Web3在金融中的应用进展。',
    platform: item.platform,
    rank: idx + 1,
    appearances: item.appearances,
    firstSeen: timeStr,
    lastSeen: timeStr,
    callToAction: { label: '查看详情', to: '/hot' },
  }))

  groups.push({
    id: 'group-3',
    title: '区块链 & Web3',
    heatLevel: 'warm',
    signalCount: blockchainSignals.length,
    momentum: 0.65,
    insights: blockchainSignals.slice(0, 6),
  })

  // 法规与合规
  const regulationSignals: TrendSignal[] = DEFAULT_TREND_DATA.regulations.map((item, idx) => ({
    id: `regulation-${idx}`,
    title: item.title,
    summary: '金融监管和合规政策更新。',
    platform: item.platform,
    rank: idx + 1,
    appearances: item.appearances,
    firstSeen: timeStr,
    lastSeen: timeStr,
    callToAction: { label: '查看详情', to: '/hot' },
  }))

  groups.push({
    id: 'group-4',
    title: '监管 & 合规',
    heatLevel: 'hot',
    signalCount: regulationSignals.length,
    momentum: 0.82,
    insights: regulationSignals.slice(0, 6),
  })

  return groups
}

const buildSummary = (groups: TrendGroup[]): TrendRadarPayload['summary'] => {
  const totalSignals = groups.reduce((sum, group) => sum + group.signalCount, 0)
  const highPriority = groups.filter((group) => group.heatLevel === 'hot').length
  const overallMomentum = groups.reduce((sum, group) => sum + group.momentum, 0) / groups.length

  let momentumLabel: TrendRadarPayload['summary']['momentum'] = 'stable'
  if (overallMomentum >= 0.75) momentumLabel = 'fast-rising'
  else if (overallMomentum <= 0.5) momentumLabel = 'cooling'

  return {
    headline: 'TechFinX 金融科技趋势雷达 - 每日更新',
    totalSignals,
    highPriority,
    momentum: momentumLabel,
  }
}

const main = async () => {
  console.log('正在生成 TrendRadar 数据...')

  const groups = buildTrendGroups()
  const payload: TrendRadarPayload = {
    generatedAt: new Date().toISOString(),
    summary: buildSummary(groups),
    groups,
  }

  await mkdir(OUTPUT_DIR, { recursive: true })
  const outputPath = path.join(OUTPUT_DIR, 'latest.json')
  await writeFile(outputPath, JSON.stringify(payload, null, 2), 'utf-8')

  console.log(`✅ 趋势雷达数据已生成 → ${path.relative(ROOT_DIR, outputPath)}`)
  console.log(`   生成时间: ${payload.generatedAt}`)
  console.log(`   总信号数: ${payload.summary.totalSignals}`)
  console.log(`   热度等级: ${payload.summary.momentum}`)
}

main().catch((error) => {
  console.error('❌ 趋势雷达数据生成失败', error)
  process.exitCode = 1
})


