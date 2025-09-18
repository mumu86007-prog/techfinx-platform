# TechfinX CMS - 内容管理系统

TechfinX 金融科技资讯平台的内容管理系统，基于 Next.js 14 构建的现代化 CMS 解决方案。

## 🚀 功能特性

### 核心功能
- **文章管理**: 创建、编辑、发布、删除文章
- **分类管理**: 文章分类的层级管理
- **用户管理**: 多角色用户权限管理
- **内容抓取**: 自动化内容抓取和导入
- **SEO优化**: 完整的SEO设置和优化
- **媒体管理**: 图片和文件上传管理

### 技术特性
- **现代化UI**: 基于 Tailwind CSS 的响应式设计
- **类型安全**: 完整的 TypeScript 支持
- **状态管理**: React Query 数据管理
- **表单处理**: React Hook Form + Zod 验证
- **主题支持**: 深色/浅色主题切换
- **国际化**: 多语言支持准备

## 📋 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0
- MongoDB >= 5.0
- Redis >= 6.0

## 🛠️ 安装配置

### 1. 克隆项目

```bash
git clone <repository-url>
cd techfinx-cms
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
```

### 3. 环境配置

复制环境变量文件：
```bash
cp env.example .env.local
```

编辑 `.env.local` 文件，配置必要的环境变量：

```env
# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# 认证配置
NEXTAUTH_SECRET=your-nextauth-secret-here

# 其他配置...
```

### 4. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

```
frontend/
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── dashboard/          # 仪表板页面
│   │   ├── login/              # 登录页面
│   │   ├── articles/           # 文章管理页面
│   │   ├── categories/         # 分类管理页面
│   │   ├── users/              # 用户管理页面
│   │   ├── settings/           # 系统设置页面
│   │   ├── layout.tsx          # 根布局
│   │   └── page.tsx            # 首页
│   ├── components/             # React 组件
│   │   ├── ui/                 # 基础UI组件
│   │   ├── layout/             # 布局组件
│   │   ├── dashboard/          # 仪表板组件
│   │   └── providers.tsx       # 上下文提供者
│   ├── lib/                    # 工具库
│   │   ├── api.ts              # API客户端
│   │   ├── auth.ts             # 认证管理
│   │   └── utils.ts            # 工具函数
│   ├── types/                  # TypeScript 类型定义
│   └── styles/                 # 样式文件
├── public/                     # 静态资源
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## 🎨 组件库

### 基础组件
- `Button` - 按钮组件
- `Input` - 输入框组件
- `Card` - 卡片组件
- `Badge` - 徽章组件
- `Alert` - 警告组件
- `LoadingSpinner` - 加载动画

### 布局组件
- `DashboardLayout` - 仪表板布局
- `Sidebar` - 侧边栏
- `Header` - 顶部导航
- `Breadcrumb` - 面包屑导航

### 业务组件
- `StatsCards` - 统计卡片
- `RecentArticles` - 最近文章
- `QuickActions` - 快速操作
- `SystemStatus` - 系统状态

## 🔧 开发指南

### 添加新页面

1. 在 `src/app/` 目录下创建页面文件夹
2. 创建 `page.tsx` 文件
3. 使用 `DashboardLayout` 包装页面内容

```tsx
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function NewPage() {
  return (
    <DashboardLayout>
      <div>页面内容</div>
    </DashboardLayout>
  );
}
```

### 添加新组件

1. 在 `src/components/` 目录下创建组件文件
2. 使用 TypeScript 定义组件接口
3. 导出组件供其他文件使用

```tsx
interface ComponentProps {
  title: string;
  children: React.ReactNode;
}

export const Component: React.FC<ComponentProps> = ({ title, children }) => {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
};
```

### API 集成

使用 `src/lib/api.ts` 中的 API 客户端：

```tsx
import { articleApi } from '@/lib/api';

// 获取文章列表
const articles = await articleApi.getArticles();

// 创建文章
const newArticle = await articleApi.createArticle(articleData);
```

### 状态管理

使用 React Query 进行数据管理：

```tsx
import { useQuery, useMutation } from 'react-query';
import { articleApi } from '@/lib/api';

// 查询数据
const { data, isLoading, error } = useQuery('articles', articleApi.getArticles);

// 修改数据
const mutation = useMutation(articleApi.createArticle, {
  onSuccess: () => {
    // 处理成功
  },
});
```

## 🎯 功能模块

### 文章管理
- 文章列表展示和筛选
- 文章创建和编辑
- Markdown 编辑器支持
- 文章预览和发布
- 批量操作功能

### 分类管理
- 分类层级结构
- 分类创建和编辑
- 分类排序和移动
- 分类统计信息

### 用户管理
- 用户列表和权限
- 用户创建和编辑
- 角色权限管理
- 用户活动日志

### 内容抓取
- 抓取任务管理
- 抓取配置设置
- 抓取状态监控
- 抓取历史记录

### 系统设置
- 站点基本信息
- SEO 设置
- 邮件配置
- 缓存管理

## 🚀 部署

### Vercel 部署

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 自动部署

### Docker 部署

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### 环境变量

生产环境需要配置以下环境变量：

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXTAUTH_SECRET=your-production-secret
DATABASE_URL=your-mongodb-connection-string
REDIS_URL=your-redis-connection-string
```

## 📊 性能优化

### 代码分割
- 使用动态导入进行代码分割
- 路由级别的代码分割
- 组件级别的懒加载

### 缓存策略
- 静态资源缓存
- API 响应缓存
- 页面缓存策略

### 图片优化
- Next.js Image 组件
- WebP 格式支持
- 响应式图片

## 🔒 安全考虑

### 认证和授权
- JWT Token 认证
- 角色权限控制
- 路由保护

### 数据验证
- 客户端表单验证
- 服务端数据验证
- XSS 防护

### 安全头部
- CSP 内容安全策略
- X-Frame-Options
- X-Content-Type-Options

## 🧪 测试

### 单元测试
```bash
npm run test
```

### 端到端测试
```bash
npm run test:e2e
```

### 类型检查
```bash
npm run type-check
```

## 📝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License

## 📞 支持

如有问题，请提交 Issue 或联系开发团队。

---

**TechfinX CMS** - 现代化的内容管理解决方案
