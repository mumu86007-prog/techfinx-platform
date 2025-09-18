const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const Article = require('../models/Article');
const Category = require('../models/Category');
const { cache } = require('../config/database');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// 速率限制
const articleRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 15分钟内最多100个请求
  message: {
    error: '请求过于频繁，请稍后再试'
  }
});

// 获取文章列表
router.get('/', articleRateLimit, [
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('每页数量必须在1-50之间'),
  query('category').optional().isIn(['tech', 'finance', 'policy', 'research', 'industry']).withMessage('分类无效'),
  query('tags').optional().isString().withMessage('标签格式不正确'),
  query('source').optional().isIn(['manual', 'twitter', 'rss', 'news', 'api']).withMessage('来源无效'),
  query('sort').optional().isIn(['publishTime', '-publishTime', 'views', '-views', 'likes', '-likes']).withMessage('排序字段无效'),
  query('featured').optional().isBoolean().withMessage('精选参数必须是布尔值')
], async (req, res) => {
  try {
    // 验证参数
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
      limit = 10,
      category,
      tags,
      source,
      sort = '-publishTime',
      featured,
      search
    } = req.query;

    // 构建查询条件
    const query = { status: 'published' };
    
    if (category) query.category = category;
    if (source) query.source = source;
    if (featured !== undefined) query.isFeatured = featured === 'true';
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    // 搜索条件
    if (search) {
      query.$text = { $search: search };
    }

    // 排序条件
    const sortObj = {};
    if (sort.startsWith('-')) {
      sortObj[sort.substring(1)] = -1;
    } else {
      sortObj[sort] = 1;
    }

    // 缓存键
    const cacheKey = `articles:${JSON.stringify({ query, page, limit, sort })}`;

    // 尝试从缓存获取
    let result = await cache.get(cacheKey);
    
    if (!result) {
      // 从数据库获取
      const articles = await Article.find(query)
        .select('-content -htmlContent') // 不返回完整内容
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
    console.error('获取文章列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取文章列表失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 获取文章详情
router.get('/:slug', articleRateLimit, [
  param('slug').isSlug().withMessage('文章标识格式不正确')
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

    const { slug } = req.params;
    const cacheKey = `article:${slug}`;

    // 尝试从缓存获取
    let article = await cache.get(cacheKey);
    
    if (!article) {
      article = await Article.findOne({ 
        slug, 
        status: 'published' 
      }).populate('category', 'name slug color icon');

      if (!article) {
        return res.status(404).json({
          success: false,
          message: '文章不存在'
        });
      }

      // 缓存文章
      await cache.set(cacheKey, article, 600); // 10分钟缓存
    }

    // 增加浏览量
    await article.incrementViews();

    res.json({
      success: true,
      data: article
    });

  } catch (error) {
    console.error('获取文章详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取文章详情失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 搜索文章
router.get('/search', articleRateLimit, [
  query('q').notEmpty().withMessage('搜索关键词不能为空'),
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('每页数量必须在1-50之间')
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

    const { q, page = 1, limit = 10 } = req.query;
    const cacheKey = `search:${q}:${page}:${limit}`;

    // 尝试从缓存获取
    let result = await cache.get(cacheKey);
    
    if (!result) {
      result = await Article.search(q, {
        page: parseInt(page),
        limit: parseInt(limit)
      });

      // 缓存搜索结果
      await cache.set(cacheKey, result, 300); // 5分钟缓存
    }

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('搜索文章失败:', error);
    res.status(500).json({
      success: false,
      message: '搜索文章失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 获取相关文章
router.get('/:slug/related', articleRateLimit, [
  param('slug').isSlug().withMessage('文章标识格式不正确'),
  query('limit').optional().isInt({ min: 1, max: 10 }).withMessage('相关文章数量必须在1-10之间')
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

    const { slug } = req.params;
    const { limit = 5 } = req.query;
    const cacheKey = `related:${slug}:${limit}`;

    // 尝试从缓存获取
    let articles = await cache.get(cacheKey);
    
    if (!articles) {
      // 获取当前文章
      const currentArticle = await Article.findOne({ slug, status: 'published' });
      if (!currentArticle) {
        return res.status(404).json({
          success: false,
          message: '文章不存在'
        });
      }

      // 查找相关文章
      const relatedQuery = {
        status: 'published',
        _id: { $ne: currentArticle._id },
        $or: [
          { category: currentArticle.category },
          { tags: { $in: currentArticle.tags } }
        ]
      };

      articles = await Article.find(relatedQuery)
        .select('-content -htmlContent')
        .sort({ publishTime: -1 })
        .limit(parseInt(limit));

      // 缓存相关文章
      await cache.set(cacheKey, articles, 600); // 10分钟缓存
    }

    res.json({
      success: true,
      data: articles
    });

  } catch (error) {
    console.error('获取相关文章失败:', error);
    res.status(500).json({
      success: false,
      message: '获取相关文章失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 创建文章（需要认证）
router.post('/', auth, [
  body('title').notEmpty().withMessage('标题不能为空').isLength({ max: 200 }).withMessage('标题不能超过200个字符'),
  body('excerpt').notEmpty().withMessage('摘要不能为空').isLength({ max: 500 }).withMessage('摘要不能超过500个字符'),
  body('content').notEmpty().withMessage('内容不能为空'),
  body('category').isIn(['tech', 'finance', 'policy', 'research', 'industry']).withMessage('分类无效'),
  body('tags').optional().isArray().withMessage('标签必须是数组'),
  body('featuredImage').optional().isURL().withMessage('特色图片URL格式不正确'),
  body('isFeatured').optional().isBoolean().withMessage('精选参数必须是布尔值'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('状态无效')
], async (req, res) => {
  try {
    // 检查权限
    if (!req.user.isAuthor()) {
      return res.status(403).json({
        success: false,
        message: '权限不足'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '参数验证失败',
        errors: errors.array()
      });
    }

    const articleData = {
      ...req.body,
      author: req.user.displayName,
      source: 'manual'
    };

    const article = new Article(articleData);
    await article.save();

    // 清除相关缓存
    await cache.delPattern('articles:*');
    await cache.delPattern(`category:${article.category}:*`);

    res.status(201).json({
      success: true,
      message: '文章创建成功',
      data: article
    });

  } catch (error) {
    console.error('创建文章失败:', error);
    res.status(500).json({
      success: false,
      message: '创建文章失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 更新文章（需要认证）
router.put('/:id', auth, [
  param('id').isMongoId().withMessage('文章ID格式不正确'),
  body('title').optional().isLength({ max: 200 }).withMessage('标题不能超过200个字符'),
  body('excerpt').optional().isLength({ max: 500 }).withMessage('摘要不能超过500个字符'),
  body('category').optional().isIn(['tech', 'finance', 'policy', 'research', 'industry']).withMessage('分类无效'),
  body('tags').optional().isArray().withMessage('标签必须是数组'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('状态无效')
], async (req, res) => {
  try {
    // 检查权限
    if (!req.user.isAuthor()) {
      return res.status(403).json({
        success: false,
        message: '权限不足'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '参数验证失败',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }

    // 检查权限（只有作者或管理员可以编辑）
    if (article.author !== req.user.displayName && !req.user.isAdmin()) {
      return res.status(403).json({
        success: false,
        message: '只能编辑自己的文章'
      });
    }

    Object.assign(article, req.body);
    await article.save();

    // 清除相关缓存
    await cache.delPattern('articles:*');
    await cache.delPattern(`article:${article.slug}:*`);
    await cache.delPattern(`category:${article.category}:*`);

    res.json({
      success: true,
      message: '文章更新成功',
      data: article
    });

  } catch (error) {
    console.error('更新文章失败:', error);
    res.status(500).json({
      success: false,
      message: '更新文章失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 删除文章（需要认证）
router.delete('/:id', auth, [
  param('id').isMongoId().withMessage('文章ID格式不正确')
], async (req, res) => {
  try {
    // 检查权限
    if (!req.user.isEditor()) {
      return res.status(403).json({
        success: false,
        message: '权限不足'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '参数验证失败',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }

    // 检查权限（只有作者或管理员可以删除）
    if (article.author !== req.user.displayName && !req.user.isAdmin()) {
      return res.status(403).json({
        success: false,
        message: '只能删除自己的文章'
      });
    }

    await Article.findByIdAndDelete(id);

    // 清除相关缓存
    await cache.delPattern('articles:*');
    await cache.delPattern(`article:${article.slug}:*`);
    await cache.delPattern(`category:${article.category}:*`);

    res.json({
      success: true,
      message: '文章删除成功'
    });

  } catch (error) {
    console.error('删除文章失败:', error);
    res.status(500).json({
      success: false,
      message: '删除文章失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 点赞文章
router.post('/:id/like', articleRateLimit, [
  param('id').isMongoId().withMessage('文章ID格式不正确')
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

    const { id } = req.params;
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }

    await article.incrementLikes();

    // 清除相关缓存
    await cache.delPattern(`article:${article.slug}:*`);

    res.json({
      success: true,
      message: '点赞成功',
      data: { likes: article.stats.likes }
    });

  } catch (error) {
    console.error('点赞文章失败:', error);
    res.status(500).json({
      success: false,
      message: '点赞文章失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 分享文章
router.post('/:id/share', articleRateLimit, [
  param('id').isMongoId().withMessage('文章ID格式不正确')
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

    const { id } = req.params;
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }

    await article.incrementShares();

    // 清除相关缓存
    await cache.delPattern(`article:${article.slug}:*`);

    res.json({
      success: true,
      message: '分享成功',
      data: { shares: article.stats.shares }
    });

  } catch (error) {
    console.error('分享文章失败:', error);
    res.status(500).json({
      success: false,
      message: '分享文章失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

module.exports = router;
