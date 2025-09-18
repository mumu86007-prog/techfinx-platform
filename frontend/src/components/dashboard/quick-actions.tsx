'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PlusIcon,
  DocumentTextIcon,
  FolderIcon,
  UserPlusIcon,
  CogIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export const QuickActions: React.FC = () => {
  const actions = [
    {
      title: '新建文章',
      description: '创建一篇新的文章',
      href: '/articles/new',
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
    },
    {
      title: '新建分类',
      description: '添加新的文章分类',
      href: '/categories/new',
      icon: FolderIcon,
      color: 'bg-green-500',
    },
    {
      title: '添加用户',
      description: '邀请新用户加入',
      href: '/users/new',
      icon: UserPlusIcon,
      color: 'bg-purple-500',
    },
    {
      title: '系统设置',
      description: '配置系统参数',
      href: '/settings',
      icon: CogIcon,
      color: 'bg-gray-500',
    },
    {
      title: '内容抓取',
      description: '管理自动抓取任务',
      href: '/scraper',
      icon: ChartBarIcon,
      color: 'bg-orange-500',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>快速操作</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <div className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className={`h-8 w-8 rounded-md flex items-center justify-center ${action.color}`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{action.title}</p>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
                <PlusIcon className="h-4 w-4 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
