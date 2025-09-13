# TechFinX - 金融科技账号聚合站

## 项目简介

TechFinX 是一个专业的金融科技账号聚合平台，帮助用户发现优质账号，获取最新行业热点，提升信息获取效率。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **样式方案**: Tailwind CSS + 自定义组件库
- **状态管理**: Redux Toolkit
- **路由**: React Router v6
- **构建工具**: Vite
- **测试框架**: Jest + React Testing Library
- **SEO优化**: React Helmet Async
- **广告集成**: Google AdSense

## 功能特性

### 核心功能
- 🏠 **首页展示**: 账号聚合展示和每日热点
- 🔍 **智能搜索**: 支持关键词搜索和分类筛选
- 📊 **分类浏览**: 金融和科技领域精准分类
- 🔥 **每日热点**: 精选行业热点和深度分析
- 👤 **账号详情**: 详细的账号介绍和统计信息

### 技术特性
- 📱 **响应式设计**: 完美适配桌面端、平板、手机
- ⚡ **性能优化**: 代码分割、懒加载、缓存策略
- 🔍 **SEO优化**: 元标签管理、结构化数据、站点地图
- 💰 **广告集成**: Google AdSense合规集成
- 🎨 **苹果风格**: 简洁优雅的UI设计

## 项目结构

```
src/
├── components/          # 组件库
│   ├── common/         # 通用组件
│   ├── business/       # 业务组件
│   └── ads/           # 广告组件
├── pages/             # 页面组件
├── store/             # 状态管理
│   └── slices/        # Redux切片
├── services/          # API服务
├── utils/             # 工具函数
│   └── seo/           # SEO工具
├── styles/            # 样式文件
└── hooks/             # 自定义钩子
```

## 开发指南

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

### 运行测试
```bash
# 运行所有测试
npm test

# 监听模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

## SEO优化

### 元标签管理
- 动态生成页面标题和描述
- Open Graph和Twitter Card支持
- 结构化数据(JSON-LD)集成

### 站点地图
- 自动生成sitemap.xml
- 包含所有重要页面
- 支持搜索引擎爬取

### 性能优化
- 页面加载速度 < 3秒
- 首屏内容绘制(LCP) < 2.5秒
- 首次输入延迟(FID) < 100ms

## Google AdSense集成

### 广告位置
- 首页横幅广告
- 侧边栏广告
- 内容中插入广告
- 文章底部广告

### 合规要求
- 广告与内容明确分离
- 避免诱导性语言
- 响应式广告单元
- 合理的广告密度

### 配置说明
1. 替换 `src/components/ads/` 中的客户端ID
2. 配置广告单元ID
3. 测试广告显示效果
4. 提交AdSense审核

## 部署指南

### 构建配置
- 生产环境优化
- 代码压缩和混淆
- 静态资源CDN配置

### 环境变量
```env
VITE_API_BASE_URL=https://api.techfinx.com
VITE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxx
```

### 部署步骤
1. 构建生产版本: `npm run build`
2. 上传dist目录到服务器
3. 配置Nginx/Apache
4. 设置HTTPS证书
5. 配置CDN加速

## 测试指南

### 单元测试
- 组件渲染测试
- 用户交互测试
- 状态管理测试

### 集成测试
- 页面路由测试
- API接口测试
- 端到端流程测试

### 性能测试
- Lighthouse性能评分
- 页面加载速度测试
- 内存使用监控

## 贡献指南

### 代码规范
- 使用TypeScript严格模式
- 遵循ESLint规则
- 统一的代码格式化

### 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式
- refactor: 代码重构
- test: 测试相关

### 开发流程
1. Fork项目
2. 创建功能分支
3. 提交代码
4. 创建Pull Request
5. 代码审查
6. 合并代码

## 许可证

MIT License

## 联系方式

- 邮箱: contact@techfinx.com
- 微信: TechFinX_Official
- 微博: @TechFinX

## 更新日志

### v1.0.0 (2024-12-13)
- 初始版本发布
- 基础功能实现
- SEO优化完成
- AdSense集成完成
