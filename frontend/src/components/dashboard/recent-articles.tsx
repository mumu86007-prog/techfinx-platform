'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  EyeIcon, 
  HeartIcon, 
  ShareIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { formatDate } from '@/lib/utils';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  status: 'published' | 'draft' | 'archived';
  author: string;
  publishTime: string;
  stats: {
    views: number;
    likes: number;
    shares: number;
  };
}

export const RecentArticles: React.FC = () => {
  // 模拟数据，实际应该从API获取
  const articles: Article[] = [
    {
      id: '1',
      title: '人工智能在金融科技中的应用与挑战',
      excerpt: '随着人工智能技术的快速发展，金融科技行业正在经历前所未有的变革。本文将深入探讨AI在金融领域的应用场景...',
      category: 'tech',
      status: 'published',
      author: '张三',
      publishTime: '2024-01-15T10:30:00Z',
      stats: { views: 1234, likes: 56, shares: 23 },
    },
    {
      id: '2',
      title: '区块链技术的最新发展趋势',
      excerpt: '区块链技术作为数字经济的重要基础设施，正在不断演进和发展。本文分析了当前区块链技术的主要发展方向...',
      category: 'finance',
      status: 'published',
      author: '李四',
      publishTime: '2024-01-14T15:20:00Z',
      stats: { views: 987, likes: 43, shares: 18 },
    },
    {
      id: '3',
      title: '机器学习算法优化策略研究',
      excerpt: '机器学习算法的性能优化是提高模型效果的关键。本文介绍了几种常用的优化策略和最佳实践...',
      category: 'research',
      status: 'draft',
      author: '王五',
      publishTime: '2024-01-13T09:15:00Z',
      stats: { views: 0, likes: 0, shares: 0 },
    },
    {
      id: '4',
      title: '金融科技监管政策解读',
      excerpt: '随着金融科技的发展，相关监管政策也在不断完善。本文对最新的监管政策进行详细解读...',
      category: 'policy',
      status: 'published',
      author: '赵六',
      publishTime: '2024-01-12T14:45:00Z',
      stats: { views: 756, likes: 32, shares: 15 },
    },
    {
      id: '5',
      title: '数字化转型对企业的影响分析',
      excerpt: '数字化转型已成为企业发展的必然趋势。本文分析了数字化转型对企业运营、管理等方面的影响...',
      category: 'industry',
      status: 'published',
      author: '孙七',
      publishTime: '2024-01-11T11:30:00Z',
      stats: { views: 654, likes: 28, shares: 12 },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return '已发布';
      case 'draft':
        return '草稿';
      case 'archived':
        return '已归档';
      default:
        return '未知';
    }
  };

  const getCategoryText = (category: string) => {
    const categoryMap: Record<string, string> = {
      tech: '科技',
      finance: '金融',
      policy: '政策',
      research: '研究',
      industry: '行业',
    };
    return categoryMap[category] || category;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>最近文章</CardTitle>
          <Link href="/articles">
            <Button variant="outline" size="sm">
              查看全部
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {articles.map((article) => (
            <div
              key={article.id}
              className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {article.title}
                  </h3>
                  <Badge className={getStatusColor(article.status)}>
                    {getStatusText(article.status)}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{getCategoryText(article.category)}</span>
                    <span>•</span>
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>{formatDate(article.publishTime, 'relative')}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {article.status === 'published' && (
                      <>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <EyeIcon className="h-4 w-4" />
                          <span className="text-xs">{article.stats.views}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <HeartIcon className="h-4 w-4" />
                          <span className="text-xs">{article.stats.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <ShareIcon className="h-4 w-4" />
                          <span className="text-xs">{article.stats.shares}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <Link href={`/articles/${article.id}/edit`}>
                  <Button variant="ghost" size="sm">
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
