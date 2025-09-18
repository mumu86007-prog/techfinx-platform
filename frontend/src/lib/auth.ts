import { User } from '@/types';
import { authApi } from './api';

// 认证状态管理
class AuthManager {
  private user: User | null = null;
  private token: string | null = null;
  private listeners: Array<(user: User | null) => void> = [];

  constructor() {
    // 从localStorage恢复token（仅在客户端）
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
      
      // 如果有token，尝试获取用户信息
      if (this.token) {
        this.getCurrentUser();
      }
    }
  }

  // 添加状态监听器
  addListener(listener: (user: User | null) => void) {
    this.listeners.push(listener);
  }

  // 移除状态监听器
  removeListener(listener: (user: User | null) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  // 通知所有监听器
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.user));
  }

  // 设置用户信息
  private setUser(user: User | null) {
    this.user = user;
    this.notifyListeners();
  }

  // 设置token
  private setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  // 登录
  async login(email: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      // 临时测试账号（开发环境）
      if (email === 'admin@techfinx.com' && password === 'admin123') {
        const testUser: User = {
          _id: '1',
          username: 'admin',
          email: 'admin@techfinx.com',
          role: 'admin',
          avatar: '',
          profile: {
            firstName: 'Admin',
            lastName: 'User',
            bio: '系统管理员',
            website: '',
            social: {}
          },
          isActive: true,
          isEmailVerified: true,
          lastLogin: new Date().toISOString(),
          loginCount: 1,
          preferences: {
            theme: 'light',
            language: 'zh-CN',
            notifications: {
              email: true,
              push: true
            }
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        this.setUser(testUser);
        this.setToken('test-token');
        return { success: true };
      }
      
      const response = await authApi.login({ email, password });
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        this.setUser(user);
        this.setToken(token);
        return { success: true };
      } else {
        return { success: false, message: response.message || '登录失败' };
      }
    } catch (error: any) {
      return { success: false, message: error.message || '登录失败' };
    }
  }

  // 注册
  async register(userData: any): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await authApi.register(userData);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        this.setUser(user);
        this.setToken(token);
        return { success: true };
      } else {
        return { success: false, message: response.message || '注册失败' };
      }
    } catch (error: any) {
      return { success: false, message: error.message || '注册失败' };
    }
  }

  // 获取当前用户信息
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await authApi.getCurrentUser();
      
      if (response.success && response.data) {
        const user = response.data.user;
        this.setUser(user);
        return user;
      } else {
        this.logout();
        return null;
      }
    } catch (error) {
      this.logout();
      return null;
    }
  }

  // 更新用户信息
  async updateProfile(userData: any): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await authApi.updateProfile(userData);
      
      if (response.success && response.data) {
        this.setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, message: response.message || '更新失败' };
      }
    } catch (error: any) {
      return { success: false, message: error.message || '更新失败' };
    }
  }

  // 修改密码
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await authApi.changePassword({
        currentPassword,
        newPassword,
        confirmPassword: newPassword
      });
      
      if (response.success) {
        return { success: true };
      } else {
        return { success: false, message: response.message || '密码修改失败' };
      }
    } catch (error: any) {
      return { success: false, message: error.message || '密码修改失败' };
    }
  }

  // 忘记密码
  async forgotPassword(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await authApi.forgotPassword({ email });
      
      if (response.success) {
        return { success: true };
      } else {
        return { success: false, message: response.message || '请求失败' };
      }
    } catch (error: any) {
      return { success: false, message: error.message || '请求失败' };
    }
  }

  // 重置密码
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await authApi.resetPassword({
        token,
        newPassword,
        confirmPassword: newPassword
      });
      
      if (response.success) {
        return { success: true };
      } else {
        return { success: false, message: response.message || '密码重置失败' };
      }
    } catch (error: any) {
      return { success: false, message: error.message || '密码重置失败' };
    }
  }

  // 登出
  async logout(): Promise<void> {
    try {
      await authApi.logout();
    } catch (error) {
      // 忽略登出API错误
    } finally {
      this.setUser(null);
      this.setToken(null);
    }
  }

  // 获取当前用户
  getCurrentUserSync(): User | null {
    return this.user;
  }

  // 检查是否已登录
  isAuthenticated(): boolean {
    return !!this.user && !!this.token;
  }

  // 检查用户权限
  hasPermission(permission: string): boolean {
    if (!this.user) return false;
    
    const rolePermissions: Record<string, string[]> = {
      admin: ['read', 'write', 'delete', 'manage_users', 'manage_settings'],
      editor: ['read', 'write', 'delete'],
      author: ['read', 'write'],
      viewer: ['read']
    };
    
    const permissions = rolePermissions[this.user.role] || [];
    return permissions.includes(permission);
  }

  // 检查用户角色
  hasRole(role: string | string[]): boolean {
    if (!this.user) return false;
    
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(this.user.role);
  }

  // 检查是否为管理员
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  // 检查是否为编辑者
  isEditor(): boolean {
    return this.hasRole(['admin', 'editor']);
  }

  // 检查是否为作者
  isAuthor(): boolean {
    return this.hasRole(['admin', 'editor', 'author']);
  }

  // 获取用户显示名称
  getDisplayName(): string {
    if (!this.user) return '';
    
    if (this.user.profile.firstName && this.user.profile.lastName) {
      return `${this.user.profile.firstName} ${this.user.profile.lastName}`;
    }
    
    return this.user.username;
  }

  // 获取用户头像
  getAvatar(): string {
    if (!this.user) return '';
    
    if (this.user.avatar) {
      return this.user.avatar;
    }
    
    // 生成默认头像
    const initials = this.getDisplayName()
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    return `https://ui-avatars.com/api/?name=${initials}&background=3b82f6&color=ffffff&size=128`;
  }
}

