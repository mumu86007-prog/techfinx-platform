import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">404</p>
        <h1 className="text-3xl font-semibold">页面正在搭建中</h1>
        <p className="text-text-secondary">
          我们正在逐日完善 TechFinX 站点，稍后回来看会有更多内容。
        </p>
      </div>

      <Link to="/" className="btn-primary px-6 py-3 text-sm rounded-m">
        返回首页
      </Link>
    </div>
  )
}

export default NotFound

