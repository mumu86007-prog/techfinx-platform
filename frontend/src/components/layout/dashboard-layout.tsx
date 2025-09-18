'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { Breadcrumb } from './breadcrumb';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 侧边栏 */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* 主内容区域 */}
      <div className="lg:pl-64">
        {/* 顶部导航 */}
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        {/* 面包屑导航 */}
        <Breadcrumb />
        
        {/* 页面内容 */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
