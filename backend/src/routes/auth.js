const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { cache } = require('../config/database');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// 严格的速率限制（用于认证相关操作）
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 5, // 限制每个IP 15分钟内最多5次尝试
  message: {
    success: false,
    message: '登录尝试过于频繁，请15分钟后再试'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// 用户注册
router.post('/register', authRateLimit, [
  body('username')
    .notEmpty()
    .withMessage('用户名不能为空')
    .isLength({ min: 3, max: 30 })
    .withMessage('用户名长度必须在3-30个字符之间')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('用户名只能包含字母、数字和下划线'),
  body('email')
    .isEmail()
    .withMessage('邮箱格式不正确')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('密码至少6个字符')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('密码必须包含至少一个小写字母、一个大写字母和一个数字'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('确认密码与密码不匹配');
      }
      return true;
    })
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

    const { username, email, password, profile } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? '邮箱已被注册' : '用户名已被使用'
      });
    }

    // 创建新用户
    const user = new User({
      username,
      email,
      password,
      profile: profile || {}
    });

    await user.save();

    // 生成认证令牌
    const token = user.generateAuthToken();

    // 清除相关缓存
    await cache.delPattern('users:*');

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        },
        token
      }
    });

  } catch (error) {
    console.error('用户注册失败:', error);
    res.status(500).json({
      success: false,
      message: '注册失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 用户登录
router.post('/login', authRateLimit, [
  body('email')
    .isEmail()
    .withMessage('邮箱格式不正确')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('密码不能为空')
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

    const { email, password } = req.body;

    // 查找用户（包含密码字段）
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 检查账户状态
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: '账户已被禁用'
      });
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 更新登录信息
    await user.updateLoginInfo();

    // 生成认证令牌
    const token = user.generateAuthToken();

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          profile: user.profile,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin
        },
        token
      }
    });

  } catch (error) {
    console.error('用户登录失败:', error);
    res.status(500).json({
      success: false,
      message: '登录失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 获取当前用户信息
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '需要认证'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: '用户不存在或已被禁用'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          profile: user.profile,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin,
          preferences: user.preferences
        }
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '无效的认证令牌'
      });
    }

    console.error('获取用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 更新用户信息
router.put('/me', [
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
    .withMessage('网站URL格式不正确'),
  body('preferences.theme')
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage('主题必须是 light, dark 或 auto'),
  body('preferences.language')
    .optional()
    .isLength({ min: 2, max: 10 })
    .withMessage('语言代码长度必须在2-10个字符之间')
], async (req, res) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '需要认证'
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

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: '用户不存在或已被禁用'
      });
    }

    // 更新用户信息
    const allowedUpdates = ['profile', 'preferences', 'avatar'];
    allowedUpdates.forEach(field => {
      if (req.body[field]) {
        user[field] = { ...user[field], ...req.body[field] };
      }
    });

    await user.save();

    // 清除相关缓存
    await cache.delPattern(`user:${user._id}:*`);

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
          preferences: user.preferences
        }
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '无效的认证令牌'
      });
    }

    console.error('更新用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '更新用户信息失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 修改密码
router.put('/password', authRateLimit, [
  body('currentPassword')
    .notEmpty()
    .withMessage('当前密码不能为空'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('新密码至少6个字符')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('新密码必须包含至少一个小写字母、一个大写字母和一个数字'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('确认密码与新密码不匹配');
      }
      return true;
    })
], async (req, res) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '需要认证'
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

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('+password');

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: '用户不存在或已被禁用'
      });
    }

    const { currentPassword, newPassword } = req.body;

    // 验证当前密码
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: '当前密码错误'
      });
    }

    // 更新密码
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: '密码修改成功'
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '无效的认证令牌'
      });
    }

    console.error('修改密码失败:', error);
    res.status(500).json({
      success: false,
      message: '修改密码失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 请求密码重置
router.post('/forgot-password', authRateLimit, [
  body('email')
    .isEmail()
    .withMessage('邮箱格式不正确')
    .normalizeEmail()
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

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // 为了安全，不透露用户是否存在
      return res.json({
        success: true,
        message: '如果邮箱存在，密码重置链接已发送'
      });
    }

    // 生成密码重置令牌
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // 这里应该发送邮件，暂时只返回令牌（生产环境中不应该这样做）
    res.json({
      success: true,
      message: '密码重置链接已发送到您的邮箱',
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    });

  } catch (error) {
    console.error('请求密码重置失败:', error);
    res.status(500).json({
      success: false,
      message: '请求密码重置失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 重置密码
router.post('/reset-password', authRateLimit, [
  body('token')
    .notEmpty()
    .withMessage('重置令牌不能为空'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('新密码至少6个字符')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('新密码必须包含至少一个小写字母、一个大写字母和一个数字'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('确认密码与新密码不匹配');
      }
      return true;
    })
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

    const { token, newPassword } = req.body;

    // 验证令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'password-reset') {
      return res.status(400).json({
        success: false,
        message: '无效的重置令牌'
      });
    }

    const user = await User.findOne({
      _id: decoded.userId,
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: '重置令牌无效或已过期'
      });
    }

    // 更新密码
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: '密码重置成功'
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({
        success: false,
        message: '无效的重置令牌'
      });
    }

    console.error('重置密码失败:', error);
    res.status(500).json({
      success: false,
      message: '重置密码失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
    });
  }
});

// 登出（客户端处理，这里只是返回成功）
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: '登出成功'
  });
});

module.exports = router;
