const mongoose = require('mongoose');
const slugify = require('slugify');

// SEO子模式
const seoSchema = new mongoose.Schema({
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
  }],
  canonicalUrl: {
    type: String,
    trim: true
  },
  ogTitle: {
    type: String,
    maxlength: 60,
    trim: true
  },
  ogDescription: {
    type: String,
    maxlength: 160,
    trim: true
  },
  ogImage: {
    type: String,
    trim: true
  },
  twitterCard: {
    type: String,
    enum: ['summary', 'summary_large_image', 'app', 'player'],
    default: 'summary_large_image'
  }
}, { _id: false });

// 统计数据子模式
const statsSchema = new mongoose.Schema({
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  }
}, { _id: false });

// 文章模式
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '文章标题不能为空'],
    maxlength: [200, '文章标题不能超过200个字符'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: [true, '文章摘要不能为空'],
    maxlength: [500, '文章摘要不能超过500个字符'],
    trim: true
  },
  content: {
    type: String,
    required: [true, '文章内容不能为空'],
    trim: true
  },
  htmlContent: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, '文章分类不能为空'],
    enum: {
      values: ['tech', 'finance', 'policy', 'research', 'industry'],
      message: '分类必须是: tech, finance, policy, research, industry 之一'
    }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }],
  author: {
    type: String,
    required: [true, '作者不能为空'],
    trim: true
  },
  source: {
    type: String,
    required: [true, '内容来源不能为空'],
    enum: {
      values: ['manual', 'twitter', 'rss', 'news', 'api'],
      message: '来源必须是: manual, twitter, rss, news, api 之一'
    }
  },
  sourceUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (this.source === 'manual') return true;
        return /^https?:\/\/.+/.test(v);
      },
      message: '来源URL格式不正确'
    }
  },
  featuredImage: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    trim: true
  }],
  publishTime: {
    type: Date,
    default: Date.now
  },
  updateTime: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: {
      values: ['draft', 'published', 'archived'],
      message: '状态必须是: draft, published, archived 之一'
    },
    default: 'draft'
  },
  seo: {
    type: seoSchema,
    default: {}
  },
  stats: {
    type: statsSchema,
    default: {}
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  readingTime: {
    type: Number,
    default: 0
  },
  wordCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 虚拟字段：完整URL
articleSchema.virtual('url').get(function() {
  return `/article/${this.slug}`;
});

// 虚拟字段：阅读时间（分钟）
articleSchema.virtual('readingTimeMinutes').get(function() {
  return Math.ceil(this.readingTime / 60);
});

// 索引
articleSchema.index({ slug: 1 });
articleSchema.index({ category: 1, publishTime: -1 });
articleSchema.index({ status: 1, publishTime: -1 });
articleSchema.index({ tags: 1 });
articleSchema.index({ source: 1, publishTime: -1 });
articleSchema.index({ isFeatured: 1, publishTime: -1 });
articleSchema.index({ 
  'seo.metaTitle': 'text', 
  'seo.metaDescription': 'text', 
  title: 'text', 
  excerpt: 'text',
  content: 'text'
});

// 中间件：保存前处理
articleSchema.pre('save', function(next) {
  // 生成slug
  if (this.isModified('title') && !this.slug) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }

  // 更新修改时间
  if (this.isModified() && !this.isNew) {
    this.updateTime = new Date();
  }

  // 计算阅读时间（假设每分钟200字）
  if (this.isModified('content')) {
    this.wordCount = this.content.length;
    this.readingTime = Math.ceil(this.wordCount / 200);
  }

  // 生成HTML内容（如果内容包含Markdown）
  if (this.isModified('content') && this.content.includes('##')) {
    const { marked } = require('marked');
    const { JSDOM } = require('jsdom');
    const createDOMPurify = require('dompurify');
    
    const window = new JSDOM('').window;
    const DOMPurify = createDOMPurify(window);
    
    const html = marked(this.content);
    this.htmlContent = DOMPurify.sanitize(html);
  } else {
    this.htmlContent = this.content;
  }

  next();
});

// 中间件：保存后处理
articleSchema.post('save', function(doc) {
  // 清除相关缓存
  const { cache } = require('../config/database');
  cache.delPattern('articles:*');
  cache.delPattern(`article:${doc._id}:*`);
  cache.delPattern(`category:${doc.category}:*`);
});

// 静态方法：获取已发布文章
articleSchema.statics.getPublished = function(filters = {}) {
  return this.find({ 
    status: 'published', 
    publishTime: { $lte: new Date() },
    ...filters 
  });
};

// 静态方法：搜索文章
articleSchema.statics.search = function(query, options = {}) {
  const {
    category,
    tags,
    source,
    startDate,
    endDate,
    page = 1,
    limit = 10,
    sort = { publishTime: -1 }
  } = options;

  const searchQuery = {
    status: 'published',
    $text: { $search: query }
  };

  if (category) searchQuery.category = category;
  if (tags && tags.length > 0) searchQuery.tags = { $in: tags };
  if (source) searchQuery.source = source;
  if (startDate || endDate) {
    searchQuery.publishTime = {};
    if (startDate) searchQuery.publishTime.$gte = new Date(startDate);
    if (endDate) searchQuery.publishTime.$lte = new Date(endDate);
  }

  return this.find(searchQuery)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('category', 'name slug');
};

// 实例方法：增加浏览量
articleSchema.methods.incrementViews = function() {
  this.stats.views += 1;
  return this.save();
};

// 实例方法：增加点赞数
articleSchema.methods.incrementLikes = function() {
  this.stats.likes += 1;
  return this.save();
};

// 实例方法：增加分享数
articleSchema.methods.incrementShares = function() {
  this.stats.shares += 1;
  return this.save();
};

// 实例方法：生成SEO数据
articleSchema.methods.generateSEO = function() {
  if (!this.seo.metaTitle) {
    this.seo.metaTitle = this.title;
  }
  if (!this.seo.metaDescription) {
    this.seo.metaDescription = this.excerpt;
  }
  if (!this.seo.canonicalUrl) {
    this.seo.canonicalUrl = `https://techfinx.top/article/${this.slug}`;
  }
  if (!this.seo.ogTitle) {
    this.seo.ogTitle = this.title;
  }
  if (!this.seo.ogDescription) {
    this.seo.ogDescription = this.excerpt;
  }
  if (!this.seo.ogImage) {
    this.seo.ogImage = this.featuredImage;
  }
  return this.save();
};

module.exports = mongoose.model('Article', articleSchema);
