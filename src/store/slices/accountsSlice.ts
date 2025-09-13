import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface Account {
  id: string
  username: string
  displayName: string
  avatar: string
  bio: string
  category: string
  tags: string[]
  followers: number
  tweets: number
  activity: number
  description: string
  verified: boolean
  location?: string
  website?: string
  joinedDate: string
}

interface AccountsState {
  accounts: Account[]
  filteredAccounts: Account[]
  categories: string[]
  loading: boolean
  error: string | null
  selectedCategory: string
  searchQuery: string
}

const initialState: AccountsState = {
  accounts: [],
  filteredAccounts: [],
  categories: ['全部', '投资分析', '银行金融', '加密货币', 'AI/机器学习', '区块链', '云计算', '创业投资'],
  loading: false,
  error: null,
  selectedCategory: '全部',
  searchQuery: '',
}

// 模拟API调用
export const fetchAccounts = createAsyncThunk(
  'accounts/fetchAccounts',
  async (category?: string) => {
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟数据
    const mockAccounts: Account[] = [
      {
        id: '1',
        username: 'JohnPowell',
        displayName: 'Jerome Powell',
        avatar: '',
        bio: '美联储主席',
        category: '宏观经济',
        tags: ['宏观经济', '货币政策', '金融监管'],
        followers: 2100000,
        tweets: 1200,
        activity: 98,
        description: '美联储主席，负责制定美国货币政策。在宏观经济分析、货币政策制定方面具有丰富经验，其言论对全球金融市场具有重要影响。',
        verified: true,
        location: 'Washington, DC',
        website: 'https://federalreserve.gov',
        joinedDate: '2018-02-05'
      },
      {
        id: '2',
        username: 'ElonMusk',
        displayName: 'Elon Musk',
        avatar: '',
        bio: '特斯拉CEO',
        category: '科技创业',
        tags: ['电动汽车', '太空探索', '人工智能'],
        followers: 150000000,
        tweets: 25000,
        activity: 95,
        description: '特斯拉和SpaceX的CEO，在电动汽车、太空探索、人工智能等领域具有前瞻性视野。其推文经常引发市场波动，是科技和金融界的重要意见领袖。',
        verified: true,
        location: 'Austin, Texas',
        website: 'https://tesla.com',
        joinedDate: '2009-06-02'
      },
      {
        id: '3',
        username: 'WarrenBuffett',
        displayName: 'Warren Buffett',
        avatar: '',
        bio: '伯克希尔·哈撒韦CEO',
        category: '价值投资',
        tags: ['价值投资', '股票分析', '投资哲学'],
        followers: 1800000,
        tweets: 850,
        activity: 85,
        description: '传奇投资大师，伯克希尔·哈撒韦公司CEO。以价值投资理念闻名，其投资哲学和年度致股东信被全球投资者奉为经典，是金融投资领域的权威人物。',
        verified: true,
        location: 'Omaha, Nebraska',
        website: 'https://berkshirehathaway.com',
        joinedDate: '2009-05-02'
      },
      {
        id: '4',
        username: 'SamAltman',
        displayName: 'Sam Altman',
        avatar: '',
        bio: 'OpenAI CEO',
        category: '人工智能',
        tags: ['人工智能', '机器学习', '创业投资'],
        followers: 1500000,
        tweets: 3200,
        activity: 92,
        description: 'OpenAI CEO，在人工智能领域具有深厚造诣。领导开发了ChatGPT等革命性AI产品，是AI技术发展和应用的重要推动者，其观点对AI行业具有重要影响。',
        verified: true,
        location: 'San Francisco, CA',
        website: 'https://openai.com',
        joinedDate: '2018-03-15'
      }
    ]
    
    return mockAccounts
  }
)

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload
      state.filteredAccounts = state.accounts.filter(account => 
        action.payload === '全部' || account.category === action.payload
      )
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      const filtered = state.accounts.filter(account => 
        account.username.toLowerCase().includes(action.payload.toLowerCase()) ||
        account.displayName.toLowerCase().includes(action.payload.toLowerCase()) ||
        account.tags.some(tag => tag.toLowerCase().includes(action.payload.toLowerCase()))
      )
      state.filteredAccounts = filtered
    },
    clearFilters: (state) => {
      state.selectedCategory = '全部'
      state.searchQuery = ''
      state.filteredAccounts = state.accounts
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false
        state.accounts = action.payload
        state.filteredAccounts = action.payload
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch accounts'
      })
  }
})

export const { setSelectedCategory, setSearchQuery, clearFilters } = accountsSlice.actions
export default accountsSlice.reducer
