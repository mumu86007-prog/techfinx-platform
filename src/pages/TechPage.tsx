import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { RootState } from '../store'
import { fetchAccounts, setSelectedCategory } from '../store/slices/accountsSlice'
import AccountCard from '../components/business/AccountCard'
import CategoryTabs from '../components/business/CategoryTabs'

const TechPage = () => {
  const dispatch = useDispatch()
  const { filteredAccounts, loading } = useSelector((state: RootState) => state.accounts)

  useEffect(() => {
    dispatch(setSelectedCategory('科技'))
    dispatch(fetchAccounts())
  }, [dispatch])

  const techAccounts = filteredAccounts.filter(account => 
    account.category.includes('科技') || 
    account.category.includes('AI') || 
    account.category.includes('区块链') ||
    account.category.includes('云计算') ||
    account.category.includes('创业')
  )

  return (
    <>
      <Helmet>
        <title>科技账号 - TechFinX</title>
        <meta name="description" content="发现优质科技领域账号，包括AI、区块链、云计算、创业投资等专业账号" />
      </Helmet>

      <div className="container-custom py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-4">科技账号</h1>
          <p className="text-text-secondary text-lg">
            发现科技领域的优质账号，获取最新技术趋势和创新洞察
          </p>
        </div>

        {/* Category Tabs */}
        <CategoryTabs />

        {/* Accounts Grid */}
        {loading ? (
          <div className="grid-responsive">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="card-base p-6">
                <div className="skeleton h-20 w-full mb-4"></div>
                <div className="skeleton h-4 w-full mb-2"></div>
                <div className="skeleton h-4 w-3/4 mb-4"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid-responsive">
            {techAccounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && techAccounts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-text-secondary text-lg mb-4">暂无科技账号</div>
            <p className="text-text-secondary">请尝试其他分类或搜索关键词</p>
          </div>
        )}
      </div>
    </>
  )
}

export default TechPage
