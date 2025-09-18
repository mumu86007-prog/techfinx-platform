# TechfinX前沿动态页面 - UI/UX设计规范

## 设计理念
**设计风格：** 苹果商务风（Apple-inspired business style）  
**核心理念：** 简洁、优雅、高端、用户友好  
**设计目标：** 提升用户喜爱度和沉浸感，建立专业权威的AI资讯品牌形象

## 视觉设计系统

### 色彩规范
```css
/* 主色调 */
--primary-white: #FFFFFF;
--primary-gray-50: #F9FAFB;
--primary-gray-100: #F3F4F6;
--primary-gray-200: #E5E7EB;
--primary-gray-300: #D1D5DB;
--primary-gray-400: #9CA3AF;
--primary-gray-500: #6B7280;
--primary-gray-600: #4B5563;
--primary-gray-700: #374151;
--primary-gray-800: #1F2937;
--primary-gray-900: #111827;

/* 强调色 */
--accent-blue-50: #EFF6FF;
--accent-blue-100: #DBEAFE;
--accent-blue-500: #3B82F6;
--accent-blue-600: #2563EB;
--accent-blue-700: #1D4ED8;

/* 功能色 */
--success-green: #10B981;
--warning-orange: #F59E0B;
--error-red: #EF4444;
```

### 字体规范
```css
/* 字体族 */
--font-primary: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-secondary: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* 字体大小 */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */

/* 字重 */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 间距规范
```css
/* 间距系统 (基于8px网格) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### 圆角规范
```css
--radius-sm: 0.375rem;  /* 6px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-2xl: 1.5rem;   /* 24px */
--radius-full: 9999px;
```

### 阴影规范
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

## 页面布局设计

### 整体布局结构
```
┌─────────────────────────────────────────────────────────┐
│                    Header (固定顶部)                      │
├─────────────────────────────────────────────────────────┤
│  Main Content Area                                      │
│  ┌─────────────────┬─────────────────────────────────┐  │
│  │   Sidebar       │        Content Area            │  │
│  │   (左侧边栏)     │        (主内容区)               │  │
│  │                 │                                │  │
│  │   - 分类导航     │   - 精选推荐轮播                │  │
│  │   - 热门标签     │   - 资讯列表                   │  │
│  │   - 最新评论     │   - 分页导航                   │  │
│  │   - 相关推荐     │                                │  │
│  └─────────────────┴─────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│                    Footer (页脚)                        │
└─────────────────────────────────────────────────────────┘
```

### 响应式断点
```css
/* 移动端 */
@media (max-width: 767px) {
  /* 单列布局，侧边栏折叠 */
}

/* 平板端 */
@media (min-width: 768px) and (max-width: 1199px) {
  /* 两列布局，侧边栏在底部 */
}

/* 桌面端 */
@media (min-width: 1200px) {
  /* 三列布局，完整侧边栏 */
}
```

## 组件设计规范

### 1. 头部导航 (Header)
```css
.header {
  height: 64px;
  background: var(--primary-white);
  border-bottom: 1px solid var(--primary-gray-200);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(20px);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 var(--space-6);
  max-width: 1200px;
  margin: 0 auto;
}
```

**Logo设计：**
- 字体：SF Pro Display, 24px, font-weight: 700
- 颜色：--primary-gray-900
- 包含"小虎AI"文字和AI图标

**搜索框设计：**
- 宽度：400px (桌面端), 100% (移动端)
- 高度：40px
- 圆角：--radius-lg
- 边框：1px solid --primary-gray-300
- 占位符文字："搜索AI资讯..."

### 2. 分类导航标签
```css
.category-tabs {
  display: flex;
  gap: var(--space-2);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--primary-gray-200);
  margin-bottom: var(--space-6);
}

.category-tab {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--primary-gray-600);
    background: transparent;
  border: none;
    cursor: pointer;
    transition: all 0.2s ease;
}

.category-tab:hover {
  background: var(--primary-gray-100);
  color: var(--primary-gray-800);
}

.category-tab.active {
  background: var(--accent-blue-500);
  color: var(--primary-white);
}
```

### 3. 资讯卡片设计
```css
.news-card {
  background: var(--primary-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--primary-gray-200);
  overflow: hidden;
  transition: all 0.3s ease;
    cursor: pointer;
}

.news-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.news-card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: var(--primary-gray-100);
}

.news-card-content {
  padding: var(--space-6);
}

.news-card-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--primary-gray-900);
  line-height: 1.4;
  margin-bottom: var(--space-3);
}

