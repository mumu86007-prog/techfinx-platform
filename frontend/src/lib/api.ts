import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, PaginatedResponse } from '@/types';

// API配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// 创建axios实例
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 添加认证token
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加API密钥
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (apiKey) {
      config.headers['X-API-Key'] = apiKey;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // 处理认证错误
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    // 处理网络错误
    if (!error.response) {
      error.message = '网络连接失败，请检查网络设置';
    }
    
    return Promise.reject(error);
  }
);

// 通用API方法
class ApiClient {
  // GET请求
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // POST请求
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // PUT请求
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // PATCH请求
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await api.patch(url, data, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // DELETE请求
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // 文件上传
  async upload<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // 错误处理
  private handleError(error: any): Error {
    if (error.response) {
      // 服务器响应错误
      const message = error.response.data?.message || error.response.data?.error || '请求失败';
      const errorObj = new Error(message);
      (errorObj as any).status = error.response.status;
      (errorObj as any).data = error.response.data;
      return errorObj;
    } else if (error.request) {
      // 网络错误
      return new Error('网络连接失败，请检查网络设置');
    } else {
      // 其他错误
      return new Error(error.message || '未知错误');
    }
  }
}

// 创建API客户端实例
const apiClient = new ApiClient();

// 文章相关API
export const articleApi = {
  // 获取文章列表
  getArticles: (params?: any) => apiClient.get<PaginatedResponse<any>>('/articles', { params }),
  
  // 获取文章详情
  getArticle: (id: string) => apiClient.get(`/articles/${id}`),
  
  // 创建文章
  createArticle: (data: any) => apiClient.post('/articles', data),
  
  // 更新文章
  updateArticle: (id: string, data: any) => apiClient.put(`/articles/${id}`, data),
  
  // 删除文章
  deleteArticle: (id: string) => apiClient.delete(`/articles/${id}`),
  
  // 搜索文章
  searchArticles: (params: any) => apiClient.get('/articles/search', { params }),
  
  // 获取相关文章
  getRelatedArticles: (id: string, params?: any) => apiClient.get(`/articles/${id}/related`, { params }),
  
  // 点赞文章
  likeArticle: (id: string) => apiClient.post(`/articles/${id}/like`),
  
  // 分享文章
  shareArticle: (id: string) => apiClient.post(`/articles/${id}/share`),
  
  // 批量操作
  batchOperation: (data: any) => apiClient.post('/admin/articles/batch', data),
};

// 分类相关API
export const categoryApi = {
  // 获取分类列表
  getCategories: (params?: any) => apiClient.get('/categories', { params }),
  
  // 获取分类详情
  getCategory: (id: string) => apiClient.get(`/categories/${id}`),
  
  // 创建分类
  createCategory: (data: any) => apiClient.post('/categories', data),
  
  // 更新分类
  updateCategory: (id: string, data: any) => apiClient.put(`/categories/${id}`, data),
  
  // 删除分类
  deleteCategory: (id: string) => apiClient.delete(`/categories/${id}`),
  
  // 获取分类文章
  getCategoryArticles: (id: string, params?: any) => apiClient.get(`/categories/${id}/articles`, { params }),
  
  // 更新文章计数
  updateArticleCount: (id: string) => apiClient.post(`/categories/${id}/update-count`),
};

// 用户相关API
export const userApi = {
  // 获取用户列表
  getUsers: (params?: any) => apiClient.get<PaginatedResponse<any>>('/users', { params }),
  
  // 获取用户详情
  getUser: (id: string) => apiClient.get(`/users/${id}`),
  
  // 更新用户
  updateUser: (id: string, data: any) => apiClient.put(`/users/${id}`, data),
  
  // 删除用户
  deleteUser: (id: string) => apiClient.delete(`/users/${id}`),
  
  // 获取用户统计
  getUserStats: () => apiClient.get('/users/stats/overview'),
  
  // 切换用户状态
  toggleUserStatus: (id: string) => apiClient.patch(`/users/${id}/toggle-status`),
  
  // 修改用户角色
  changeUserRole: (id: string, data: any) => apiClient.patch(`/users/${id}/role`, data),
};

// 认证相关API
export const authApi = {
  // 用户登录
  login: (data: { email: string; password: string }) => apiClient.post('/auth/login', data),
  
  // 用户注册
  register: (data: any) => apiClient.post('/auth/register', data),
  
  // 获取当前用户信息
  getCurrentUser: () => apiClient.get('/auth/me'),
  
  // 更新用户信息
  updateProfile: (data: any) => apiClient.put('/auth/me', data),
  
  // 修改密码
  changePassword: (data: any) => apiClient.put('/auth/password', data),
  
  // 忘记密码
  forgotPassword: (data: { email: string }) => apiClient.post('/auth/forgot-password', data),
  
  // 重置密码
  resetPassword: (data: any) => apiClient.post('/auth/reset-password', data),
  
  // 登出
  logout: () => apiClient.post('/auth/logout'),
};

// 管理后台API
export const adminApi = {
  // 获取仪表板数据
  getDashboard: () => apiClient.get('/admin/dashboard'),
  
  // 获取系统统计
  getStats: (params?: any) => apiClient.get('/admin/stats', { params }),
  
  // 获取文章管理数据
  getArticles: (params?: any) => apiClient.get('/admin/articles', { params }),
  
  // 获取系统设置
  getSettings: () => apiClient.get('/admin/settings'),
  
  // 更新系统设置
  updateSettings: (data: any) => apiClient.put('/admin/settings', data),
  
  // 清除缓存
  clearCache: (data?: any) => apiClient.post('/admin/cache/clear', data),
  
  // 获取系统日志
  getLogs: (params?: any) => apiClient.get('/admin/logs', { params }),
};

// 抓取相关API
export const scraperApi = {
  // 获取抓取状态
  getStatus: () => apiClient.get('/scraper/status'),
  
  // 手动触发抓取
  triggerScraping: (data?: any) => apiClient.post('/scraper/trigger', data),
  
  // 获取抓取配置
  getConfig: () => apiClient.get('/scraper/config'),
  
  // 更新抓取配置
  updateConfig: (data: any) => apiClient.put('/scraper/config', data),
  
  // 获取抓取历史
  getHistory: (params?: any) => apiClient.get('/scraper/history', { params }),
  
  // 停止抓取任务
  stopScraping: (data?: any) => apiClient.post('/scraper/stop', data),
  
  // 测试抓取源
  testSource: (data: any) => apiClient.post('/scraper/test', data),
  
  // 接收抓取文章
  receiveArticles: (data: any) => apiClient.post('/scraper/articles', data),
};

// 文件上传API
export const fileApi = {
  // 上传图片
  uploadImage: (file: File, onProgress?: (progress: number) => void) => 
    apiClient.upload('/upload/image', file, onProgress),
  
  // 上传文件
  uploadFile: (file: File, onProgress?: (progress: number) => void) => 
    apiClient.upload('/upload/file', file, onProgress),
  
  // 删除文件
  deleteFile: (url: string) => apiClient.delete(`/upload/file?url=${encodeURIComponent(url)}`),
};

// 导出API客户端和实例
export { apiClient, api };
export default apiClient;
