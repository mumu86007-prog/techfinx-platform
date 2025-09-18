const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 用户模式
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '用户名不能为空'],
    unique: true,
    maxlength: [30, '用户名不能超过30个字符'],
    minlength: [3, '用户名至少3个字符'],
    trim: true,
    match: [/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线']
  },
  email: {
    type: String,
    required: [true, '邮箱不能为空'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '邮箱格式不正确']
  },
  password: {
    type: String,
    required: [true, '密码不能为空'],
    minlength: [6, '密码至少6个字符'],
    select: false // 默认查询时不返回密码
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'editor', 'author', 'viewer'],
      message: '角色必须是: admin, editor, author, viewer 之一'
    },
    default: 'author'
  },
  avatar: {
    type: String,
    default: null
  },
  profile: {
    firstName: {
      type: String,
      trim: true,
      maxlength: [30, '名字不能超过30个字符']
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [30, '姓氏不能超过30个字符']
    },
    bio: {
      type: String,
      maxlength: [500, '个人简介不能超过500个字符'],
      trim: true
    },
    website: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true;
          return /^https?:\/\/.+/.test(v);
        },
        message: '网站URL格式不正确'
      }
    },
    social: {
      twitter: {
        type: String,
        trim: true
      },
      linkedin: {
        type: String,
        trim: true
      },
      github: {
        type: String,
        trim: true
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginCount: {
    type: Number,
    default: 0
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    language: {
      type: String,
      default: 'zh-CN'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: false
      }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 虚拟字段：全名
userSchema.virtual('fullName').get(function() {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.username;
});

// 虚拟字段：显示名称
userSchema.virtual('displayName').get(function() {
  return this.fullName || this.username;
});

// 索引
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ lastLogin: -1 });

// 中间件：保存前处理
userSchema.pre('save', async function(next) {
  // 密码加密
  if (this.isModified('password')) {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  // 生成邮箱验证令牌
  if (this.isNew && !this.emailVerificationToken) {
    this.emailVerificationToken = jwt.sign(
      { userId: this._id, email: this.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  next();
});

// 中间件：保存后处理
userSchema.post('save', function(doc) {
  // 清除相关缓存
  const { cache } = require('../config/database');
  cache.delPattern('users:*');
  cache.delPattern(`user:${doc._id}:*`);
});

// 实例方法：验证密码
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 实例方法：生成JWT令牌
userSchema.methods.generateAuthToken = function() {
  const payload = {
    userId: this._id,
    email: this.email,
    username: this.username,
    role: this.role
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// 实例方法：生成密码重置令牌
userSchema.methods.generatePasswordResetToken = function() {
  const resetToken = jwt.sign(
    { userId: this._id, type: 'password-reset' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  this.passwordResetToken = resetToken;
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1小时后过期

  return resetToken;
};

// 实例方法：生成邮箱验证令牌
userSchema.methods.generateEmailVerificationToken = function() {
  const token = jwt.sign(
    { userId: this._id, email: this.email, type: 'email-verification' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  this.emailVerificationToken = token;
  return token;
};

// 实例方法：更新登录信息
userSchema.methods.updateLoginInfo = function() {
  this.lastLogin = new Date();
  this.loginCount += 1;
  return this.save();
};

// 实例方法：检查权限
userSchema.methods.hasPermission = function(permission) {
  const rolePermissions = {
    admin: ['read', 'write', 'delete', 'manage_users', 'manage_settings'],
    editor: ['read', 'write', 'delete'],
    author: ['read', 'write'],
    viewer: ['read']
  };

  return rolePermissions[this.role]?.includes(permission) || false;
};

// 实例方法：检查是否为管理员
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// 实例方法：检查是否为编辑者
userSchema.methods.isEditor = function() {
  return ['admin', 'editor'].includes(this.role);
};

// 实例方法：检查是否为作者
userSchema.methods.isAuthor = function() {
  return ['admin', 'editor', 'author'].includes(this.role);
};

// 静态方法：根据邮箱查找用户
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// 静态方法：根据用户名查找用户
userSchema.statics.findByUsername = function(username) {
  return this.findOne({ username });
};

// 静态方法：验证令牌
userSchema.statics.verifyToken = function(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('令牌无效或已过期');
  }
};

// 静态方法：根据令牌查找用户
userSchema.statics.findByToken = function(token) {
  const decoded = this.verifyToken(token);
  return this.findById(decoded.userId);
};

// 静态方法：获取活跃用户
userSchema.statics.getActive = function() {
  return this.find({ isActive: true }).sort({ lastLogin: -1 });
};

// 静态方法：获取用户统计
userSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        verified: {
          $sum: { $cond: [{ $eq: ['$isEmailVerified', true] }, 1, 0] }
        },
        byRole: {
          $push: {
            role: '$role',
            count: 1
          }
        }
      }
    }
  ]);

  if (stats.length === 0) {
    return {
      total: 0,
      active: 0,
      verified: 0,
      byRole: {}
    };
  }

  const result = stats[0];
  const roleStats = {};

  result.byRole.forEach(item => {
    roleStats[item.role] = (roleStats[item.role] || 0) + 1;
  });

  return {
    total: result.total,
    active: result.active,
    verified: result.verified,
    byRole: roleStats
  };
};

module.exports = mongoose.model('User', userSchema);
