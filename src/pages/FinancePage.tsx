import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { RootState } from '../store'
import { fetchAccounts, setSelectedCategory } from '../store/slices/accountsSlice'
import AccountCard from '../components/business/AccountCard'
import CategoryTabs from '../components/business/CategoryTabs'

const FinancePage = () => {
  const dispatch = useDispatch()
  const { filteredAccounts, loading } = useSelector((state: RootState) => state.accounts)

  useEffect(() => {
    dispatch(setSelectedCategory('金融'))
    dispatch(fetchAccounts())
  }, [dispatch])

  const financeAccounts = filteredAccounts.filter(account => 
    account.category.includes('金融') || 
    account.category.includes('投资') || 
    account.category.includes('银行') ||
    account.category.includes('货币')
  )

  return (
    <>
      <Helmet>
        <title>金融账号 - TechFinX</title>
        <meta name="description" content="发现优质金融领域账号，包括投资分析、银行金融、加密货币等专业账号" />
      </Helmet>

      <div className="container-custom py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-4">金融账号</h1>
          <p className="text-text-secondary text-lg">
            发现金融领域的优质账号，获取专业投资分析和市场洞察
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
            {financeAccounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && financeAccounts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-text-secondary text-lg mb-4">暂无金融账号</div>
            <p className="text-text-secondary">请尝试其他分类或搜索关键词</p>
          </div>
        )}
      </div>
    </>
  )
}

export default FinancePage
