// 小虎AI前沿动态页面 - JavaScript功能实现

// 模拟数据
const mockArticles = [
  {
    id: 1,
    title: "OpenAI发布GPT-4.5：多模态能力大幅提升",
    excerpt: "OpenAI最新发布的GPT-4.5在图像理解、代码生成和推理能力方面都有显著提升，特别是在处理复杂多步骤任务时表现更加出色。",
    category: "tech",
    categoryName: "技术动态",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop",
    author: "AI研究员",
    publishTime: "2小时前",
    readTime: "5分钟阅读",
    views: 1234
  },
  {
    id: 2,
    title: "谷歌DeepMind发布Gemini 2.0：超越人类专家水平",
    excerpt: "Gemini 2.0在数学、物理、化学等多个学科领域达到了人类专家水平，标志着AI在科学推理方面取得了重大突破。",
    category: "tech",
    categoryName: "技术动态",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop",
    author: "技术编辑",
    publishTime: "4小时前",
    readTime: "8分钟阅读",
    views: 2156
  },
  {
    id: 3,
    title: "微软Copilot全面升级：AI助手进入新纪元",
    excerpt: "微软宣布Copilot将在Office 365、Windows 11和Edge浏览器中全面升级，提供更智能的办公体验和个性化服务。",
    category: "industry",
    categoryName: "行业资讯",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop",
    author: "行业分析师",
    publishTime: "6小时前",
    readTime: "6分钟阅读",
    views: 1890
  },
  {
    id: 4,
    title: "斯坦福大学发布AI安全研究报告",
    excerpt: "斯坦福大学AI安全中心发布最新研究报告，深入分析了当前AI系统的安全风险和防护措施，为AI安全发展提供重要指导。",
    category: "research",
    categoryName: "研究报告",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop",
    author: "研究团队",
    publishTime: "1天前",
    readTime: "12分钟阅读",
    views: 3456
  },
  {
    id: 5,
    title: "欧盟AI法案正式生效：全球AI治理新标准",
    excerpt: "欧盟AI法案正式生效，成为全球首个全面的AI监管框架，将对全球AI产业发展产生深远影响。",
    category: "policy",
    categoryName: "政策法规",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop",
    author: "政策专家",
    publishTime: "2天前",
    readTime: "10分钟阅读",
    views: 4567
  },
  {
    id: 6,
    title: "特斯拉FSD Beta 12.0：完全自动驾驶即将到来",
    excerpt: "特斯拉发布FSD Beta 12.0版本，在神经网络架构和决策算法方面都有重大改进，向完全自动驾驶又迈进了一步。",
    category: "tech",
    categoryName: "技术动态",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop",
    author: "汽车科技",
    publishTime: "3天前",
    readTime: "7分钟阅读",
    views: 6789
  },
  {
    id: 7,
    title: "百度文心一言4.0：中文大模型新标杆",
    excerpt: "百度发布文心一言4.0版本，在中文理解和生成能力方面达到新的高度，为中文AI应用树立了新的标杆。",
    category: "industry",
    categoryName: "行业资讯",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop",
    author: "AI观察",
    publishTime: "4天前",
    readTime: "6分钟阅读",
    views: 2345
  },
  {
    id: 8,
    title: "MIT研究：AI在医疗诊断中的准确率超过人类医生",
    excerpt: "麻省理工学院最新研究显示，AI系统在多种疾病的诊断准确率已经超过人类医生，为医疗AI应用提供了有力证据。",
    category: "research",
    categoryName: "研究报告",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop",
    author: "医疗AI",
    publishTime: "5天前",
    readTime: "9分钟阅读",
    views: 5678
  }
];

// 全局状态
let currentCategory = 'all';
let currentPage = 1;
let articlesPerPage = 6;
let currentSlide = 0;
let slideInterval;

// DOM元素
const articlesGrid = document.getElementById('articlesGrid');
const categoryTabs = document.querySelectorAll('.category-tab');
const heroSlides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.indicator');
const searchInput = document.querySelector('.search-input');
const pagination = document.querySelector('.pagination');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  initializePage();
  setupEventListeners();
  startCarousel();
});

