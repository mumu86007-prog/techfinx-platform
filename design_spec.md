# UI/UX 设计规范文档
## X平台金融科技账号聚合站

---

## 1. 全局设计规范 (Global Design System)

### 1.1 色彩规范
基于苹果商务风格，采用高对比度、简洁的配色方案：

**主色调 (Primary Colors):**
- 主色 (Primary): `#0A84FF` - 用于主要按钮、链接、强调元素
- 辅助色 (Secondary): `#5E5CE6` - 用于渐变、次要元素
- 成功色 (Success): `#34C759` - 用于成功状态、确认操作
- 警告色 (Warning): `#FF9500` - 用于警告信息、注意事项
- 错误色 (Error): `#FF3B30` - 用于错误状态、删除操作

**中性色调 (Neutral Colors):**
- 背景色 (Background): `#F2F2F7` - 页面主背景
- 表面色 (Surface): `#FFFFFF` - 卡片、面板背景
- 文本主色 (Text Primary): `#1C1C1E` - 主要文本内容
- 文本次色 (Text Secondary): `#8A8A8E` - 次要文本、占位符
- 边框色 (Border): `#E5E5EA` - 分割线、边框

**渐变色彩 (Gradients):**
- 主渐变: `linear-gradient(135deg, #0A84FF, #5E5CE6)`
- 背景渐变: `linear-gradient(180deg, #F2F2F7 0%, #FFFFFF 100%)`

### 1.2 字体规范
采用SF Pro字体系统，确保跨平台一致性：

**字体层级 (Typography Scale):**
- 大标题 (Large Title): `SF Pro Display, Bold, 34px, 41px行高`
- 标题一 (Title 1): `SF Pro Display, Regular, 28px, 34px行高`
- 标题二 (Title 2): `SF Pro Display, Medium, 22px, 28px行高`
- 正文 (Body): `SF Pro Text, Regular, 17px, 22px行高`
- 正文强调 (Body Emphasized): `SF Pro Text, Medium, 17px, 22px行高`
- 注释 (Caption): `SF Pro Text, Regular, 12px, 16px行高`
- 小字 (Small): `SF Pro Text, Regular, 10px, 14px行高`

**字体权重 (Font Weights):**
- Light: 300
- Regular: 400
- Medium: 500
- Semi-bold: 600
- Bold: 700

### 1.3 间距规范
基于8px网格系统，确保视觉一致性：

**间距单位 (Spacing Units):**
- xs: 4px - 最小间距，用于图标与文字间距
- s: 8px - 小间距，用于元素内部间距
- m: 16px - 中等间距，用于组件间距
- l: 24px - 大间距，用于区块间距
- xl: 32px - 超大间距，用于页面区块间距
- xxl: 48px - 最大间距，用于页面边距

**网格系统 (Grid System):**
- 基础网格: 8px
- 容器最大宽度: 1200px
- 响应式断点: 768px, 1024px, 1200px

### 1.4 圆角规范
采用统一的圆角系统，营造柔和、现代的感觉：

**圆角单位 (Border Radius):**
- 小圆角 (Small): 8px - 按钮、输入框、小卡片
- 中圆角 (Medium): 12px - 中等卡片、面板
- 大圆角 (Large): 16px - 大卡片、模态框
- 圆形 (Circle): 50% - 头像、圆形按钮

### 1.5 阴影规范
采用分层阴影系统，增强视觉层次：

**阴影层级 (Shadow Levels):**
- 轻微阴影: `0 1px 3px rgba(0, 0, 0, 0.1)`
- 中等阴影: `0 4px 12px rgba(0, 0, 0, 0.15)`
- 重阴影: `0 8px 25px rgba(0, 0, 0, 0.2)`
- 悬浮阴影: `0 12px 40px rgba(0, 0, 0, 0.25)`

### 1.6 动效规范
基于苹果动效原则，确保流畅自然的交互体验：

**动效时长 (Duration):**
- 快速 (Fast): 100ms - 按钮点击、状态切换
- 正常 (Normal): 200ms - 页面切换、元素出现
- 缓慢 (Slow): 300ms - 复杂动画、页面加载

**缓动曲线 (Easing):**
- Ease-in-out: 用于元素移动、页面切换
- Ease-out: 用于元素出现、展开动画
- Ease-in: 用于元素消失、收起动画

