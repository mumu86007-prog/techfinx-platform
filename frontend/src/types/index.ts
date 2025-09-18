// 基础类型定义
export interface BaseEntity {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// 用户相关类型
export interface User extends BaseEntity {
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  profile: UserProfile;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: string;
  loginCount: number;
  preferences: UserPreferences;
}

export type UserRole = 'admin' | 'editor' | 'author' | 'viewer';

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  bio?: string;
  website?: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
}

// 文章相关类型
export interface Article extends BaseEntity {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  htmlContent: string;
  category: ArticleCategory;
  tags: string[];
  author: string;
  source: ArticleSource;
  sourceUrl?: string;
  featuredImage?: string;
  images: string[];
  publishTime: string;
  updateTime: string;
  status: ArticleStatus;
  seo: ArticleSEO;
  stats: ArticleStats;
  isFeatured: boolean;
  readingTime: number;
  wordCount: number;
  qualityScore?: number;
  language: string;
  rawData?: any;
}

export type ArticleCategory = 'tech' | 'finance' | 'policy' | 'research' | 'industry';
export type ArticleSource = 'manual' | 'twitter' | 'rss' | 'news' | 'api';
export type ArticleStatus = 'draft' | 'published' | 'archived';

export interface ArticleSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
}

export interface ArticleStats {
  views: number;
  likes: number;
  shares: number;
  comments: number;
}

// 分类相关类型
export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  articleCount: number;
  seo: CategorySEO;
}

export interface CategorySEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: any[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// 表单相关类型
export interface ArticleFormData {
  title: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  tags: string[];
  featuredImage?: string;
  isFeatured: boolean;
  status: ArticleStatus;
  seo: ArticleSEO;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  color: string;
  icon: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  seo: CategorySEO;
}

export interface UserFormData {
  username: string;
  email: string;
  role: UserRole;
  profile: UserProfile;
  isActive: boolean;
}

// 搜索和筛选类型
export interface ArticleFilters {
  page?: number;
  limit?: number;
  category?: ArticleCategory;
  tags?: string[];
  source?: ArticleSource;
  status?: ArticleStatus;
  author?: string;
  search?: string;
  sort?: string;
  featured?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface CategoryFilters {
  page?: number;
  limit?: number;
  includeStats?: boolean;
  tree?: boolean;
  isActive?: boolean;
  search?: string;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: UserRole;
  isActive?: boolean;
  search?: string;
}

// 统计相关类型
export interface DashboardStats {
  articles: {
    total: number;
    published: number;
    draft: number;
    archived: number;
    totalViews: number;
    totalLikes: number;
    totalShares: number;
  };
  categories: {
    total: number;
    active: number;
    totalArticles: number;
  };
  users: {
    total: number;
    active: number;
    verified: number;
    byRole: Record<UserRole, number>;
  };
  recentArticles: Article[];
  popularArticles: Article[];
}

export interface SystemStats {
  articles: Array<{
    _id: { year: number; month: number; day: number };
    count: number;
    views: number;
    likes: number;
    shares: number;
  }>;
  users: Array<{
    _id: { year: number; month: number; day: number };
    count: number;
  }>;
  categories: Array<{
    _id: string;
    count: number;
    views: number;
  }>;
  period: string;
  startDate: string;
  endDate: string;
}

// 设置相关类型
export interface SystemSettings {
  site: {
    name: string;
    description: string;
    url: string;
    logo: string;
    favicon: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    keywords: string[];
    author: string;
    ogImage: string;
  };
  social: {
    twitter: string;
    facebook: string;
    linkedin: string;
    github: string;
  };
  analytics: {
    googleAnalytics: string;
    googleSearchConsole: string;
    baiduAnalytics: string;
  };
  ads: {
    googleAdsense: string;
    adSpaces: AdSpace[];
  };
  scraping: {
    enabled: boolean;
    sources: string[];
    interval: number;
    maxArticles: number;
  };
  email: {
    smtp: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
    };
    from: string;
  };
}

export interface AdSpace {
  id: string;
  name: string;
  position: string;
  type: string;
  code: string;
  isActive: boolean;
  displayRules: any;
}

// 抓取相关类型
export interface ScraperStatus {
  isRunning: boolean;
  enabledSources: string[];
  availableScrapers: string[];
  stats: {
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    lastRun?: string;
    nextRun?: string;
    totalArticles: number;
    errors: string[];
  };
  scrapersStats: Record<string, any>;
}

export interface ScraperConfig {
  twitter: {
    enabled: boolean;
    keywords: string[];
    rateLimit: number;
    maxTweets: number;
    apiKey?: string;
    apiSecret?: string;
  };
  rss: {
    enabled: boolean;
    feeds: string[];
    rateLimit: number;
    maxArticles: number;
  };
  news: {
    enabled: boolean;
    keywords: string[];
    language: string;
    country: string;
    rateLimit: number;
    maxArticles: number;
    apiKey?: string;
  };
  general: {
    autoPublish: boolean;
    duplicateCheck: boolean;
    contentFilter: boolean;
    maxContentLength: number;
    minContentLength: number;
  };
}

// 文件上传类型
export interface FileUpload {
  file: File;
  preview?: string;
  progress?: number;
  status?: 'uploading' | 'success' | 'error';
  error?: string;
}

// 通知类型
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// 主题类型
export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
}

// 权限类型
export interface Permission {
  resource: string;
  actions: string[];
}

export interface RolePermissions {
  [key: string]: Permission[];
}

// 错误类型
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// 路由类型
export interface Route {
  path: string;
  name: string;
  icon?: string;
  children?: Route[];
  permission?: string;
}

// 表格类型
export interface TableColumn<T = any> {
  key: keyof T | string;
  title: string;
  dataIndex?: keyof T | string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sorter?: boolean;
  filterable?: boolean;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  rowKey?: keyof T | string;
  onRow?: (record: T, index: number) => any;
  selection?: {
    selectedRowKeys: string[];
    onChange: (selectedRowKeys: string[]) => void;
  };
}

// 表单验证类型
export interface ValidationRule {
  required?: boolean;
  message?: string;
  min?: number;
  max?: number;
  pattern?: RegExp;
  validator?: (value: any) => boolean | string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date' | 'file';
  placeholder?: string;
  required?: boolean;
  rules?: ValidationRule[];
  options?: Array<{ label: string; value: any }>;
  multiple?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

// 组件Props类型
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export interface ButtonProps extends ComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends ComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helper?: string;
}

export interface SelectProps extends ComponentProps {
  options: Array<{ label: string; value: any }>;
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helper?: string;
}