// 页面初始化
function initializePage() {
  renderArticles();
  updatePagination();
}

// 设置事件监听器
function setupEventListeners() {
  // 分类标签点击
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const category = this.dataset.category;
      setActiveCategory(category);
      filterArticles(category);
    });
  });

  // 轮播指示器点击
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', function() {
      goToSlide(index);
    });
  });

  // 搜索功能
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    searchArticles(searchTerm);
  });

  // 分页按钮
  const prevButton = document.querySelector('.pagination-button.prev');
  const nextButton = document.querySelector('.pagination-button.next');
  const pageNumbers = document.querySelectorAll('.pagination-number');

  if (prevButton) {
    prevButton.addEventListener('click', function() {
      if (currentPage > 1) {
        currentPage--;
        renderArticles();
        updatePagination();
      }
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', function() {
      const totalPages = Math.ceil(getFilteredArticles().length / articlesPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderArticles();
        updatePagination();
      }
    });
  }

  pageNumbers.forEach((number, index) => {
    number.addEventListener('click', function() {
      if (!this.classList.contains('pagination-ellipsis')) {
        currentPage = parseInt(this.textContent);
        renderArticles();
        updatePagination();
      }
    });
  });

  // 文章卡片点击
  articlesGrid.addEventListener('click', function(e) {
    const articleCard = e.target.closest('.news-card');
    if (articleCard) {
      const articleId = articleCard.dataset.id;
      openArticle(articleId);
    }
  });

  // 侧边栏标签点击
  const sidebarTags = document.querySelectorAll('.sidebar-tag');
  sidebarTags.forEach(tag => {
    tag.addEventListener('click', function() {
      const tagText = this.textContent;
      searchInput.value = tagText;
      searchArticles(tagText.toLowerCase());
    });
  });
}

// 设置活跃分类
function setActiveCategory(category) {
  categoryTabs.forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.category === category) {
      tab.classList.add('active');
    }
  });
  currentCategory = category;
  currentPage = 1;
}

// 获取过滤后的文章
function getFilteredArticles() {
  if (currentCategory === 'all') {
    return mockArticles;
  }
  return mockArticles.filter(article => article.category === currentCategory);
}

// 过滤文章
function filterArticles(category) {
  currentCategory = category;
  currentPage = 1;
  renderArticles();
  updatePagination();
}

// 搜索文章
function searchArticles(searchTerm) {
  if (searchTerm === '') {
    filterArticles(currentCategory);
    return;
  }

  const filteredArticles = mockArticles.filter(article => 
    article.title.toLowerCase().includes(searchTerm) ||
    article.excerpt.toLowerCase().includes(searchTerm) ||
    article.categoryName.toLowerCase().includes(searchTerm)
  );

  renderArticles(filteredArticles);
  updatePagination(filteredArticles);
}

// 渲染文章列表
function renderArticles(articles = null) {
  const articlesToRender = articles || getFilteredArticles();
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const pageArticles = articlesToRender.slice(startIndex, endIndex);

  articlesGrid.innerHTML = '';

  if (pageArticles.length === 0) {
    articlesGrid.innerHTML = `
      <div class="no-articles">
        <div class="no-articles-icon">🔍</div>
        <h3>暂无相关文章</h3>
        <p>请尝试其他搜索词或分类</p>
      </div>
    `;
    return;
  }

  pageArticles.forEach(article => {
    const articleCard = createArticleCard(article);
    articlesGrid.appendChild(articleCard);
  });
}

// 创建文章卡片
function createArticleCard(article) {
  const card = document.createElement('div');
  card.className = 'news-card';
  card.dataset.id = article.id;

  card.innerHTML = `
    <div class="news-card-image" style="background-image: url('${article.image}')"></div>
    <div class="news-card-content">
      <div class="news-card-category">${article.categoryName}</div>
      <h3 class="news-card-title">${article.title}</h3>
      <p class="news-card-excerpt">${article.excerpt}</p>
      <div class="news-card-meta">
        <span class="news-card-author">${article.author}</span>
        <span class="news-card-time">${article.publishTime}</span>
        <span class="news-card-read-time">${article.readTime}</span>
        <span class="news-card-views">${article.views} 阅读</span>
      </div>
    </div>
  `;

  return card;
}

