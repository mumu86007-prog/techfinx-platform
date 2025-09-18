'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export const SystemStatus: React.FC = () => {
  // 模拟系统状态数据
  const systemStatus = {
    overall: 'healthy' as 'healthy' | 'warning' | 'error',
    services: [
      {
        name: '数据库',
        status: 'healthy' as 'healthy' | 'warning' | 'error',
        uptime: '99.9%',
        lastCheck: '2分钟前',
      },
      {
        name: 'Redis缓存',
        status: 'healthy' as 'healthy' | 'warning' | 'error',
        uptime: '99.8%',
        lastCheck: '1分钟前',
      },
      {
        name: '内容抓取',
        status: 'warning' as 'healthy' | 'warning' | 'error',
        uptime: '95.2%',
        lastCheck: '5分钟前',
      },
      {
        name: '文件存储',
        status: 'healthy' as 'healthy' | 'warning' | 'error',
        uptime: '99.5%',
        lastCheck: '3分钟前',
      },
    ],
    metrics: {
      responseTime: '120ms',
      memoryUsage: '68%',
      cpuUsage: '45%',
      diskUsage: '72%',
    },
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy':
        return '正常';
      case 'warning':
        return '警告';
      case 'error':
        return '错误';
      default:
        return '未知';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>系统状态</CardTitle>
          <Badge className={getStatusColor(systemStatus.overall)}>
            {getStatusText(systemStatus.overall)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 服务状态 */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">服务状态</h4>
            <div className="space-y-2">
              {systemStatus.services.map((service, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(service.status)}
                    <span className="text-sm text-gray-900">{service.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">{service.uptime}</p>
                    <p className="text-xs text-gray-500">{service.lastCheck}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 系统指标 */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">系统指标</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{systemStatus.metrics.responseTime}</p>
                <p className="text-xs text-gray-500">响应时间</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{systemStatus.metrics.memoryUsage}</p>
                <p className="text-xs text-gray-500">内存使用</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{systemStatus.metrics.cpuUsage}</p>
                <p className="text-xs text-gray-500">CPU使用</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{systemStatus.metrics.diskUsage}</p>
                <p className="text-xs text-gray-500">磁盘使用</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
