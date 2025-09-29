import { NavLink, Outlet } from 'react-router-dom'

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/accounts', label: '账号库' },
  { to: '/hot', label: '热点追踪' },
  { to: '/deep-dive', label: '深度专栏' },
  { to: '/resources', label: '工具与资源' },
  { to: '/about', label: '关于 / 联系' },
]

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="container-custom flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
              T
            </div>
            <span className="text-xl font-bold">TechFinX</span>
          </NavLink>

          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="container-custom py-10">
          <Outlet />
        </div>
      </main>

      <footer className="bg-surface border-t border-border mt-16">
        <div className="container-custom py-12 text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
              T
            </div>
            <span className="text-xl font-bold text-text-primary">TechFinX</span>
          </div>
          <div className="text-sm text-text-secondary space-y-1">
            <p>金融科技行业前沿观察与深度分析</p>
            <p>
              联系邮箱：
              <a className="text-primary hover:underline" href="mailto:Mumu86007@gmail.com">
                Mumu86007@gmail.com
              </a>
            </p>
            <p>© {new Date().getFullYear()} TechFinX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout



