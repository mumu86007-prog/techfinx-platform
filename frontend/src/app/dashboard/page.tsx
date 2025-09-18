'use client';

import React from 'react';
import { useAuth } from '@/components/providers';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">未授权访问</h1>
          <p className="text-gray-600">请先登录以访问仪表板</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* 顶部导航 */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg font-bold text-white">T</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">TechfinX CMS</h1>
                <p className="text-xs text-gray-500">内容管理系统</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-xl border border-blue-200/50">
                <img
                  className="h-10 w-10 rounded-full shadow-md"
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=3b82f6&color=ffffff&size=128`}
                  alt={user.username}
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {user.profile.firstName && user.profile.lastName
                      ? `${user.profile.firstName} ${user.profile.lastName}`
                      : user.username}
                  </p>
                  <p className="text-xs text-gray-600">
                    {user.role === 'admin' ? '系统管理员' : 
                     user.role === 'editor' ? '编辑者' : 
                     user.role === 'author' ? '作者' : '访客'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 侧边栏 */}
      <div className="flex">
        <div className="w-64 bg-white/80 backdrop-blur-sm shadow-xl border-r border-gray-200/50 min-h-screen">
          <div className="p-6">
            {/* 用户信息 */}
            <div className="flex items-center space-x-3 mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/50">
              <img
                className="h-12 w-12 rounded-full shadow-md"
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=3b82f6&color=ffffff&size=128`}
                alt={user.username}
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {user.profile.firstName && user.profile.lastName
                    ? `${user.profile.firstName} ${user.profile.lastName}`
                    : user.username}
                </p>
                <p className="text-xs text-gray-600">
                  {user.role === 'admin' ? '系统管理员' : 
                   user.role === 'editor' ? '编辑者' : 
                   user.role === 'author' ? '作者' : '访客'}
                </p>
              </div>
            </div>
            
            {/* 导航菜单 */}
            <nav className="space-y-2">
              <a href="/dashboard" className="flex items-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                <span className="mr-3 text-lg">📊</span>
                仪表板
              </a>
              <a href="/articles" className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 rounded-xl transition-all duration-300">
                <span className="mr-3 text-lg">📄</span>
                文章管理
              </a>
              <a href="/categories" className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 rounded-xl transition-all duration-300">
                <span className="mr-3 text-lg">📁</span>
                分类管理
              </a>
              <a href="/users" className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 rounded-xl transition-all duration-300">
                <span className="mr-3 text-lg">👥</span>
                用户管理
              </a>
              <a href="/settings" className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 rounded-xl transition-all duration-300">
                <span className="mr-3 text-lg">⚙️</span>
                系统设置
              </a>
            </nav>
          </div>
        </div>

        {/* 主内容区域 */}
        <main className="flex-1 p-8 pb-12">
          <div className="space-y-8 max-w-7xl mx-auto">
            {/* 欢迎信息 */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
              <h1 className="text-4xl font-bold mb-3">
                欢迎回来，{user.profile.firstName || user.username}！ 👋
              </h1>
              <p className="text-xl text-blue-100 mb-4">
                这是您的 TechfinX CMS 仪表板，您可以在这里管理内容、用户和系统设置。
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                  <span className="text-sm">🚀 系统运行正常</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                  <span className="text-sm">⚡ 性能优化中</span>
                </div>
              </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">总文章数</p>
                    <p className="text-4xl font-bold mb-2">1,234</p>
                    <div className="flex items-center">
                      <span className="text-sm text-blue-100">+12% 较上月</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">📄</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium mb-1">已发布</p>
                    <p className="text-4xl font-bold mb-2">1,089</p>
                    <div className="flex items-center">
                      <span className="text-sm text-green-100">+8% 较上月</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">✅</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium mb-1">草稿</p>
                    <p className="text-4xl font-bold mb-2">145</p>
                    <div className="flex items-center">
                      <span className="text-sm text-yellow-100">-3% 较上月</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">📝</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium mb-1">用户数</p>
                    <p className="text-4xl font-bold mb-2">456</p>
                    <div className="flex items-center">
                      <span className="text-sm text-purple-100">+5% 较上月</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">👥</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 最近文章 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50">
              <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-2xl border-b border-gray-200/50 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <span className="mr-3 text-2xl">📄</span>
                  最近文章
                </h2>
                <a href="/articles" className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline">查看全部 →</a>
              </div>
              <div className="p-8">
                <div className="space-y-4">
                  <div className="group flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border border-gray-200/50 hover:border-blue-300/50 hover:shadow-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">人工智能在金融科技中的应用与挑战</h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">技术动态</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">探索AI技术在金融领域的创新应用，分析当前面临的挑战和未来发展趋势...</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          张三
                        </span>
                        <span>2小时前</span>
                        <span className="flex items-center">
                          <span className="mr-1">👁️</span>
                          1,234 浏览
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        已发布
                      </span>
                    </div>
                  </div>
                  
                  <div className="group flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl hover:from-green-50 hover:to-blue-50 transition-all duration-300 border border-gray-200/50 hover:border-green-300/50 hover:shadow-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors">区块链技术的最新发展趋势</h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">技术动态</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">深入分析区块链技术在各个行业的最新应用案例，探讨技术发展的新方向...</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          李四
                        </span>
                        <span>4小时前</span>
                        <span className="flex items-center">
                          <span className="mr-1">👁️</span>
                          0 浏览
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        草稿
                      </span>
                    </div>
                  </div>
                  
                  <div className="group flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl hover:from-purple-50 hover:to-pink-50 transition-all duration-300 border border-gray-200/50 hover:border-purple-300/50 hover:shadow-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">机器学习算法优化策略研究</h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">研究</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">介绍最新的机器学习算法优化方法，包括模型压缩、加速训练等技术...</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                          王五
                        </span>
                        <span>6小时前</span>
                        <span className="flex items-center">
                          <span className="mr-1">👁️</span>
                          0 浏览
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        草稿
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* 页脚 */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">© 2024 TechfinX CMS</span>
                <p className="text-xs text-gray-500">保留所有权利</p>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <span className="text-sm text-gray-500">版本 1.0.0</span>
              <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">帮助文档</a>
              <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">技术支持</a>
              <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">隐私政策</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}