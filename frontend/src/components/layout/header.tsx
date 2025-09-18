'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* 左侧 */}
          <div className="flex items-center">
            {/* 移动端菜单按钮 */}
            <button
              type="button"
              className="lg:hidden rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={onMenuClick}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* 搜索框 */}
            <div className="hidden sm:block ml-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="搜索文章、分类..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* 右侧 */}
          <div className="flex items-center space-x-4">
            {/* 通知按钮 */}
            <button
              type="button"
              className="relative rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <BellIcon className="h-6 w-6" />
              {/* 通知徽章 */}
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>

            {/* 用户菜单 */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-3 rounded-full p-2 text-sm hover:bg-gray-100"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <img
                  className="h-8 w-8 rounded-full"
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=3b82f6&color=ffffff&size=128`}
                  alt={user?.username}
                />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.profile.firstName && user?.profile.lastName
                      ? `${user.profile.firstName} ${user.profile.lastName}`
                      : user?.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.role === 'admin' ? '管理员' : 
                     user?.role === 'editor' ? '编辑者' : 
                     user?.role === 'author' ? '作者' : '访客'}
                  </p>
                </div>
              </button>

              {/* 下拉菜单 */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.profile.firstName && user?.profile.lastName
                        ? `${user.profile.firstName} ${user.profile.lastName}`
                        : user?.username}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  
                  <a
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <UserCircleIcon className="mr-3 h-5 w-5" />
                    个人资料
                  </a>
                  
                  <a
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Cog6ToothIcon className="mr-3 h-5 w-5" />
                    设置
                  </a>
                  
                  <div className="border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                      退出登录
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
