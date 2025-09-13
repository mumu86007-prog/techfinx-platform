import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface HotItem {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  author: string
  authorAvatar: string
  publishTime: string
  views: number
  likes: number
  shares: number
  imageUrl?: string
  tweetScreenshots?: string[]
  analysis: string
}

interface HotState {
  items: HotItem[]
  loading: boolean
  error: string | null
  selectedCategory: string
  lastUpdated: string | null
}

const initialState: HotState = {
  items: [],
  loading: false,
  error: null,
  selectedCategory: '全部',
  lastUpdated: null
}

// 模拟获取热点数据
export const fetchHotItems = createAsyncThunk(
  'hot/fetchHotItems',
  async (category?: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockItems: HotItem[] = [
      {
        id: '1',
        title: '美联储维持利率不变，市场反应积极',
        content: '美联储宣布维持利率不变，市场反应积极。多位金融专家认为这是对经济复苏的积极信号，科技股普遍上涨。同时，AI技术在金融领域的应用再次成为讨论焦点...',
        category: '金融',
        tags: ['美联储', '利率', '市场', 'AI'],
        author: 'JohnPowell',
        authorAvatar: '',
        publishTime: '2024-12-13T10:30:00Z',
        views: 1200,
        likes: 89,
        shares: 23,
        imageUrl: '/images/fed-rate.jpg',
        tweetScreenshots: ['/images/tweet1.jpg', '/images/tweet2.jpg'],
        analysis: '从技术分析角度看，美联储维持利率不变的决定符合市场预期。这一决策表明央行对当前经济状况的谨慎乐观态度，为市场提供了稳定性。'
      },
      {
        id: '2',
        title: 'OpenAI发布GPT-5预览，AI能力再升级',
        content: 'OpenAI正式发布GPT-5预览版本，在推理能力、多模态理解和代码生成方面都有显著提升。新版本在金融分析、科研计算等专业领域表现出色...',
        category: '科技',
        tags: ['OpenAI', 'GPT-5', 'AI', '人工智能'],
        author: 'SamAltman',
        authorAvatar: '',
        publishTime: '2024-12-13T09:15:00Z',
        views: 2500,
        likes: 156,
        shares: 67,
        imageUrl: '/images/gpt5-preview.jpg',
        tweetScreenshots: ['/images/tweet3.jpg'],
        analysis: 'GPT-5的发布标志着AI技术进入新阶段。在金融领域的应用潜力巨大，特别是在量化分析、风险评估和投资决策支持方面。'
      }
    ]
    
    return mockItems
  }
)

const hotSlice = createSlice({
  name: 'hot',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload
    },
    updateViews: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload)
      if (item) {
        item.views += 1
      }
    },
    updateLikes: (state, action: PayloadAction<{ id: string; liked: boolean }>) => {
      const item = state.items.find(item => item.id === action.payload.id)
      if (item) {
        item.likes += action.payload.liked ? 1 : -1
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotItems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchHotItems.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(fetchHotItems.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch hot items'
      })
  }
})

export const { setSelectedCategory, updateViews, updateLikes } = hotSlice.actions
export default hotSlice.reducer