// 更新分页
function updatePagination(articles = null) {
  const articlesToPaginate = articles || getFilteredArticles();
  const totalPages = Math.ceil(articlesToPaginate.length / articlesPerPage);
  
  const prevButton = document.querySelector('.pagination-button.prev');
  const nextButton = document.querySelector('.pagination-button.next');
  const pageNumbers = document.querySelector('.pagination-numbers');

  if (prevButton) {
    prevButton.disabled = currentPage === 1;
  }

  if (nextButton) {
    nextButton.disabled = currentPage === totalPages;
  }

  if (pageNumbers) {
    pageNumbers.innerHTML = '';
    
    // 显示页码逻辑
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 添加第一页和省略号
    if (startPage > 1) {
      addPageNumber(1);
      if (startPage > 2) {
        addEllipsis();
      }
    }

    // 添加中间页码
    for (let i = startPage; i <= endPage; i++) {
      addPageNumber(i);
    }

    // 添加省略号和最后一页
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        addEllipsis();
      }
      addPageNumber(totalPages);
    }
  }
}

// 添加页码
function addPageNumber(pageNumber) {
  const pageNumbers = document.querySelector('.pagination-numbers');
  const button = document.createElement('button');
  button.className = `pagination-number ${pageNumber === currentPage ? 'active' : ''}`;
  button.textContent = pageNumber;
  button.addEventListener('click', function() {
    currentPage = pageNumber;
    renderArticles();
    updatePagination();
  });
  pageNumbers.appendChild(button);
}

// 添加省略号
function addEllipsis() {
  const pageNumbers = document.querySelector('.pagination-numbers');
  const ellipsis = document.createElement('span');
  ellipsis.className = 'pagination-ellipsis';
  ellipsis.textContent = '...';
  pageNumbers.appendChild(ellipsis);
}

// 轮播功能
function startCarousel() {
  slideInterval = setInterval(() => {
    nextSlide();
  }, 5000);
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % heroSlides.length;
  updateSlide();
}

function goToSlide(slideIndex) {
  currentSlide = slideIndex;
  updateSlide();
  clearInterval(slideInterval);
  startCarousel();
}

function updateSlide() {
  heroSlides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentSlide);
  });
  
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentSlide);
  });
}

// 打开文章详情
function openArticle(articleId) {
  const article = mockArticles.find(a => a.id == articleId);
  if (article) {
    // 这里可以实现文章详情页面的逻辑
    console.log('打开文章:', article.title);
    // 可以跳转到详情页面或打开模态框
    alert(`正在打开文章: ${article.title}`);
  }
}

// 工具函数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 搜索防抖
const debouncedSearch = debounce(searchArticles, 300);
searchInput.addEventListener('input', function() {
  const searchTerm = this.value.toLowerCase();
  debouncedSearch(searchTerm);
});

// 页面滚动效果
window.addEventListener('scroll', function() {
  const header = document.querySelector('.header');
  if (window.scrollY > 100) {
    header.style.background = 'rgba(255, 255, 255, 0.95)';
    header.style.backdropFilter = 'blur(20px)';
  } else {
    header.style.background = 'var(--primary-white)';
    header.style.backdropFilter = 'blur(20px)';
  }
});

// 懒加载图片
function lazyLoadImages() {
  const images = document.querySelectorAll('.news-card-image');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.opacity = '1';
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    imageObserver.observe(img);
  });
}

// 初始化懒加载
document.addEventListener('DOMContentLoaded', function() {
  lazyLoadImages();
});

// 错误处理
window.addEventListener('error', function(e) {
  console.error('页面错误:', e.error);
});

// 性能监控
window.addEventListener('load', function() {
  const loadTime = performance.now();
  console.log(`页面加载时间: ${loadTime.toFixed(2)}ms`);
});

// 导出功能（如果需要）
window.XiaoHuAI = {
  filterArticles,
  searchArticles,
  goToSlide,
  openArticle
};
