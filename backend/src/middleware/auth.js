const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT认证中间件
const auth = async (req, res, next) => {
  try {
    // 获取token
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '访问被拒绝，未提供有效的认证令牌'
      });
    }

    const token = authHeader.substring(7); // 移除 'Bearer ' 前缀

    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 查找用户
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户不存在'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: '账户已被禁用'
      });
    }

    // 将用户信息添加到请求对象
    req.user = user;
    next();

  } catch (error) {
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

    console.error('认证中间件错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

// 可选认证中间件（不强制要求认证）
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // 没有token也继续执行
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (user && user.isActive) {
      req.user = user;
    }
    
    next();

  } catch (error) {
    // 可选认证失败不影响请求继续
    next();
  }
};

// 权限检查中间件
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '需要认证'
      });
    }

    if (!req.user.hasPermission(permission)) {
      return res.status(403).json({
        success: false,
        message: '权限不足'
      });
    }

    next();
  };
};

// 角色检查中间件
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '需要认证'
      });
    }

    const userRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!userRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: '角色权限不足'
      });
    }

    next();
  };
};

// 管理员权限检查
const requireAdmin = requireRole('admin');

// 编辑者权限检查
const requireEditor = requireRole(['admin', 'editor']);

// 作者权限检查
const requireAuthor = requireRole(['admin', 'editor', 'author']);

// 资源所有者检查中间件
const requireOwnership = (resourceModel, resourceIdParam = 'id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: '需要认证'
        });
      }

      const resourceId = req.params[resourceIdParam];
      const resource = await resourceModel.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: '资源不存在'
        });
      }

      // 检查是否为资源所有者或管理员
      const isOwner = resource.author === req.user.displayName || 
                     resource.userId?.toString() === req.user._id.toString();
      const isAdmin = req.user.isAdmin();

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: '只能操作自己的资源'
        });
      }

      req.resource = resource;
      next();

    } catch (error) {
      console.error('资源所有权检查错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      });
    }
  };
};

// API密钥认证中间件
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: '需要API密钥'
    });
  }

  // 验证API密钥（这里应该从数据库或环境变量中验证）
  const validApiKeys = process.env.API_KEYS?.split(',') || [];
  
  if (!validApiKeys.includes(apiKey)) {
    return res.status(401).json({
      success: false,
      message: '无效的API密钥'
    });
  }

  next();
};

// 速率限制中间件
const createRateLimit = (windowMs, max, message) => {
  const rateLimit = require('express-rate-limit');
  
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || '请求过于频繁，请稍后再试'
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

// 不同级别的速率限制
const strictRateLimit = createRateLimit(15 * 60 * 1000, 10, '请求过于频繁，请15分钟后再试');
const normalRateLimit = createRateLimit(15 * 60 * 1000, 100, '请求过于频繁，请稍后再试');
const looseRateLimit = createRateLimit(15 * 60 * 1000, 1000, '请求过于频繁，请稍后再试');

module.exports = {
  auth,
  optionalAuth,
  requirePermission,
  requireRole,
  requireAdmin,
  requireEditor,
  requireAuthor,
  requireOwnership,
  apiKeyAuth,
  createRateLimit,
  strictRateLimit,
  normalRateLimit,
  looseRateLimit
};
