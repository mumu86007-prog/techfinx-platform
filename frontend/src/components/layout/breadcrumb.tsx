'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

const pathMap: Record<string, string> = {
  '/dashboard': '仪表板',
  '/articles': '文章管理',
  '/articles/new': '新建文章',
  '/categories': '分类管理',
  '/categories/new': '新建分类',
  '/users': '用户管理',
  '/users/new': '新建用户',
  '/scraper': '内容抓取',
  '/settings': '系统设置',
  '/profile': '个人资料',
};

export const Breadcrumb: React.FC = () => {
  const pathname = usePathname();
  
  // 生成面包屑路径
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { name: '首页', href: '/dashboard', current: pathname === '/dashboard' }
    ];

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const isLast = index === paths.length - 1;
      
      breadcrumbs.push({
        name: pathMap[currentPath] || path.charAt(0).toUpperCase() + path.slice(1),
        href: currentPath,
        current: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="flex h-12 items-center">
        <ol className="flex items-center space-x-2">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.href} className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />
              )}
              
              {breadcrumb.current ? (
                <span className="text-sm font-medium text-gray-900">
                  {breadcrumb.name}
                </span>
              ) : (
                <Link
                  href={breadcrumb.href}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {breadcrumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};