**动效类型 (Animation Types):**
- 淡入淡出: `opacity: 0 → 1`
- 滑动: `transform: translateY(20px) → translateY(0)`
- 缩放: `transform: scale(0.95) → scale(1)`
- 旋转: `transform: rotate(0deg) → rotate(360deg)`

### 1.7 可访问性规范 (Accessibility)
确保所有用户都能正常使用产品：

**色彩对比度:**
- 所有文本与背景的对比度必须满足WCAG AA级标准（4.5:1以上）
- 重要元素对比度应达到AAA级标准（7:1以上）

**触摸目标:**
- 所有可点击元素的热区不小于44x44px
- 按钮最小高度44px，确保易于点击

**键盘导航:**
- 支持Tab键导航
- 焦点状态清晰可见
- 逻辑导航顺序

---

## 2. 页面详细设计 (Detailed Page Specs)

### 2.1 首页设计

**2.1.1 页面布局**
- 顶部导航栏：高度60px，固定定位
- 搜索区域：高度80px，包含搜索框
- 分类导航：高度60px，水平滚动
- 主要内容：响应式网格布局
- 底部：页脚信息

**2.1.2 导航栏规格**
- 背景色: `#FFFFFF`
- 边框: `1px solid #E5E5EA`
- 内边距: `16px 24px`
- Logo: 字体大小28px，颜色`#0A84FF`
- 导航链接: 字体大小17px，间距24px

**2.1.3 搜索区域规格**
- 背景色: `#FFFFFF`
- 搜索框高度: 44px
- 搜索框宽度: 100%，最大600px
- 边框: `1px solid #E5E5EA`
- 圆角: 8px
- 占位符文本: "搜索账号、关键词或标签..."

**2.1.4 分类导航规格**
- 背景色: `#FFFFFF`
- 标签高度: 36px
- 标签内边距: `8px 16px`
- 标签间距: 8px
- 激活状态: 背景色`#0A84FF`，文字白色

**2.1.5 每日精选区域规格**
- 背景: 主渐变 `linear-gradient(135deg, #0A84FF, #5E5CE6)`
- 内边距: 32px
- 圆角: 16px
- 标题: 34px，白色，粗体
- 内容: 17px，白色，行高1.6
- 元数据: 12px，白色，透明度0.8

**2.1.6 账号卡片规格**
- 背景色: `#FFFFFF`
- 边框: `1px solid #E5E5EA`
- 圆角: 12px
- 内边距: 24px
- 阴影: 轻微阴影
- 悬浮效果: 上移2px，重阴影

**2.1.7 账号卡片内容规格**
- 头像: 48x48px，圆形
- 用户名: 17px，粗体
- 职位: 12px，次要文本色
- 描述: 17px，行高1.5
- 标签: 12px，背景色`#F2F2F7`
- 统计数字: 17px，主色
- 统计标签: 12px，次要文本色
- 关注按钮: 高度44px，主色背景

### 2.2 账号详情页设计

**2.2.1 页面布局**
- 顶部: 返回按钮 + 标题
- 账号信息区域: 头像、基本信息、统计数据
- 账号介绍区域: 400-500字浓缩介绍
- 标签区域: 专业标签
- 操作区域: 关注按钮、分享按钮

**2.2.2 账号信息区域规格**
- 背景色: `#FFFFFF`
- 内边距: 32px
- 头像: 80x80px，圆形
- 用户名: 28px，粗体
- 职位: 17px，次要文本色
- 统计数据: 网格布局，3列

**2.2.3 账号介绍区域规格**
- 背景色: `#FFFFFF`
- 内边距: 32px
- 标题: 22px，粗体
- 内容: 17px，行高1.6
- 段落间距: 16px

**2.2.4 标签区域规格**
- 标签高度: 32px
- 标签内边距: `8px 16px`
- 标签间距: 8px
- 标签背景: `#F2F2F7`
- 标签文字: 14px，次要文本色

### 2.3 每日精选页设计

**2.3.1 页面布局**
- 顶部: 标题 + 日期
- 精选内容区域: 主要内容展示
- 相关账号区域: 推荐相关账号
- 历史精选区域: 过往精选内容

**2.3.2 精选内容区域规格**
- 背景色: `#FFFFFF`
- 内边距: 32px
- 圆角: 16px
- 标题: 28px，粗体
- 内容: 17px，行高1.6
- 元数据: 12px，次要文本色

