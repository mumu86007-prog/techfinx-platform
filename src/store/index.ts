import { configureStore } from '@reduxjs/toolkit'
import accountsReducer from './slices/accountsSlice'
import searchReducer from './slices/searchSlice'
import uiReducer from './slices/uiSlice'
import hotReducer from './slices/hotSlice'

export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    search: searchReducer,
    ui: uiReducer,
    hot: hotReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
