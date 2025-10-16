export type TrendRadarSignal = {
  id: string
  title: string
  platform: string
  rank: number
  appearances: number
  firstSeen: string
  lastSeen: string
  summary: string
  callToAction?: {
    label: string
    to: string
  }
}

export type TrendRadarGroup = {
  id: string
  title: string
  heatLevel: 'hot' | 'warm' | 'rising' | 'steady'
  signalCount: number
  momentum: number
  insights: TrendRadarSignal[]
}

export type TrendRadarSummary = {
  headline: string
  totalSignals: number
  highPriority: number
  momentum: 'fast-rising' | 'stable' | 'cooling'
}

export type TrendRadarPayload = {
  generatedAt: string
  summary: TrendRadarSummary
  groups: TrendRadarGroup[]
}

const fallbackData: TrendRadarPayload = {
  generatedAt: '2025-10-16T06:30:00.000Z',
  summary: {
    headline: '今日金融科技趋势雷达',
    totalSignals: 12,
    highPriority: 5,
    momentum: 'fast-rising',
  },
  groups: [
    {
      id: 'ai-banking',
      title: 'AI 驱动的金融业务',
      heatLevel: 'hot',
      signalCount: 4,
      momentum: 0.82,
      insights: [
        {
          id: 'ai-branch-automation',
          title: '银行网点引入 AI 助手缩短客户等待',
          platform: 'TechFinX 热点监控',
          rank: 3,
          appearances: 9,
          firstSeen: '06:05',
          lastSeen: '06:28',
          summary:
            '多家股份制银行上线生成式助手，定位于即时查询、营销脚本生成和风控提示。',
          callToAction: {
            label: '查看应用拆解',
            to: '/hot#ai-branch-automation',
          },
        },
        {
          id: 'investment-copilot',
          title: '财富顾问部署 AI Copilot 提升转化',
          platform: 'TechFinX 实验室',
          rank: 5,
          appearances: 7,
          firstSeen: '05:45',
          lastSeen: '06:22',
          summary:
            '重点机构反馈 AI 辅助投顾能够缩短资产配置建议生成时间，并附带可视化解释。',
          callToAction: {
            label: '阅读投顾案例',
            to: '/deep-dive#copilot',
          },
        },
      ],
    },
    {
      id: 'payments',
      title: '智能支付与风控',
      heatLevel: 'warm',
      signalCount: 3,
      momentum: 0.64,
      insights: [
        {
          id: 'ap2-protocol',
          title: 'AI 支付指令协议 AP2 试点扩围',
          platform: 'TechFinX 实验室',
          rank: 4,
          appearances: 6,
          firstSeen: '05:55',
          lastSeen: '06:20',
          summary:
            '更多银行测试基于 AI 授权的支付流程，强调可追溯与风险阈值控制。',
          callToAction: {
            label: '查看风控建议',
            to: '/resources#ap2',
          },
        },
      ],
    },
    {
      id: 'data-infra',
      title: '实时数据基础设施',
      heatLevel: 'rising',
      signalCount: 3,
      momentum: 0.71,
      insights: [
        {
          id: 'vector-db',
          title: '券商升级向量数据库，支撑多模态检索',
          platform: 'TechFinX 研究社',
          rank: 6,
          appearances: 5,
          firstSeen: '05:40',
          lastSeen: '06:18',
          summary:
            '多家券商启动向量数据库升级，缩短投研文档检索时间，配合内部大模型查询。',
          callToAction: {
            label: '了解部署要点',
            to: '/hot#vector-db',
          },
        },
      ],
    },
    {
      id: 'regtech',
      title: '合规科技与监测',
      heatLevel: 'steady',
      signalCount: 2,
      momentum: 0.48,
      insights: [
        {
          id: 'aml-automation',
          title: '反洗钱自动化例程上线',
          platform: 'TechFinX 日报',
          rank: 8,
          appearances: 3,
          firstSeen: '06:00',
          lastSeen: '06:26',
          summary:
            '合规团队将生成式 AI 与规则引擎结合，自动生成可审计的异常交易报告。',
          callToAction: {
            label: '进入合规专题',
            to: '/deep-dive#regtech',
          },
        },
      ],
    },
  ],
}

export const fetchTrendRadarData = async (): Promise<TrendRadarPayload> => {
  try {
    const response = await fetch(`/data/trend-radar/latest.json?ts=${Date.now()}`)
    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`)
    }
    const data = (await response.json()) as TrendRadarPayload
    if (!data?.groups?.length) {
      return fallbackData
    }
    return data
  } catch (error) {
    console.warn('获取趋势雷达数据失败，将回退到默认内容', error)
    return fallbackData
  }
}

export const getHeatLevelLabel = (level: TrendRadarGroup['heatLevel']): string => {
  switch (level) {
    case 'hot':
      return '高热度'
    case 'warm':
      return '热门观察'
    case 'rising':
      return '快速上升'
    case 'steady':
    default:
      return '稳健关注'
  }
}

export const formatTimeRange = (firstSeen: string, lastSeen: string) => {
  if (!firstSeen && !lastSeen) return '时间线待更新'
  if (firstSeen && !lastSeen) return `${firstSeen} 起`
  if (!firstSeen && lastSeen) return `${lastSeen} 前`
  return `${firstSeen} ~ ${lastSeen}`
}