// 创建全局认证管理器实例
const authManager = new AuthManager();

// 导出认证管理器
export default authManager;

// 导出认证Hook
export const useAuth = () => {
  const [user, setUser] = React.useState<User | null>(authManager.getCurrentUserSync());
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const listener = (user: User | null) => {
      setUser(user);
    };

    authManager.addListener(listener);
    
    // 如果用户未加载，尝试获取
    if (!user && authManager.isAuthenticated()) {
      setLoading(true);
      authManager.getCurrentUser().finally(() => {
        setLoading(false);
      });
    }

    return () => {
      authManager.removeListener(listener);
    };
  }, [user]);

  return {
    user,
    loading,
    isAuthenticated: authManager.isAuthenticated(),
    hasPermission: authManager.hasPermission.bind(authManager),
    hasRole: authManager.hasRole.bind(authManager),
    isAdmin: authManager.isAdmin(),
    isEditor: authManager.isEditor(),
    isAuthor: authManager.isAuthor(),
    getDisplayName: authManager.getDisplayName(),
    getAvatar: authManager.getAvatar(),
    login: authManager.login.bind(authManager),
    register: authManager.register.bind(authManager),
    updateProfile: authManager.updateProfile.bind(authManager),
    changePassword: authManager.changePassword.bind(authManager),
    forgotPassword: authManager.forgotPassword.bind(authManager),
    resetPassword: authManager.resetPassword.bind(authManager),
    logout: authManager.logout.bind(authManager),
  };
};

// 导出认证工具函数
export const authUtils = {
  // 检查路由权限
  checkRoutePermission: (route: string, user: User | null): boolean => {
    if (!user) return false;
    
    const routePermissions: Record<string, string[]> = {
      '/admin': ['manage_settings'],
      '/admin/users': ['manage_users'],
      '/admin/settings': ['manage_settings'],
      '/admin/scraper': ['manage_settings'],
      '/articles': ['read'],
      '/articles/new': ['write'],
      '/articles/edit': ['write'],
      '/categories': ['read'],
      '/categories/new': ['write'],
      '/categories/edit': ['write'],
    };
    
    const requiredPermissions = routePermissions[route] || [];
    return requiredPermissions.some(permission => 
      authManager.hasPermission(permission)
    );
  },
  
  // 获取用户菜单
  getUserMenu: (user: User | null) => {
    if (!user) return [];
    
    const menuItems = [
      { path: '/dashboard', name: '仪表板', icon: 'dashboard', permission: 'read' },
      { path: '/articles', name: '文章管理', icon: 'article', permission: 'read' },
      { path: '/categories', name: '分类管理', icon: 'category', permission: 'read' },
    ];
    
    if (authManager.hasRole(['admin', 'editor'])) {
      menuItems.push(
        { path: '/users', name: '用户管理', icon: 'user', permission: 'manage_users' },
        { path: '/settings', name: '系统设置', icon: 'settings', permission: 'manage_settings' },
        { path: '/scraper', name: '内容抓取', icon: 'scraper', permission: 'manage_settings' }
      );
    }
    
    return menuItems.filter(item => 
      authManager.hasPermission(item.permission)
    );
  },
  
  // 格式化用户角色
  formatRole: (role: string): string => {
    const roleNames: Record<string, string> = {
      admin: '管理员',
      editor: '编辑者',
      author: '作者',
      viewer: '访客'
    };
    
    return roleNames[role] || role;
  },
  
  // 获取角色颜色
  getRoleColor: (role: string): string => {
    const roleColors: Record<string, string> = {
      admin: 'text-red-600 bg-red-100',
      editor: 'text-blue-600 bg-blue-100',
      author: 'text-green-600 bg-green-100',
      viewer: 'text-gray-600 bg-gray-100'
    };
    
    return roleColors[role] || 'text-gray-600 bg-gray-100';
  }
};