.news-card-excerpt {
  font-size: var(--text-sm);
  color: var(--primary-gray-600);
  line-height: 1.6;
  margin-bottom: var(--space-4);
}

.news-card-meta {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  font-size: var(--text-xs);
  color: var(--primary-gray-500);
}

.news-card-category {
  background: var(--accent-blue-100);
  color: var(--accent-blue-700);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
}
```

### 4. 精选推荐轮播
```css
.hero-carousel {
  position: relative;
  height: 400px;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  margin-bottom: var(--space-8);
}

.hero-slide {
  position: absolute;
  top: 0;
  left: 0;
    width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--accent-blue-500), var(--accent-blue-700));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-white);
}

.hero-content {
  text-align: center;
  max-width: 600px;
  padding: var(--space-8);
}

.hero-title {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-4);
  line-height: 1.2;
}

.hero-subtitle {
  font-size: var(--text-lg);
  opacity: 0.9;
  margin-bottom: var(--space-6);
}

.hero-button {
  background: var(--primary-white);
  color: var(--accent-blue-700);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  border: none;
  cursor: pointer;
    transition: all 0.2s ease;
}

.hero-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}
```

### 5. 侧边栏组件
```css
.sidebar {
  width: 280px;
  background: var(--primary-white);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--primary-gray-200);
  height: fit-content;
  position: sticky;
  top: 80px;
}

.sidebar-section {
  margin-bottom: var(--space-8);
}

.sidebar-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--primary-gray-900);
  margin-bottom: var(--space-4);
}

.sidebar-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.sidebar-tag {
  background: var(--primary-gray-100);
  color: var(--primary-gray-700);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
    cursor: pointer;
    transition: all 0.2s ease;
}

.sidebar-tag:hover {
  background: var(--accent-blue-100);
  color: var(--accent-blue-700);
}
```

## 交互设计规范

### 动画效果
```css
/* 页面进入动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 卡片悬停动画 */
@keyframes cardHover {
  from {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
  }
  to {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
}

/* 按钮点击动画 */
@keyframes buttonPress {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}
```

### 加载状态
```css
.loading-skeleton {
  background: linear-gradient(90deg, var(--primary-gray-200) 25%, var(--primary-gray-100) 50%, var(--primary-gray-200) 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
}

@keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
```

## 移动端适配

### 移动端布局调整
```css
@media (max-width: 767px) {
  .header-content {
    padding: 0 var(--space-4);
  }
  
  .search-box {
    width: 100%;
    margin: var(--space-4) 0;
  }
  
  .category-tabs {
    overflow-x: auto;
    padding: var(--space-4) 0;
    -webkit-overflow-scrolling: touch;
  }
  
  .news-card {
    margin-bottom: var(--space-4);
  }
  
  .hero-carousel {
    height: 300px;
    margin: 0 calc(-1 * var(--space-4)) var(--space-6);
    border-radius: 0;
  }
  
  .sidebar {
    width: 100%;
    position: static;
    margin-top: var(--space-6);
  }
}
```

## 无障碍设计

### 颜色对比度
- 正文文字与背景对比度 ≥ 4.5:1
- 标题文字与背景对比度 ≥ 3:1
- 链接文字与背景对比度 ≥ 4.5:1

### 键盘导航
- 所有交互元素支持Tab键导航
- 焦点状态清晰可见
- 跳过链接支持

### 屏幕阅读器支持
- 语义化HTML标签
- 适当的ARIA标签
- 图片alt属性描述

## 设计交付物

### 1. 设计稿文件
- 桌面端设计稿 (1200px)
- 平板端设计稿 (768px)
- 移动端设计稿 (375px)

### 2. 组件库
- 基础组件 (按钮、输入框、卡片等)
- 复合组件 (导航、轮播、列表等)
- 页面模板

### 3. 设计规范文档
- 色彩规范
- 字体规范
- 间距规范
- 组件规范

### 4. 交互原型
- 页面流程
- 交互动画
- 响应式行为

## 设计评审要点

### 视觉一致性
- [ ] 色彩使用符合规范
- [ ] 字体大小和字重统一
- [ ] 间距使用规范
- [ ] 圆角和阴影一致

### 用户体验
- [ ] 信息层级清晰
- [ ] 操作流程顺畅
- [ ] 加载状态友好
- [ ] 错误处理完善

### 技术可行性
- [ ] 设计可实现
- [ ] 性能影响可控
- [ ] 浏览器兼容性良好
- [ ] 响应式适配完整