**2.3.3 推文截图规格**
- 最大宽度: 100%
- 圆角: 8px
- 边框: `1px solid #E5E5EA`
- 阴影: 轻微阴影

### 2.4 分类页设计

**2.4.1 页面布局**
- 顶部: 分类标题 + 描述
- 筛选区域: 排序、筛选选项
- 账号列表: 网格布局
- 分页区域: 分页控件

**2.4.2 筛选区域规格**
- 背景色: `#FFFFFF`
- 内边距: 16px
- 筛选选项: 水平排列
- 排序下拉框: 高度44px

**2.4.3 账号列表规格**
- 网格布局: 响应式，最小300px
- 卡片间距: 24px
- 加载状态: 骨架屏效果

---

## 3. 可复用组件库 (Reusable Component Library)

### 3.1 按钮组件 (Button Components)

**3.1.1 主按钮 (Primary Button)**
```css
.primary-button {
    height: 44px;
    padding: 0 16px;
    background: #0A84FF;
    color: #FFFFFF;
    border: none;
    border-radius: 8px;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.primary-button:hover {
    background: #0060F0;
}

.primary-button:active {
    background: #0056CC;
}

.primary-button:disabled {
    background: #E5E5EA;
    color: #8E8E93;
    cursor: not-allowed;
}
```

**3.1.2 次要按钮 (Secondary Button)**
```css
.secondary-button {
    height: 44px;
    padding: 0 16px;
    background: transparent;
    color: #0A84FF;
    border: 1px solid #0A84FF;
    border-radius: 8px;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.secondary-button:hover {
    background: #0A84FF;
    color: #FFFFFF;
}
```

**3.1.3 文本按钮 (Text Button)**
```css
.text-button {
    height: 44px;
    padding: 0 16px;
    background: transparent;
    color: #0A84FF;
    border: none;
    font-size: 17px;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s ease;
}

.text-button:hover {
    color: #0060F0;
}
```

### 3.2 输入组件 (Input Components)

**3.2.1 搜索框 (Search Input)**
```css
.search-input {
    width: 100%;
    height: 44px;
    padding: 0 16px;
    border: 1px solid #E5E5EA;
    border-radius: 8px;
    font-size: 17px;
    background: #F2F2F7;
    transition: border-color 0.2s ease;
}

.search-input:focus {
    outline: none;
    border-color: #0A84FF;
    background: #FFFFFF;
}

.search-input::placeholder {
    color: #8A8A8E;
}
```

**3.2.2 文本输入框 (Text Input)**
```css
.text-input {
    width: 100%;
    height: 44px;
    padding: 0 16px;
    border: 1px solid #E5E5EA;
    border-radius: 8px;
    font-size: 17px;
    background: #FFFFFF;
    transition: border-color 0.2s ease;
}

.text-input:focus {
    outline: none;
    border-color: #0A84FF;
}

.text-input:invalid {
    border-color: #FF3B30;
}
```

### 3.3 卡片组件 (Card Components)

**3.3.1 基础卡片 (Base Card)**
```css
.base-card {
    background: #FFFFFF;
    border: 1px solid #E5E5EA;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
}

.base-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
```

**3.3.2 账号卡片 (Account Card)**
```css
.account-card {
    background: #FFFFFF;
    border: 1px solid #E5E5EA;
    border-radius: 12px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.account-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: #0A84FF;
}
```

### 3.4 标签组件 (Tag Components)

**3.4.1 基础标签 (Base Tag)**
```css
.base-tag {
    display: inline-block;
    padding: 4px 8px;
    background: #F2F2F7;
    color: #8A8A8E;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
}
```

**3.4.2 分类标签 (Category Tag)**
```css
.category-tag {
    display: inline-block;
    padding: 8px 16px;
    background: #F2F2F7;
    color: #1C1C1E;
    border: 1px solid #E5E5EA;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.category-tag:hover {
    background: #0A84FF;
    color: #FFFFFF;
    border-color: #0A84FF;
}

.category-tag.active {
    background: #0A84FF;
    color: #FFFFFF;
    border-color: #0A84FF;
}
```

### 3.5 加载组件 (Loading Components)

**3.5.1 骨架屏 (Skeleton Screen)**
```css
.skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
}

@keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
```

**3.5.2 加载指示器 (Loading Spinner)**
```css
.loading-spinner {
    width: 24px;
    height: 24px;
    border: 2px solid #E5E5EA;
    border-top: 2px solid #0A84FF;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
```

