import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { setMobileMenuOpen } from '../../store/slices/uiSlice'
import SearchBox from './SearchBox'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const dispatch = useDispatch()
  const location = useLocation()
  const { mobileMenuOpen } = useSelector((state: RootState) => state.ui)

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0)
  }

  useState(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  })

  const navItems = [
    { path: '/', label: '首页' },
    { path: '/finance', label: '金融' },
    { path: '/tech', label: '科技' },
    { path: '/hot', label: '热点' },
    { path: '/about', label: '关于' },
  ]

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${
      isScrolled ? 'bg-surface/95 backdrop-blur-md shadow-medium' : 'bg-surface'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-text-primary">TechFinX</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search Box - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBox />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-background transition-colors duration-200"
            onClick={() => dispatch(setMobileMenuOpen(!mobileMenuOpen))}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <SearchBox />
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-base font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'text-primary'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
