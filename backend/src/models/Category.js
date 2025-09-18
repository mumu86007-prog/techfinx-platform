const mongoose = require('mongoose');
const slugify = require('slugify');

// 分类模式
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '分类名称不能为空'],
    maxlength: [50, '分类名称不能超过50个字符'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [200, '分类描述不能超过200个字符'],
    trim: true
  },
  color: {
    type: String,
    default: '#3B82F6',
    validate: {
      validator: function(v) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
      },
      message: '颜色格式不正确，应为十六进制颜色代码'
    }
  },
  icon: {
    type: String,
    default: '📁',
    maxlength: 10
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  articleCount: {
    type: Number,
    default: 0
  },
  seo: {
    metaTitle: {
      type: String,
      maxlength: 60,
      trim: true
    },
    metaDescription: {
      type: String,
      maxlength: 160,
      trim: true
    },
    keywords: [{
      type: String,
      trim: true
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 虚拟字段：子分类
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentId'
});

// 虚拟字段：父分类
categorySchema.virtual('parent', {
  ref: 'Category',
  localField: 'parentId',
  foreignField: '_id',
  justOne: true
});

// 虚拟字段：完整URL
categorySchema.virtual('url').get(function() {
  return `/category/${this.slug}`;
});

// 索引
categorySchema.index({ slug: 1 });
categorySchema.index({ parentId: 1, sortOrder: 1 });
categorySchema.index({ isActive: 1, sortOrder: 1 });

// 中间件：保存前处理
categorySchema.pre('save', function(next) {
  // 生成slug
  if (this.isModified('name') && !this.slug) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }

  next();
});

// 中间件：保存后处理
categorySchema.post('save', function(doc) {
  // 清除相关缓存
  const { cache } = require('../config/database');
  cache.delPattern('categories:*');
  cache.delPattern(`category:${doc._id}:*`);
});

// 中间件：删除前处理
categorySchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  // 检查是否有子分类
  const children = await this.constructor.find({ parentId: this._id });
  if (children.length > 0) {
    const error = new Error('无法删除包含子分类的分类');
    error.statusCode = 400;
    return next(error);
  }

  // 检查是否有文章使用此分类
  const Article = mongoose.model('Article');
  const articles = await Article.find({ category: this.slug });
  if (articles.length > 0) {
    const error = new Error('无法删除包含文章的分类');
    error.statusCode = 400;
    return next(error);
  }

  next();
});

// 静态方法：获取所有活跃分类
categorySchema.statics.getActive = function() {
  return this.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
};

// 静态方法：获取分类树
categorySchema.statics.getTree = async function() {
  const categories = await this.find({ isActive: true })
    .populate('parent', 'name slug')
    .sort({ sortOrder: 1, name: 1 });

  const categoryMap = new Map();
  const rootCategories = [];

  // 创建分类映射
  categories.forEach(category => {
    categoryMap.set(category._id.toString(), {
      ...category.toObject(),
      children: []
    });
  });

  // 构建分类树
  categories.forEach(category => {
    const categoryObj = categoryMap.get(category._id.toString());
    
    if (category.parentId) {
      const parent = categoryMap.get(category.parentId.toString());
      if (parent) {
        parent.children.push(categoryObj);
      }
    } else {
      rootCategories.push(categoryObj);
    }
  });

  return rootCategories;
};

// 静态方法：更新文章计数
categorySchema.statics.updateArticleCount = async function(categorySlug) {
  const Article = mongoose.model('Article');
  const count = await Article.countDocuments({ 
    category: categorySlug, 
    status: 'published' 
  });
  
  await this.updateOne(
    { slug: categorySlug },
    { articleCount: count }
  );
};

// 实例方法：更新文章计数
categorySchema.methods.updateArticleCount = async function() {
  const Article = mongoose.model('Article');
  const count = await Article.countDocuments({ 
    category: this.slug, 
    status: 'published' 
  });
  
  this.articleCount = count;
  return this.save();
};

// 实例方法：获取子分类
categorySchema.methods.getChildren = function() {
  return this.constructor.find({ 
    parentId: this._id, 
    isActive: true 
  }).sort({ sortOrder: 1, name: 1 });
};

// 实例方法：获取父分类
categorySchema.methods.getParent = function() {
  if (!this.parentId) return null;
  return this.constructor.findById(this.parentId);
};

// 实例方法：获取所有祖先分类
categorySchema.methods.getAncestors = async function() {
  const ancestors = [];
  let current = this;
  
  while (current.parentId) {
    current = await this.constructor.findById(current.parentId);
    if (current) {
      ancestors.unshift(current);
    } else {
      break;
    }
  }
  
  return ancestors;
};

// 实例方法：获取所有后代分类
categorySchema.methods.getDescendants = async function() {
  const descendants = [];
  
  const findDescendants = async (parentId) => {
    const children = await this.constructor.find({ 
      parentId: parentId, 
      isActive: true 
    });
    
    for (const child of children) {
      descendants.push(child);
      await findDescendants(child._id);
    }
  };
  
  await findDescendants(this._id);
  return descendants;
};

module.exports = mongoose.model('Category', categorySchema);
