const mongoose = require('mongoose');
const redis = require('redis');

// MongoDB连接配置
const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/techfinx';
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0
    };

    await mongoose.connect(mongoURI, options);
    
    console.log('✅ MongoDB连接成功');
    
    // 监听连接事件
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB连接错误:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB连接断开');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB重新连接成功');
    });

  } catch (error) {
    console.error('❌ MongoDB连接失败:', error);
    process.exit(1);
  }
};

// Redis连接配置
let redisClient = null;

const connectRedis = async () => {
  try {
    const redisURL = process.env.REDIS_URL || 'redis://localhost:6379';
    
    redisClient = redis.createClient({
      url: redisURL,
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          console.error('❌ Redis服务器连接被拒绝');
          return new Error('Redis服务器连接被拒绝');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          console.error('❌ Redis重试时间超时');
          return new Error('Redis重试时间超时');
        }
        if (options.attempt > 10) {
          console.error('❌ Redis重试次数超限');
          return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
      }
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis客户端错误:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis连接成功');
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis准备就绪');
    });

    redisClient.on('end', () => {
      console.log('⚠️ Redis连接结束');
    });

    await redisClient.connect();
    
  } catch (error) {
    console.error('❌ Redis连接失败:', error);
    // Redis连接失败不影响主应用启动
  }
};

// 缓存工具函数
const cache = {
  // 设置缓存
  async set(key, value, ttl = 3600) {
    if (!redisClient) return false;
    try {
      const serializedValue = JSON.stringify(value);
      await redisClient.setEx(key, ttl, serializedValue);
      return true;
    } catch (error) {
      console.error('缓存设置失败:', error);
      return false;
    }
  },

  // 获取缓存
  async get(key) {
    if (!redisClient) return null;
    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('缓存获取失败:', error);
      return null;
    }
  },

  // 删除缓存
  async del(key) {
    if (!redisClient) return false;
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error('缓存删除失败:', error);
      return false;
    }
  },

  // 批量删除缓存
  async delPattern(pattern) {
    if (!redisClient) return false;
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
      return true;
    } catch (error) {
      console.error('批量缓存删除失败:', error);
      return false;
    }
  }
};

// 数据库索引创建
const createIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    
    // 文章集合索引
    await db.collection('articles').createIndexes([
      { key: { slug: 1 }, unique: true },
      { key: { category: 1, publishTime: -1 } },
      { key: { status: 1, publishTime: -1 } },
      { key: { tags: 1 } },
      { key: { 'seo.metaTitle': 'text', 'seo.metaDescription': 'text', title: 'text', excerpt: 'text' } },
      { key: { source: 1, publishTime: -1 } }
    ]);

    // 分类集合索引
    await db.collection('categories').createIndexes([
      { key: { slug: 1 }, unique: true },
      { key: { parentId: 1, sortOrder: 1 } }
    ]);

    // 用户集合索引
    await db.collection('users').createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { username: 1 }, unique: true }
    ]);

    // 广告位集合索引
    await db.collection('adspaces').createIndexes([
      { key: { position: 1, isActive: 1 } }
    ]);

    console.log('✅ 数据库索引创建成功');
  } catch (error) {
    console.error('❌ 数据库索引创建失败:', error);
  }
};

// 优雅关闭
const gracefulShutdown = async () => {
  console.log('🔄 开始优雅关闭...');
  
  try {
    // 关闭MongoDB连接
    await mongoose.connection.close();
    console.log('✅ MongoDB连接已关闭');
    
    // 关闭Redis连接
    if (redisClient) {
      await redisClient.quit();
      console.log('✅ Redis连接已关闭');
    }
    
    console.log('✅ 优雅关闭完成');
    process.exit(0);
  } catch (error) {
    console.error('❌ 优雅关闭失败:', error);
    process.exit(1);
  }
};

// 监听进程信号
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = {
  connectMongoDB,
  connectRedis,
  cache,
  createIndexes,
  gracefulShutdown
};
