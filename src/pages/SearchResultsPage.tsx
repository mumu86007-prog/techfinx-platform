import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { setQuery } from '../store/slices/searchSlice'
import AccountCard from '../components/business/AccountCard'

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const { accounts } = useSelector((state: RootState) => state.accounts)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredAccounts, setFilteredAccounts] = useState(accounts)

  useEffect(() => {
    const query = searchParams.get('q') || ''
    setSearchQuery(query)
    dispatch(setQuery(query))
    
    if (query) {
      const filtered = accounts.filter(account => 
        account.username.toLowerCase().includes(query.toLowerCase()) ||
        account.displayName.toLowerCase().includes(query.toLowerCase()) ||
        account.bio.toLowerCase().includes(query.toLowerCase()) ||
        account.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
      setFilteredAccounts(filtered)
    } else {
      setFilteredAccounts(accounts)
    }
  }, [searchParams, accounts, dispatch])

  return (
    <>
      <Helmet>
        <title>搜索结果 - TechFinX</title>
        <meta name="description" content={`搜索"${searchQuery}"的结果`} />
      </Helmet>

      <div className="container-custom py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            搜索结果
            {searchQuery && (
              <span className="text-text-secondary font-normal">
                : "{searchQuery}"
              </span>
            )}
          </h1>
          <p className="text-text-secondary text-lg">
            {filteredAccounts.length} 个相关账号
          </p>
        </div>

        {/* Search Results */}
        {filteredAccounts.length > 0 ? (
          <div className="grid-responsive">
            {filteredAccounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="text-text-secondary text-lg mb-4">
              {searchQuery ? '未找到相关账号' : '请输入搜索关键词'}
            </div>
            <p className="text-text-secondary">
              {searchQuery 
                ? '请尝试其他关键词或浏览所有账号' 
                : '在搜索框中输入账号名称、关键词或标签'
              }
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default SearchResultsPage
