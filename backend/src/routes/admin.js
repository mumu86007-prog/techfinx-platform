const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const Article = require('../models/Article');
const Category = require('../models/Category');
const User = require('../models/User');
const { cache } = require('../config/database');
const { requireAdmin } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// 速率限制
const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    error: '请求过于频繁，请稍后再试'
  }
});

// 所有路由都需要管理员权限
router.use(requireAdmin);

// 获取仪表板数据
router.get('/dashboard', adminRateLimit, async (req, res) => {
  try {
    const cacheKey = 'admin:dashboard';

    // 尝试从缓存获取
    let dashboard = await cache.get(cacheKey);
    
    if (!dashboard) {
      // 并行获取各种统计数据
      const [
        articleStats,
        categoryStats,
        userStats,
        recentArticles,
        popularArticles
      ] = await Promise.all([
        // 文章统计
        Article.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              published: {
                $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
              },
              draft: {
                $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
              },
              archived: {
                $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] }
              },
              totalViews: { $sum: '$stats.views' },
              totalLikes: { $sum: '$stats.likes' },
              totalShares: { $sum: '$stats.shares' }
            }
          }
        ]),
        // 分类统计
        Category.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              active: {
                $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
              },
              totalArticles: { $sum: '$articleCount' }
            }
          }
        ]),
        // 用户统计
        User.getStats(),
        // 最近文章
        Article.find({ status: 'published' })
          .select('title slug publishTime author category stats')
          .sort({ publishTime: -1 })
          .limit(5)
          .populate('category', 'name slug color'),
        // 热门文章
        Article.find({ status: 'published' })
          .select('title slug publishTime author category stats')
          .sort({ 'stats.views': -1 })
          .limit(5)
          .populate('category', 'name slug color')
      ]);

      dashboard = {
        articles: articleStats[0] || {
          total: 0,
          published: 0,
          draft: 0,
          archived: 0,
          totalViews: 0,
          totalLikes: 0,
          totalShares: 0
        },
        categories: categoryStats[0] || {
          total: 0,
          active: 0,
          totalArticles: 0
        },
        users: userStats,
        recentArticles,
        popularArticles,
        lastUpdated: new Date()
      };

      // 缓存结果
      await cache.set(cacheKey, dashboard, 300); // 5分钟缓存
    }

    res.json({
      success: true,
      data: dashboard
    });

  } catch (error) {
    console.error('获取仪表板数据失败:', error);
    res.status(500).json({
      success: false,
      message: '获取仪表板数据失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 获取系统统计
router.get('/stats', adminRateLimit, [
  query('period').optional().isIn(['7d', '30d', '90d', '1y']).withMessage('时间周期无效')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '参数验证失败',
        errors: errors.array()
      });
    }

    const { period = '30d' } = req.query;
    const cacheKey = `admin:stats:${period}`;

    // 尝试从缓存获取
    let stats = await cache.get(cacheKey);
    
    if (!stats) {
      // 计算时间范围
      const now = new Date();
      const periodDays = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365
      };
      
      const startDate = new Date(now.getTime() - periodDays[period] * 24 * 60 * 60 * 1000);

      // 文章统计
      const articleStats = await Article.aggregate([
        {
          $match: {
            publishTime: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$publishTime' },
              month: { $month: '$publishTime' },
              day: { $dayOfMonth: '$publishTime' }
            },
            count: { $sum: 1 },
            views: { $sum: '$stats.views' },
            likes: { $sum: '$stats.likes' },
            shares: { $sum: '$stats.shares' }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
        }
      ]);

      // 用户统计
      const userStats = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
        }
      ]);

      // 分类统计
      const categoryStats = await Article.aggregate([
        {
          $match: {
            publishTime: { $gte: startDate },
            status: 'published'
          }
        },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            views: { $sum: '$stats.views' }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      stats = {
        articles: articleStats,
        users: userStats,
        categories: categoryStats,
        period,
        startDate,
        endDate: now
      };

      // 缓存结果
      await cache.set(cacheKey, stats, 600); // 10分钟缓存
    }

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('获取系统统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取系统统计失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 获取文章管理数据
router.get('/articles', adminRateLimit, [
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('每页数量必须在1-100之间'),
  query('status').optional().isIn(['draft', 'published', 'archived']).withMessage('状态无效'),
  query('category').optional().isIn(['tech', 'finance', 'policy', 'research', 'industry']).withMessage('分类无效'),
  query('author').optional().isString().withMessage('作者必须是字符串'),
  query('search').optional().isString().withMessage('搜索关键词必须是字符串'),
  query('sort').optional().isIn(['publishTime', '-publishTime', 'title', '-title', 'views', '-views']).withMessage('排序字段无效')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '参数验证失败',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 20,
      status,
      category,
      author,
      search,
      sort = '-publishTime'
    } = req.query;

    // 构建查询条件
    const query = {};
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (author) query.author = { $regex: author, $options: 'i' };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // 排序条件
    const sortObj = {};
    if (sort.startsWith('-')) {
      sortObj[sort.substring(1)] = -1;
    } else {
      sortObj[sort] = 1;
    }

    const cacheKey = `admin:articles:${JSON.stringify({ query, page, limit, sort })}`;

    // 尝试从缓存获取
    let result = await cache.get(cacheKey);
    
    if (!result) {
      const articles = await Article.find(query)
        .select('-content -htmlContent')
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('category', 'name slug color icon');

      const total = await Article.countDocuments(query);

      result = {
        articles,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };

      // 缓存结果
      await cache.set(cacheKey, result, 300); // 5分钟缓存
    }

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('获取文章管理数据失败:', error);
    res.status(500).json({
      success: false,
      message: '获取文章管理数据失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 批量操作文章
router.post('/articles/batch', adminRateLimit, [
  body('action').isIn(['publish', 'unpublish', 'archive', 'delete']).withMessage('操作类型无效'),
  body('articleIds').isArray({ min: 1 }).withMessage('文章ID列表不能为空'),
  body('articleIds.*').isMongoId().withMessage('文章ID格式不正确')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '参数验证失败',
        errors: errors.array()
      });
    }

    const { action, articleIds } = req.body;

    let result;
    let message;

    switch (action) {
      case 'publish':
        result = await Article.updateMany(
          { _id: { $in: articleIds } },
          { status: 'published', publishTime: new Date() }
        );
        message = `${result.modifiedCount} 篇文章已发布`;
        break;

      case 'unpublish':
        result = await Article.updateMany(
          { _id: { $in: articleIds } },
          { status: 'draft' }
        );
        message = `${result.modifiedCount} 篇文章已取消发布`;
        break;

      case 'archive':
        result = await Article.updateMany(
          { _id: { $in: articleIds } },
          { status: 'archived' }
        );
        message = `${result.modifiedCount} 篇文章已归档`;
        break;

      case 'delete':
        result = await Article.deleteMany({ _id: { $in: articleIds } });
        message = `${result.deletedCount} 篇文章已删除`;
        break;

      default:
        return res.status(400).json({
          success: false,
          message: '无效的操作类型'
        });
    }

    // 清除相关缓存
    await cache.delPattern('articles:*');
    await cache.delPattern('admin:*');

    res.json({
      success: true,
      message,
      data: {
        modifiedCount: result.modifiedCount || result.deletedCount,
        action
      }
    });

  } catch (error) {
    console.error('批量操作文章失败:', error);
    res.status(500).json({
      success: false,
      message: '批量操作文章失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 获取系统设置
router.get('/settings', adminRateLimit, async (req, res) => {
  try {
    const cacheKey = 'admin:settings';

    // 尝试从缓存获取
    let settings = await cache.get(cacheKey);
    
    if (!settings) {
      // 这里应该从数据库或配置文件获取设置
      // 暂时返回默认设置
      settings = {
        site: {
          name: 'TechfinX',
          description: '金融科技资讯平台',
          url: 'https://techfinx.top',
          logo: '/images/logo.png',
          favicon: '/images/favicon.ico'
        },
        seo: {
          defaultTitle: 'TechfinX - 金融科技资讯平台',
          defaultDescription: '专注于金融科技和人工智能创新，提供最新的行业资讯、技术动态和研究报告',
          keywords: ['金融科技', '人工智能', 'AI', 'FinTech', '区块链', '数字货币'],
          author: 'TechfinX Team',
          ogImage: '/images/og-image.jpg'
        },
        social: {
          twitter: '@techfinx',
          facebook: 'techfinx',
          linkedin: 'techfinx',
          github: 'techfinx'
        },
        analytics: {
          googleAnalytics: process.env.GOOGLE_ANALYTICS_ID || '',
          googleSearchConsole: '',
          baiduAnalytics: ''
        },
        ads: {
          googleAdsense: process.env.GOOGLE_ADSENSE_CLIENT || '',
          adSpaces: []
        },
        scraping: {
          enabled: true,
          sources: ['twitter', 'rss', 'news'],
          interval: 30, // 分钟
          maxArticles: 100
        },
        email: {
          smtp: {
            host: process.env.SMTP_HOST || '',
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
              user: process.env.SMTP_USER || '',
              pass: process.env.SMTP_PASS || ''
            }
          },
          from: process.env.SMTP_USER || 'noreply@techfinx.top'
        }
      };

      // 缓存结果
      await cache.set(cacheKey, settings, 600); // 10分钟缓存
    }

    res.json({
      success: true,
      data: settings
    });

  } catch (error) {
    console.error('获取系统设置失败:', error);
    res.status(500).json({
      success: false,
      message: '获取系统设置失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 更新系统设置
router.put('/settings', adminRateLimit, [
  body('site.name').optional().isLength({ max: 100 }).withMessage('网站名称不能超过100个字符'),
  body('site.description').optional().isLength({ max: 500 }).withMessage('网站描述不能超过500个字符'),
  body('site.url').optional().isURL().withMessage('网站URL格式不正确'),
  body('seo.defaultTitle').optional().isLength({ max: 60 }).withMessage('默认标题不能超过60个字符'),
  body('seo.defaultDescription').optional().isLength({ max: 160 }).withMessage('默认描述不能超过160个字符')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '参数验证失败',
        errors: errors.array()
      });
    }

    // 这里应该将设置保存到数据库
    // 暂时只返回成功消息
    const settings = req.body;

    // 清除设置缓存
    await cache.delPattern('admin:settings');

    res.json({
      success: true,
      message: '系统设置更新成功',
      data: settings
    });

  } catch (error) {
    console.error('更新系统设置失败:', error);
    res.status(500).json({
      success: false,
      message: '更新系统设置失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 清除缓存
router.post('/cache/clear', adminRateLimit, [
  body('pattern').optional().isString().withMessage('缓存模式必须是字符串')
], async (req, res) => {
  try {
    const { pattern = '*' } = req.body;

    let clearedCount = 0;

    if (pattern === '*') {
      // 清除所有缓存
      await cache.delPattern('*');
      clearedCount = 'all';
    } else {
      // 清除指定模式的缓存
      await cache.delPattern(pattern);
      clearedCount = 'pattern';
    }

    res.json({
      success: true,
      message: '缓存清除成功',
      data: {
        pattern,
        clearedCount
      }
    });

  } catch (error) {
    console.error('清除缓存失败:', error);
    res.status(500).json({
      success: false,
      message: '清除缓存失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 获取系统日志
router.get('/logs', adminRateLimit, [
  query('level').optional().isIn(['error', 'warn', 'info', 'debug']).withMessage('日志级别无效'),
  query('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('日志数量限制必须在1-1000之间')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '参数验证失败',
        errors: errors.array()
      });
    }

    const { level, limit = 100 } = req.query;

    // 这里应该从日志文件或数据库获取日志
    // 暂时返回模拟数据
    const logs = [
      {
        timestamp: new Date().toISOString(),
        level: 'info',
        message: '服务器启动成功',
        source: 'server'
      },
      {
        timestamp: new Date(Date.now() - 60000).toISOString(),
        level: 'info',
        message: '用户登录成功',
        source: 'auth',
        userId: '507f1f77bcf86cd799439011'
      }
    ];

    res.json({
      success: true,
      data: {
        logs: logs.slice(0, parseInt(limit)),
        total: logs.length
      }
    });

  } catch (error) {
    console.error('获取系统日志失败:', error);
    res.status(500).json({
      success: false,
      message: '获取系统日志失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

module.exports = router;
