import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>页面未找到 - TechFinX</title>
        <meta name="description" content="抱歉，您访问的页面不存在" />
      </Helmet>

      <div className="container-custom py-16">
        <div className="text-center">
          <div className="w-32 h-32 bg-background rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-6xl font-bold text-text-secondary">404</span>
          </div>
          
          <h1 className="text-4xl font-bold text-text-primary mb-4">页面未找到</h1>
          <p className="text-xl text-text-secondary mb-8 max-w-md mx-auto">
            抱歉，您访问的页面不存在或已被移除
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-primary">
              返回首页
            </Link>
            <Link to="/finance" className="btn-secondary">
              浏览金融账号
            </Link>
            <Link to="/tech" className="btn-secondary">
              浏览科技账号
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFoundPage
