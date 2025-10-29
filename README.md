# TechFinX - 金融科技情报站

## 项目简介

TechFinX 正在从单页展示逐步升级为多页面的金融科技情报站。我们专注于趋势雷达、深度专栏、账号库与工具资源，为从业者提供高价值信息。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **样式方案**: Tailwind CSS + 自定义组件样式
- **路由**: React Router v6
- **构建工具**: Vite
- **SEO优化**: React Helmet Async

## 功能特性

### 当前阶段（Day 1）
- 🏠 **首页骨架**: 展示每日计划、栏目定位、流量快照
- 📈 **趋势雷达页**: 汇总多源趋势信号与操作建议
- 📚 **深度专栏页**: 长篇内容选题策划与结构占位
- 👥 **账号库页**: 规划账号分组、指标与后续扩展
- 🧰 **工具资源页**: 资源分组与更新节奏说明
- 📬 **关于 / 联系页**: 品牌愿景、团队特长、联系邮箱

### 技术特性（当前）
- ⚡ 快速原型：使用 Tailwind + 自定义组件，保持风格一致
- 🔍 基础 SEO：Helmet 元标签，配合静态 meta 信息
- 🧭 统一架构：主布局导航、页脚、页面骨架一致

## 项目结构

```
src/
├── components/
│   └── layout/        # 主布局、导航、页脚
├── pages/             # 多页面内容骨架
├── sections/          # 页面级区块（Hero 等）
├── styles/            # Tailwind 入口与自定义样式
└── router.tsx         # React Router 配置
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

## 测试指南

### 单元测试
- 组件渲染测试
- 用户交互测试
- 状态管理测试

## 许可证

MIT License

## 联系方式

- 邮箱: Mumu86007@gmail.com
- 微信: TechFinX_Official
- 微博: @TechFinX

## 更新日志

### v1.0.0 (2024-12-13)
- 初始版本发布
- 基础功能实现
- SEO优化完成
- AdSense集成完成
