const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const Category = require('../models/Category');
const Article = require('../models/Article');
const { cache } = require('../config/database');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// 速率限制
const categoryRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: '请求过于频繁，请稍后再试'
  }
});

// 获取分类列表
router.get('/', categoryRateLimit, [
  query('includeStats').optional().isBoolean().withMessage('统计参数必须是布尔值'),
  query('tree').optional().isBoolean().withMessage('树形结构参数必须是布尔值')
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

    const { includeStats = false, tree = false } = req.query;
    const cacheKey = `categories:${includeStats}:${tree}`;

    // 尝试从缓存获取
    let categories = await cache.get(cacheKey);
    
    if (!categories) {
      if (tree) {
        categories = await Category.getTree();
      } else {
        categories = await Category.getActive();
      }

      // 如果需要统计信息
      if (includeStats) {
        for (const category of categories) {
          await category.updateArticleCount();
        }
      }

      // 缓存结果
      await cache.set(cacheKey, categories, 600); // 10分钟缓存
    }

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('获取分类列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取分类列表失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 获取分类详情
router.get('/:slug', categoryRateLimit, [
  param('slug').isSlug().withMessage('分类标识格式不正确'),
  query('includeStats').optional().isBoolean().withMessage('统计参数必须是布尔值')
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
    const { includeStats = false } = req.query;
    const cacheKey = `category:${slug}:${includeStats}`;

    // 尝试从缓存获取
    let category = await cache.get(cacheKey);
    
    if (!category) {
      category = await Category.findOne({ slug, isActive: true })
        .populate('parent', 'name slug')
        .populate('children', 'name slug color icon articleCount');

      if (!category) {
        return res.status(404).json({
          success: false,
          message: '分类不存在'
        });
      }

      // 如果需要统计信息
      if (includeStats) {
        await category.updateArticleCount();
      }

      // 缓存结果
      await cache.set(cacheKey, category, 600); // 10分钟缓存
    }

    res.json({
      success: true,
      data: category
    });

  } catch (error) {
    console.error('获取分类详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取分类详情失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 获取分类下的文章
router.get('/:slug/articles', categoryRateLimit, [
  param('slug').isSlug().withMessage('分类标识格式不正确'),
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('每页数量必须在1-50之间'),
  query('sort').optional().isIn(['publishTime', '-publishTime', 'views', '-views', 'likes', '-likes']).withMessage('排序字段无效')
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
    const { page = 1, limit = 10, sort = '-publishTime' } = req.query;

    // 检查分类是否存在
    const category = await Category.findOne({ slug, isActive: true });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }

    const cacheKey = `category:${slug}:articles:${page}:${limit}:${sort}`;

    // 尝试从缓存获取
    let result = await cache.get(cacheKey);
    
    if (!result) {
      // 构建查询条件
      const query = { 
        category: slug, 
        status: 'published' 
      };

      // 排序条件
      const sortObj = {};
      if (sort.startsWith('-')) {
        sortObj[sort.substring(1)] = -1;
      } else {
        sortObj[sort] = 1;
      }

      const articles = await Article.find(query)
        .select('-content -htmlContent')
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const total = await Article.countDocuments(query);

      result = {
        category: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          color: category.color,
          icon: category.icon
        },
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
    console.error('获取分类文章失败:', error);
    res.status(500).json({
      success: false,
      message: '获取分类文章失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 创建分类（需要认证）
router.post('/', auth, [
  body('name').notEmpty().withMessage('分类名称不能为空').isLength({ max: 50 }).withMessage('分类名称不能超过50个字符'),
  body('description').optional().isLength({ max: 200 }).withMessage('分类描述不能超过200个字符'),
  body('color').optional().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).withMessage('颜色格式不正确'),
  body('icon').optional().isLength({ max: 10 }).withMessage('图标不能超过10个字符'),
  body('parentId').optional().isMongoId().withMessage('父分类ID格式不正确'),
  body('sortOrder').optional().isInt({ min: 0 }).withMessage('排序值必须是非负整数')
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

    const categoryData = req.body;

    // 检查父分类是否存在
    if (categoryData.parentId) {
      const parentCategory = await Category.findById(categoryData.parentId);
      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          message: '父分类不存在'
        });
      }
    }

    const category = new Category(categoryData);
    await category.save();

    // 清除相关缓存
    await cache.delPattern('categories:*');

    res.status(201).json({
      success: true,
      message: '分类创建成功',
      data: category
    });

  } catch (error) {
    console.error('创建分类失败:', error);
    res.status(500).json({
      success: false,
      message: '创建分类失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 更新分类（需要认证）
router.put('/:id', auth, [
  param('id').isMongoId().withMessage('分类ID格式不正确'),
  body('name').optional().isLength({ max: 50 }).withMessage('分类名称不能超过50个字符'),
  body('description').optional().isLength({ max: 200 }).withMessage('分类描述不能超过200个字符'),
  body('color').optional().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).withMessage('颜色格式不正确'),
  body('icon').optional().isLength({ max: 10 }).withMessage('图标不能超过10个字符'),
  body('parentId').optional().isMongoId().withMessage('父分类ID格式不正确'),
  body('sortOrder').optional().isInt({ min: 0 }).withMessage('排序值必须是非负整数'),
  body('isActive').optional().isBoolean().withMessage('激活状态必须是布尔值')
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
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }

    // 检查父分类是否存在且不是自己
    if (req.body.parentId) {
      if (req.body.parentId === id) {
        return res.status(400).json({
          success: false,
          message: '不能将自己设为父分类'
        });
      }

      const parentCategory = await Category.findById(req.body.parentId);
      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          message: '父分类不存在'
        });
      }
    }

    Object.assign(category, req.body);
    await category.save();

    // 清除相关缓存
    await cache.delPattern('categories:*');
    await cache.delPattern(`category:${category.slug}:*`);

    res.json({
      success: true,
      message: '分类更新成功',
      data: category
    });

  } catch (error) {
    console.error('更新分类失败:', error);
    res.status(500).json({
      success: false,
      message: '更新分类失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 删除分类（需要认证）
router.delete('/:id', auth, [
  param('id').isMongoId().withMessage('分类ID格式不正确')
], async (req, res) => {
  try {
    // 检查权限
    if (!req.user.isAdmin()) {
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
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }

    await Category.findByIdAndDelete(id);

    // 清除相关缓存
    await cache.delPattern('categories:*');
    await cache.delPattern(`category:${category.slug}:*`);

    res.json({
      success: true,
      message: '分类删除成功'
    });

  } catch (error) {
    console.error('删除分类失败:', error);
    res.status(500).json({
      success: false,
      message: '删除分类失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 更新分类文章计数
router.post('/:id/update-count', auth, [
  param('id').isMongoId().withMessage('分类ID格式不正确')
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
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }

    await category.updateArticleCount();

    // 清除相关缓存
    await cache.delPattern(`category:${category.slug}:*`);

    res.json({
      success: true,
      message: '文章计数更新成功',
      data: { articleCount: category.articleCount }
    });

  } catch (error) {
    console.error('更新分类文章计数失败:', error);
    res.status(500).json({
      success: false,
      message: '更新分类文章计数失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

module.exports = router;
