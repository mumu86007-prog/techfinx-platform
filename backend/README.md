# TechfinX Backend API

TechfinX 金融科技资讯平台的后端API服务，提供文章管理、内容抓取、用户认证和系统管理功能。

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- MongoDB >= 5.0
- Redis >= 6.0

### 安装依赖

```bash
npm install
```

### 环境配置

1. 复制环境变量文件：
```bash
cp env.example .env
```

2. 编辑 `.env` 文件，配置必要的环境变量：
```env
# 服务器配置
NODE_ENV=development
PORT=8000
HOST=localhost

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/techfinx
REDIS_URL=redis://localhost:6379

# JWT配置
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# 其他配置...
```

### 启动服务

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

## 📚 API文档

### 基础信息

- **Base URL**: `http://localhost:8000/api`
- **Content-Type**: `application/json`
- **认证方式**: Bearer Token

### 主要接口

#### 文章管理
- `GET /articles` - 获取文章列表
- `GET /articles/:slug` - 获取文章详情
- `POST /articles` - 创建文章
- `PUT /articles/:id` - 更新文章
- `DELETE /articles/:id` - 删除文章
- `GET /articles/search` - 搜索文章

#### 分类管理
- `GET /categories` - 获取分类列表
- `GET /categories/:slug` - 获取分类详情
- `POST /categories` - 创建分类
- `PUT /categories/:id` - 更新分类
- `DELETE /categories/:id` - 删除分类

#### 用户认证
- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录
- `GET /auth/me` - 获取当前用户信息
- `PUT /auth/me` - 更新用户信息
- `PUT /auth/password` - 修改密码

#### 管理后台
- `GET /admin/dashboard` - 获取仪表板数据
- `GET /admin/stats` - 获取系统统计
- `GET /admin/articles` - 获取文章管理数据
- `POST /admin/articles/batch` - 批量操作文章

#### 内容抓取
- `GET /scraper/status` - 获取抓取状态
- `POST /scraper/trigger` - 手动触发抓取
- `GET /scraper/config` - 获取抓取配置
- `PUT /scraper/config` - 更新抓取配置

## 🏗️ 项目结构

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # 数据库配置
│   ├── middleware/
│   │   └── auth.js             # 认证中间件
│   ├── models/
│   │   ├── Article.js          # 文章模型
│   │   ├── Category.js         # 分类模型
│   │   └── User.js             # 用户模型
│   ├── routes/
│   │   ├── articles.js         # 文章路由
│   │   ├── categories.js       # 分类路由
│   │   ├── users.js            # 用户路由
│   │   ├── auth.js             # 认证路由
│   │   ├── admin.js            # 管理后台路由
│   │   └── scraper.js          # 抓取路由
│   └── server.js               # 服务器入口
├── package.json
├── env.example
└── README.md
```

## 🔧 功能特性

### 文章管理
- ✅ 文章的CRUD操作
- ✅ 分类和标签管理
- ✅ 搜索和筛选
- ✅ 分页和排序
- ✅ SEO优化支持
- ✅ 内容统计

### 用户系统
- ✅ 用户注册和登录
- ✅ JWT认证
- ✅ 角色权限管理
- ✅ 密码重置
- ✅ 用户信息管理

### 内容抓取
- ✅ 多源内容抓取（Twitter、RSS、Google News）
- ✅ 自动去重
- ✅ 定时抓取
- ✅ 抓取状态监控
- ✅ 配置管理

### 管理后台
- ✅ 仪表板统计
- ✅ 文章管理
- ✅ 用户管理
- ✅ 系统设置
- ✅ 缓存管理

### 性能优化
- ✅ Redis缓存
- ✅ 数据库索引
- ✅ 分页查询
- ✅ 速率限制
- ✅ 压缩和优化

## 🛠️ 开发指南

### 添加新接口

1. 在对应的路由文件中添加新路由
2. 添加必要的验证中间件
3. 实现业务逻辑
4. 添加错误处理
5. 更新API文档

### 数据库操作

```javascript
// 创建文档
const article = new Article(data);
await article.save();

// 查询文档
const articles = await Article.find(query).sort(sort).limit(limit);

// 更新文档
await Article.findByIdAndUpdate(id, updateData);

// 删除文档
await Article.findByIdAndDelete(id);
```

### 缓存使用

```javascript
const { cache } = require('../config/database');

// 设置缓存
await cache.set('key', data, ttl);

// 获取缓存
const data = await cache.get('key');

// 删除缓存
await cache.del('key');
```

## 🚀 部署

### Docker部署

```bash
# 构建镜像
docker build -t techfinx-backend .

# 运行容器
docker run -d -p 8000:8000 --name techfinx-backend techfinx-backend
```

### PM2部署

```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start src/server.js --name techfinx-backend

# 查看状态
pm2 status

# 查看日志
pm2 logs techfinx-backend
```

## 📊 监控和日志

### 健康检查

```bash
curl http://localhost:8000/health
```

### 日志级别

- `error`: 错误信息
- `warn`: 警告信息
- `info`: 一般信息
- `debug`: 调试信息

## 🔒 安全特性

- ✅ JWT认证
- ✅ 密码加密
- ✅ 速率限制
- ✅ CORS配置
- ✅ 输入验证
- ✅ SQL注入防护
- ✅ XSS防护

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License

## 📞 支持

如有问题，请提交 Issue 或联系开发团队。
