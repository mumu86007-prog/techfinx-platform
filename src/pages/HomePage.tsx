import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { Helmet } from 'react-helmet-async'
import { fetchAccounts } from '../store/slices/accountsSlice'
import AccountCard from '../components/business/AccountCard'
import CategoryTabs from '../components/business/CategoryTabs'
import FeaturedSection from '../components/business/FeaturedSection'

const HomePage = () => {
  const dispatch = useAppDispatch()
  const { filteredAccounts, loading, error } = useAppSelector((state) => state.accounts)

  useEffect(() => {
    dispatch(fetchAccounts())
  }, [dispatch])

  if (error) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="text-error text-lg mb-4">加载失败</div>
        <p className="text-text-secondary">{error}</p>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>TechFinX - 金融科技账号聚合站</title>
        <meta name="description" content="发现优质金融和科技领域账号，获取最新行业热点，提升信息获取效率" />
      </Helmet>

      <div className="container-custom py-8">
        {/* Featured Section */}
        <FeaturedSection />

        {/* Category Tabs */}
        <CategoryTabs />

        {/* Accounts Grid */}
        {loading ? (
          <div className="grid-responsive">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="card-base p-6">
                <div className="flex items-center mb-4">
                  <div className="skeleton w-12 h-12 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <div className="skeleton h-4 w-24 mb-2"></div>
                    <div className="skeleton h-3 w-32"></div>
                  </div>
                </div>
                <div className="skeleton h-4 w-full mb-2"></div>
                <div className="skeleton h-4 w-3/4 mb-4"></div>
                <div className="flex space-x-2 mb-4">
                  <div className="skeleton h-6 w-16 rounded"></div>
                  <div className="skeleton h-6 w-20 rounded"></div>
                </div>
                <div className="skeleton h-10 w-full rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid-responsive">
            {filteredAccounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredAccounts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-text-secondary text-lg mb-4">暂无账号</div>
            <p className="text-text-secondary">请尝试其他分类或搜索关键词</p>
          </div>
        )}
      </div>
    </>
  )
}

export default HomePage
