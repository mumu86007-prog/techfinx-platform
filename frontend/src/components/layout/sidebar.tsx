'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers';
import { cn } from '@/lib/utils';
import {
  HomeIcon,
  DocumentTextIcon,
  FolderIcon,
  UsersIcon,
  CogIcon,
  ChartBarIcon,
  XMarkIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navigation = [
  { name: '仪表板', href: '/dashboard', icon: HomeIcon },
  { name: '文章管理', href: '/articles', icon: DocumentTextIcon },
  { name: '分类管理', href: '/categories', icon: FolderIcon },
  { name: '用户管理', href: '/users', icon: UsersIcon },
  { name: '内容抓取', href: '/scraper', icon: ChartBarIcon },
  { name: '系统设置', href: '/settings', icon: CogIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const pathname = usePathname();
  const { user, hasPermission } = useAuth();

  // 过滤导航项基于权限
  const filteredNavigation = navigation.filter(item => {
    const permissions: Record<string, string> = {
      '/dashboard': 'read',
      '/articles': 'read',
      '/categories': 'read',
      '/users': 'manage_users',
      '/scraper': 'manage_settings',
      '/settings': 'manage_settings',
    };
    
    const requiredPermission = permissions[item.href];
    return !requiredPermission || hasPermission(requiredPermission);
  });

  return (
    <>
      {/* 移动端遮罩 */}
      {open && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75" />
        </div>
      )}

      {/* 侧边栏 */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* 侧边栏头部 */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <span className="text-lg font-bold text-white">T</span>
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900">
                TechfinX CMS
              </span>
            </div>
            
            {/* 移动端关闭按钮 */}
            <button
              type="button"
              className="lg:hidden rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* 用户信息 */}
          <div className="px-4 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <img
                className="h-10 w-10 rounded-full"
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=3b82f6&color=ffffff&size=128`}
                alt={user?.username}
              />
              <div className="ml-3">
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
            </div>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                  onClick={onClose}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {item.name}
                  {isActive && (
                    <ChevronRightIcon className="ml-auto h-4 w-4 text-primary-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 侧边栏底部 */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p>TechfinX CMS v1.0.0</p>
              <p>© 2024 TechfinX. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