---

## 4. 响应式设计规范 (Responsive Design)

### 4.1 断点定义
- 移动端: < 768px
- 平板端: 768px - 1024px
- 桌面端: > 1024px

### 4.2 移动端适配
- 导航栏: 垂直布局，汉堡菜单
- 搜索框: 全宽，高度44px
- 分类导航: 水平滚动
- 账号卡片: 单列布局
- 按钮: 全宽，高度44px

### 4.3 平板端适配
- 导航栏: 水平布局，完整菜单
- 搜索框: 最大宽度600px
- 分类导航: 水平布局，可滚动
- 账号卡片: 2列布局
- 按钮: 自适应宽度

### 4.4 桌面端适配
- 导航栏: 水平布局，完整菜单
- 搜索框: 最大宽度600px
- 分类导航: 水平布局，不滚动
- 账号卡片: 3-4列布局
- 按钮: 自适应宽度

---

## 5. 交互状态规范 (Interaction States)

### 5.1 按钮状态
- 默认 (Default): 正常样式
- 悬浮 (Hover): 颜色变深，阴影增强
- 点击 (Active): 颜色更深，轻微缩放
- 禁用 (Disabled): 灰色，不可点击
- 加载 (Loading): 显示加载指示器

### 5.2 输入框状态
- 默认 (Default): 正常边框色
- 聚焦 (Focus): 主色边框，背景变白
- 错误 (Error): 错误色边框，显示错误信息
- 成功 (Success): 成功色边框
- 禁用 (Disabled): 灰色背景，不可编辑

### 5.3 卡片状态
- 默认 (Default): 正常样式
- 悬浮 (Hover): 上移，阴影增强
- 点击 (Active): 轻微缩放
- 选中 (Selected): 主色边框
- 加载 (Loading): 骨架屏效果

---

## 6. 动效规范 (Animation Guidelines)

### 6.1 页面切换动效
- 进入: 从右侧滑入，200ms，ease-out
- 退出: 向左侧滑出，200ms，ease-in
- 背景: 淡入淡出，150ms

### 6.2 元素出现动效
- 淡入: opacity 0 → 1，200ms，ease-out
- 滑入: translateY(20px) → translateY(0)，200ms，ease-out
- 缩放: scale(0.95) → scale(1)，200ms，ease-out

### 6.3 悬浮动效
- 上移: translateY(0) → translateY(-2px)，200ms，ease-out
- 阴影增强: 轻微阴影 → 重阴影，200ms，ease-out

### 6.4 加载动效
- 骨架屏: 背景渐变移动，1.5s，linear，infinite
- 旋转加载: rotate(0deg) → rotate(360deg)，1s，linear，infinite

---

## 7. 可访问性规范 (Accessibility Guidelines)

### 7.1 色彩对比度
- 正常文本: 4.5:1 以上
- 大文本: 3:1 以上
- 重要元素: 7:1 以上

### 7.2 键盘导航
- Tab键顺序: 逻辑顺序
- 焦点状态: 清晰可见
- 快捷键: 支持常用快捷键

### 7.3 屏幕阅读器
- 语义化标签: 使用正确的HTML标签
- 替代文本: 图片提供alt属性
- 标题层级: 正确的h1-h6层级

### 7.4 触摸目标
- 最小尺寸: 44x44px
- 间距: 最小8px
- 手势: 支持常用手势

---

## 8. 设计交付标准 (Design Delivery Standards)

### 8.1 设计文件格式
- 主设计文件: Figma/Sketch
- 原型文件: Figma Prototype
- 图标文件: SVG格式
- 图片文件: PNG/WebP格式

### 8.2 命名规范
- 组件: `ComponentName`
- 页面: `PageName`
- 状态: `ComponentName_State`
- 变体: `ComponentName_Variant`

### 8.3 标注规范
- 尺寸: 精确到1px
- 颜色: HEX值
- 字体: 字体名称、大小、行高
- 间距: 具体数值
- 动效: 时长、缓动函数

### 8.4 开发交付
- 设计规范文档
- 组件库文件
- 原型交互说明
- 切图资源包
- 开发标注文件

---

**文档版本**: v1.0  
**创建日期**: 2024年12月  
**最后更新**: 2024年12月  
**负责人**: Agent-Designer
