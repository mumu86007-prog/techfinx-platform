'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import authManager from '@/lib/auth';
import { User } from '@/types';

// 认证上下文
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string | string[]) => boolean;
  isAdmin: boolean;
  isEditor: boolean;
  isAuthor: boolean;
  getDisplayName: () => string;
  getAvatar: () => string;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: any) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (userData: any) => Promise<{ success: boolean; message?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 认证提供者
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const listener = (user: User | null) => {
      setUser(user);
      setLoading(false);
    };

    authManager.addListener(listener);
    
    // 初始化时获取用户信息
    const initAuth = async () => {
      if (authManager.isAuthenticated()) {
        await authManager.getCurrentUser();
      } else {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      authManager.removeListener(listener);
    };
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: authManager.isAuthenticated(),
    hasPermission: authManager.hasPermission.bind(authManager),
    hasRole: authManager.hasRole.bind(authManager),
    isAdmin: authManager.isAdmin(),
    isEditor: authManager.isEditor(),
    isAuthor: authManager.isAuthor(),
    getDisplayName: authManager.getDisplayName,
    getAvatar: authManager.getAvatar,
    login: authManager.login.bind(authManager),
    register: authManager.register.bind(authManager),
    updateProfile: authManager.updateProfile.bind(authManager),
    changePassword: authManager.changePassword.bind(authManager),
    forgotPassword: authManager.forgotPassword.bind(authManager),
    resetPassword: authManager.resetPassword.bind(authManager),
    logout: authManager.logout.bind(authManager),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// React Query客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5分钟
    },
    mutations: {
      retry: 1,
    },
  },
});

// 主题提供者
const ThemeProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

// 主提供者组件
export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProviderWrapper>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProviderWrapper>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};
