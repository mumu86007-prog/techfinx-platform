import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border mt-16">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-text-primary">TechFinX</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-md">
              TechFinX 是专业的金融科技账号聚合平台，帮助用户发现优质账号，获取最新行业热点，提升信息获取效率。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">快速导航</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/finance" className="text-text-secondary hover:text-primary transition-colors duration-200 text-sm">
                  金融账号
                </Link>
              </li>
              <li>
                <Link to="/tech" className="text-text-secondary hover:text-primary transition-colors duration-200 text-sm">
                  科技账号
                </Link>
              </li>
              <li>
                <Link to="/hot" className="text-text-secondary hover:text-primary transition-colors duration-200 text-sm">
                  每日热点
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-text-secondary hover:text-primary transition-colors duration-200 text-sm">
                  关于我们
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">联系我们</h3>
            <ul className="space-y-2">
              <li className="text-text-secondary text-sm">
                邮箱: contact@techfinx.com
              </li>
              <li className="text-text-secondary text-sm">
                微信: TechFinX_Official
              </li>
              <li className="text-text-secondary text-sm">
                微博: @TechFinX
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-text-secondary text-sm">
            © 2024 TechFinX. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-text-secondary hover:text-primary transition-colors duration-200 text-sm">
              隐私政策
            </Link>
            <Link to="/terms" className="text-text-secondary hover:text-primary transition-colors duration-200 text-sm">
              服务条款
            </Link>
            <Link to="/disclaimer" className="text-text-secondary hover:text-primary transition-colors duration-200 text-sm">
              免责声明
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
