const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
require('dotenv').config();

// 导入配置和中间件
const { connectMongoDB, connectRedis, createIndexes } = require('./config/database');
const { normalRateLimit } = require('./middleware/auth');

// 导入路由
const articleRoutes = require('./routes/articles');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const scraperRoutes = require('./routes/scraper');

const app = express();

// 基础中间件
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"]
    }
  }
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 日志中间件
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 速率限制
app.use(normalRateLimit);

// 慢速限制（防止暴力攻击）
app.use(slowDown({
  windowMs: 15 * 60 * 1000, // 15分钟
  delayAfter: 50, // 50个请求后开始延迟
  delayMs: 500 // 每个请求延迟500ms
}));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API路由
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/scraper', scraperRoutes);

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: 'TechfinX API Server',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/health'
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    path: req.originalUrl,
    method: req.method
  });
});

// 全局错误处理中间件
app.use((error, req, res, next) => {
  console.error('全局错误处理:', error);

  // Mongoose验证错误
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message
    }));

    return res.status(400).json({
      success: false,
      message: '数据验证失败',
      errors
    });
  }

  // Mongoose重复键错误
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field}已存在`
    });
  }

  // JWT错误
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: '无效的认证令牌'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: '认证令牌已过期'
    });
  }

  // 文件上传错误
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: '文件大小超出限制'
    });
  }

  // 默认服务器错误
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || '服务器内部错误',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// 启动服务器
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || 'localhost';

const startServer = async () => {
  try {
    // 连接数据库
    await connectMongoDB();
    await connectRedis();
    
    // 创建索引
    await createIndexes();

    // 启动服务器
    const server = app.listen(PORT, HOST, () => {
      console.log(`🚀 TechfinX API服务器启动成功`);
      console.log(`📍 地址: http://${HOST}:${PORT}`);
      console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
      console.log(`⏰ 时间: ${new Date().toLocaleString()}`);
    });

    // 优雅关闭处理
    const gracefulShutdown = async (signal) => {
      console.log(`\n🔄 收到 ${signal} 信号，开始优雅关闭...`);
      
      server.close(async () => {
        console.log('✅ HTTP服务器已关闭');
        
        try {
          const { gracefulShutdown } = require('./config/database');
          await gracefulShutdown();
        } catch (error) {
          console.error('❌ 优雅关闭失败:', error);
          process.exit(1);
        }
      });
    };

    // 监听关闭信号
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // 未捕获的异常处理
    process.on('uncaughtException', (error) => {
      console.error('❌ 未捕获的异常:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ 未处理的Promise拒绝:', reason);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
};

// 启动服务器
startServer();

module.exports = app;
