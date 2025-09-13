import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SearchState {
  query: string
  results: any[]
  loading: boolean
  error: string | null
  filters: {
    category: string
    sortBy: 'relevance' | 'followers' | 'activity' | 'tweets'
    verified: boolean | null
  }
}

const initialState: SearchState = {
  query: '',
  results: [],
  loading: false,
  error: null,
  filters: {
    category: '全部',
    sortBy: 'relevance',
    verified: null
  }
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload
    },
    setResults: (state, action: PayloadAction<any[]>) => {
      state.results = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<SearchState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearSearch: (state) => {
      state.query = ''
      state.results = []
      state.loading = false
      state.error = null
    }
  }
})

export const { 
  setQuery, 
  setResults, 
  setLoading, 
  setError, 
  setFilters, 
  clearSearch 
} = searchSlice.actions

export default searchSlice.reducer
