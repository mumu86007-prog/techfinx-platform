const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const User = require('../models/User');
const { cache } = require('../config/database');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// 速率限制
const userRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: '请求过于频繁，请稍后再试'
  }
});

// 获取用户列表（需要认证）
router.get('/', auth, userRateLimit, [
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('每页数量必须在1-50之间'),
  query('role').optional().isIn(['admin', 'editor', 'author', 'viewer']).withMessage('角色无效'),
  query('isActive').optional().isBoolean().withMessage('激活状态必须是布尔值'),
  query('search').optional().isString().withMessage('搜索关键词必须是字符串')
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

    const {
      page = 1,
      limit = 10,
      role,
      isActive,
      search
    } = req.query;

    // 构建查询条件
    const query = {};
    
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'profile.firstName': { $regex: search, $options: 'i' } },
        { 'profile.lastName': { $regex: search, $options: 'i' } }
      ];
    }

    const cacheKey = `users:${JSON.stringify({ query, page, limit })}`;

    // 尝试从缓存获取
    let result = await cache.get(cacheKey);
    
    if (!result) {
      const users = await User.find(query)
        .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const total = await User.countDocuments(query);

      result = {
        users,
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
    console.error('获取用户列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户列表失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 获取用户详情（需要认证）
router.get('/:id', auth, userRateLimit, [
  param('id').isMongoId().withMessage('用户ID格式不正确')
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

    // 检查权限（只能查看自己的信息或管理员可以查看所有）
    if (id !== req.user._id.toString() && !req.user.isAdmin()) {
      return res.status(403).json({
        success: false,
        message: '权限不足'
      });
    }

    const cacheKey = `user:${id}`;

    // 尝试从缓存获取
    let user = await cache.get(cacheKey);
    
    if (!user) {
      user = await User.findById(id)
        .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      // 缓存结果
      await cache.set(cacheKey, user, 600); // 10分钟缓存
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('获取用户详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户详情失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 更新用户信息（需要认证）
router.put('/:id', auth, userRateLimit, [
  param('id').isMongoId().withMessage('用户ID格式不正确'),
  body('role').optional().isIn(['admin', 'editor', 'author', 'viewer']).withMessage('角色无效'),
  body('isActive').optional().isBoolean().withMessage('激活状态必须是布尔值'),
  body('profile.firstName')
    .optional()
    .isLength({ max: 30 })
    .withMessage('名字不能超过30个字符'),
  body('profile.lastName')
    .optional()
    .isLength({ max: 30 })
    .withMessage('姓氏不能超过30个字符'),
  body('profile.bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('个人简介不能超过500个字符'),
  body('profile.website')
    .optional()
    .isURL()
    .withMessage('网站URL格式不正确')
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

    // 检查权限
    const isOwnProfile = id === req.user._id.toString();
    const isAdmin = req.user.isAdmin();

    if (!isOwnProfile && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: '权限不足'
      });
    }

    // 非管理员不能修改角色和激活状态
    if (!isAdmin && (req.body.role || req.body.isActive !== undefined)) {
      return res.status(403).json({
        success: false,
        message: '权限不足，无法修改角色或激活状态'
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 更新用户信息
    const allowedUpdates = ['profile', 'preferences', 'avatar'];
    
    if (isAdmin) {
      allowedUpdates.push('role', 'isActive');
    }

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'profile' && typeof req.body[field] === 'object') {
          user[field] = { ...user[field], ...req.body[field] };
        } else {
          user[field] = req.body[field];
        }
      }
    });

    await user.save();

    // 清除相关缓存
    await cache.delPattern(`user:${id}:*`);

    res.json({
      success: true,
      message: '用户信息更新成功',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          profile: user.profile,
          preferences: user.preferences,
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '更新用户信息失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 删除用户（需要认证）
router.delete('/:id', auth, userRateLimit, [
  param('id').isMongoId().withMessage('用户ID格式不正确')
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

    // 不能删除自己
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: '不能删除自己的账户'
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    await User.findByIdAndDelete(id);

    // 清除相关缓存
    await cache.delPattern(`user:${id}:*`);

    res.json({
      success: true,
      message: '用户删除成功'
    });

  } catch (error) {
    console.error('删除用户失败:', error);
    res.status(500).json({
      success: false,
      message: '删除用户失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 获取用户统计（需要认证）
router.get('/stats/overview', auth, userRateLimit, async (req, res) => {
  try {
    // 检查权限
    if (!req.user.isAdmin()) {
      return res.status(403).json({
        success: false,
        message: '权限不足'
      });
    }

    const cacheKey = 'user:stats:overview';

    // 尝试从缓存获取
    let stats = await cache.get(cacheKey);
    
    if (!stats) {
      stats = await User.getStats();

      // 缓存结果
      await cache.set(cacheKey, stats, 300); // 5分钟缓存
    }

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('获取用户统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户统计失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 激活/禁用用户（需要认证）
router.patch('/:id/toggle-status', auth, userRateLimit, [
  param('id').isMongoId().withMessage('用户ID格式不正确')
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

    // 不能操作自己
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: '不能操作自己的账户'
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    // 清除相关缓存
    await cache.delPattern(`user:${id}:*`);

    res.json({
      success: true,
      message: `用户已${user.isActive ? '激活' : '禁用'}`,
      data: {
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error('切换用户状态失败:', error);
    res.status(500).json({
      success: false,
      message: '切换用户状态失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 修改用户角色（需要认证）
router.patch('/:id/role', auth, userRateLimit, [
  param('id').isMongoId().withMessage('用户ID格式不正确'),
  body('role')
    .isIn(['admin', 'editor', 'author', 'viewer'])
    .withMessage('角色无效')
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
    const { role } = req.body;

    // 不能修改自己的角色
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: '不能修改自己的角色'
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    user.role = role;
    await user.save();

    // 清除相关缓存
    await cache.delPattern(`user:${id}:*`);

    res.json({
      success: true,
      message: '用户角色修改成功',
      data: {
        role: user.role
      }
    });

  } catch (error) {
    console.error('修改用户角色失败:', error);
    res.status(500).json({
      success: false,
      message: '修改用户角色失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

module.exports = router;
