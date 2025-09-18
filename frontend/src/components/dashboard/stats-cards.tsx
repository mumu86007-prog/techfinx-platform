'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DocumentTextIcon, 
  FolderIcon, 
  UsersIcon, 
  EyeIcon,
  HeartIcon,
  ShareIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={cn('h-8 w-8 rounded-md flex items-center justify-center', color)}>
              <Icon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
              {change && (
                <div className={cn(
                  'ml-2 flex items-baseline text-sm font-medium',
                  change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                )}>
                  {change.type === 'increase' ? (
                    <ArrowUpIcon className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span className="ml-1">{Math.abs(change.value)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const StatsCards: React.FC = () => {
  // 模拟数据，实际应该从API获取
  const stats = [
    {
      title: '总文章数',
      value: '1,234',
      change: { value: 12, type: 'increase' as const },
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
    },
    {
      title: '已发布',
      value: '1,089',
      change: { value: 8, type: 'increase' as const },
      icon: DocumentTextIcon,
      color: 'bg-green-500',
    },
    {
      title: '草稿',
      value: '145',
      change: { value: 3, type: 'decrease' as const },
      icon: DocumentTextIcon,
      color: 'bg-yellow-500',
    },
    {
      title: '分类数',
      value: '28',
      change: { value: 2, type: 'increase' as const },
      icon: FolderIcon,
      color: 'bg-purple-500',
    },
    {
      title: '用户数',
      value: '156',
      change: { value: 5, type: 'increase' as const },
      icon: UsersIcon,
      color: 'bg-indigo-500',
    },
    {
      title: '总浏览量',
      value: '45.6K',
      change: { value: 15, type: 'increase' as const },
      icon: EyeIcon,
      color: 'bg-pink-500',
    },
    {
      title: '总点赞数',
      value: '2.3K',
      change: { value: 7, type: 'increase' as const },
      icon: HeartIcon,
      color: 'bg-red-500',
    },
    {
      title: '总分享数',
      value: '892',
      change: { value: 4, type: 'increase' as const },
      icon: ShareIcon,
      color: 'bg-teal-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};
