const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const Article = require('../models/Article');
const Category = require('../models/Category');
const { cache } = require('../config/database');
const { requireAdmin, apiKeyAuth } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// 速率限制
const scraperRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    error: '请求过于频繁，请稍后再试'
  }
});

// 获取抓取状态
router.get('/status', scraperRateLimit, async (req, res) => {
  try {
    const cacheKey = 'scraper:status';

    // 尝试从缓存获取
    let status = await cache.get(cacheKey);
    
    if (!status) {
      // 获取抓取统计
      const stats = await Article.aggregate([
        {
          $group: {
            _id: '$source',
            count: { $sum: 1 },
            lastUpdate: { $max: '$publishTime' }
          }
        }
      ]);

      // 获取最近抓取的文章
      const recentArticles = await Article.find({})
        .select('title source publishTime')
        .sort({ publishTime: -1 })
        .limit(10);

      status = {
        sources: stats,
        recentArticles,
        lastUpdate: new Date(),
        isRunning: false // 这里应该检查实际的抓取进程状态
      };

      // 缓存结果
      await cache.set(cacheKey, status, 60); // 1分钟缓存
    }

    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('获取抓取状态失败:', error);
    res.status(500).json({
      success: false,
      message: '获取抓取状态失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 手动触发抓取
router.post('/trigger', requireAdmin, scraperRateLimit, [
  body('sources').optional().isArray().withMessage('抓取源必须是数组'),
  body('sources.*').isIn(['twitter', 'rss', 'news']).withMessage('抓取源无效'),
  body('maxArticles').optional().isInt({ min: 1, max: 1000 }).withMessage('最大文章数量必须在1-1000之间')
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

    const { sources = ['twitter', 'rss', 'news'], maxArticles = 100 } = req.body;

    // 这里应该启动实际的抓取进程
    // 暂时返回模拟结果
    const result = {
      jobId: `scrape_${Date.now()}`,
      sources,
      maxArticles,
      status: 'started',
      startTime: new Date(),
      estimatedDuration: '5-10分钟'
    };

    // 清除相关缓存
    await cache.delPattern('scraper:*');
    await cache.delPattern('articles:*');

    res.json({
      success: true,
      message: '抓取任务已启动',
      data: result
    });

  } catch (error) {
    console.error('启动抓取任务失败:', error);
    res.status(500).json({
      success: false,
      message: '启动抓取任务失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 获取抓取配置
router.get('/config', requireAdmin, scraperRateLimit, async (req, res) => {
  try {
    const cacheKey = 'scraper:config';

    // 尝试从缓存获取
    let config = await cache.get(cacheKey);
    
    if (!config) {
      config = {
        twitter: {
          enabled: true,
          keywords: ['#AI', '#FinTech', '#TechFinX', '#Blockchain', '#Crypto'],
          rateLimit: 300, // 5分钟
          maxTweets: 50,
          apiKey: process.env.TWITTER_API_KEY ? '***' : null,
          apiSecret: process.env.TWITTER_API_SECRET ? '***' : null
        },
        rss: {
          enabled: true,
          feeds: [
            'https://feeds.feedburner.com/oreilly/radar',
            'https://techcrunch.com/feed/',
            'https://www.ft.com/rss/home',
            'https://feeds.finance.yahoo.com/rss/2.0/headline',
            'https://cointelegraph.com/rss'
          ],
          rateLimit: 600, // 10分钟
          maxArticles: 100
        },
        news: {
          enabled: true,
          keywords: ['artificial intelligence', 'fintech', 'blockchain', 'cryptocurrency'],
          language: 'en',
          country: 'us',
          rateLimit: 1800, // 30分钟
          maxArticles: 50,
          apiKey: process.env.GOOGLE_NEWS_API_KEY ? '***' : null
        },
        general: {
          autoPublish: false,
          duplicateCheck: true,
          contentFilter: true,
          maxContentLength: 10000,
          minContentLength: 100
        }
      };

      // 缓存结果
      await cache.set(cacheKey, config, 300); // 5分钟缓存
    }

    res.json({
      success: true,
      data: config
    });

  } catch (error) {
    console.error('获取抓取配置失败:', error);
    res.status(500).json({
      success: false,
      message: '获取抓取配置失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 更新抓取配置
router.put('/config', requireAdmin, scraperRateLimit, [
  body('twitter.enabled').optional().isBoolean().withMessage('Twitter启用状态必须是布尔值'),
  body('twitter.keywords').optional().isArray().withMessage('Twitter关键词必须是数组'),
  body('twitter.maxTweets').optional().isInt({ min: 1, max: 1000 }).withMessage('最大推文数量必须在1-1000之间'),
  body('rss.enabled').optional().isBoolean().withMessage('RSS启用状态必须是布尔值'),
  body('rss.feeds').optional().isArray().withMessage('RSS源必须是数组'),
  body('rss.maxArticles').optional().isInt({ min: 1, max: 1000 }).withMessage('最大文章数量必须在1-1000之间'),
  body('news.enabled').optional().isBoolean().withMessage('News启用状态必须是布尔值'),
  body('news.keywords').optional().isArray().withMessage('News关键词必须是数组'),
  body('news.maxArticles').optional().isInt({ min: 1, max: 1000 }).withMessage('最大文章数量必须在1-1000之间')
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

    const config = req.body;

    // 这里应该将配置保存到数据库
    // 暂时只返回成功消息

    // 清除配置缓存
    await cache.delPattern('scraper:config');

    res.json({
      success: true,
      message: '抓取配置更新成功',
      data: config
    });

  } catch (error) {
    console.error('更新抓取配置失败:', error);
    res.status(500).json({
      success: false,
      message: '更新抓取配置失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 获取抓取历史
router.get('/history', requireAdmin, scraperRateLimit, [
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('每页数量必须在1-100之间'),
  query('source').optional().isIn(['twitter', 'rss', 'news']).withMessage('抓取源无效'),
  query('status').optional().isIn(['success', 'failed', 'partial']).withMessage('状态无效')
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

    const { page = 1, limit = 20, source, status } = req.query;

    // 这里应该从抓取历史表获取数据
    // 暂时返回模拟数据
    const history = [
      {
        id: 'scrape_1703123456789',
        source: 'twitter',
        status: 'success',
        startTime: new Date(Date.now() - 3600000),
        endTime: new Date(Date.now() - 3000000),
        duration: 600000, // 10分钟
        articlesFound: 25,
        articlesSaved: 23,
        errors: []
      },
      {
        id: 'scrape_1703120000000',
        source: 'rss',
        status: 'success',
        startTime: new Date(Date.now() - 7200000),
        endTime: new Date(Date.now() - 6600000),
        duration: 600000, // 10分钟
        articlesFound: 15,
        articlesSaved: 15,
        errors: []
      }
    ];

    res.json({
      success: true,
      data: {
        history: history.slice((page - 1) * limit, page * limit),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: history.length,
          pages: Math.ceil(history.length / limit)
        }
      }
    });

  } catch (error) {
    console.error('获取抓取历史失败:', error);
    res.status(500).json({
      success: false,
      message: '获取抓取历史失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 停止抓取任务
router.post('/stop', requireAdmin, scraperRateLimit, [
  body('jobId').optional().isString().withMessage('任务ID必须是字符串')
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

    const { jobId } = req.body;

    // 这里应该停止实际的抓取进程
    // 暂时返回模拟结果
    const result = {
      jobId: jobId || 'all',
      status: 'stopped',
      stopTime: new Date()
    };

    res.json({
      success: true,
      message: '抓取任务已停止',
      data: result
    });

  } catch (error) {
    console.error('停止抓取任务失败:', error);
    res.status(500).json({
      success: false,
      message: '停止抓取任务失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 测试抓取源
router.post('/test', requireAdmin, scraperRateLimit, [
  body('source').isIn(['twitter', 'rss', 'news']).withMessage('抓取源无效'),
  body('config').isObject().withMessage('配置必须是对象')
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

    const { source, config } = req.body;

    // 这里应该测试实际的抓取源
    // 暂时返回模拟结果
    const result = {
      source,
      status: 'success',
      testTime: new Date(),
      articlesFound: Math.floor(Math.random() * 20) + 5,
      sampleArticles: [
        {
          title: 'Sample Article 1',
          url: 'https://example.com/article1',
          publishTime: new Date()
        },
        {
          title: 'Sample Article 2',
          url: 'https://example.com/article2',
          publishTime: new Date()
        }
      ]
    };

    res.json({
      success: true,
      message: '抓取源测试成功',
      data: result
    });

  } catch (error) {
    console.error('测试抓取源失败:', error);
    res.status(500).json({
      success: false,
      message: '测试抓取源失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// API接口：接收抓取的文章（用于外部抓取服务）
router.post('/articles', apiKeyAuth, scraperRateLimit, [
  body('articles').isArray({ min: 1 }).withMessage('文章列表不能为空'),
  body('articles.*.title').notEmpty().withMessage('文章标题不能为空'),
  body('articles.*.content').notEmpty().withMessage('文章内容不能为空'),
  body('articles.*.source').isIn(['twitter', 'rss', 'news', 'api']).withMessage('文章来源无效'),
  body('articles.*.sourceUrl').optional().isURL().withMessage('来源URL格式不正确'),
  body('articles.*.category').isIn(['tech', 'finance', 'policy', 'research', 'industry']).withMessage('文章分类无效')
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

    const { articles, source } = req.body;
    const savedArticles = [];
    const errors = [];

    for (const articleData of articles) {
      try {
        // 检查是否已存在（基于来源URL或标题）
        const existingArticle = await Article.findOne({
          $or: [
            { sourceUrl: articleData.sourceUrl },
            { title: articleData.title, source: articleData.source }
          ]
        });

        if (existingArticle) {
          errors.push({
            title: articleData.title,
            error: '文章已存在'
          });
          continue;
        }

        // 创建新文章
        const article = new Article({
          ...articleData,
          author: 'Auto Scraper',
          status: 'published',
          publishTime: new Date()
        });

        await article.save();
        savedArticles.push(article);

      } catch (error) {
        errors.push({
          title: articleData.title,
          error: error.message
        });
      }
    }

    // 清除相关缓存
    await cache.delPattern('articles:*');
    await cache.delPattern('scraper:*');

    res.json({
      success: true,
      message: `成功保存 ${savedArticles.length} 篇文章`,
      data: {
        saved: savedArticles.length,
        errors: errors.length,
        details: {
          savedArticles: savedArticles.map(a => ({ id: a._id, title: a.title })),
          errors
        }
      }
    });

  } catch (error) {
    console.error('保存抓取文章失败:', error);
    res.status(500).json({
      success: false,
      message: '保存抓取文章失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

module.exports = router;
