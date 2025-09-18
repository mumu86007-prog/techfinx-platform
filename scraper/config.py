"""
TechfinX Content Scraper Configuration
内容抓取系统配置
"""

import os
from typing import Dict, List, Optional
from dataclasses import dataclass
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

@dataclass
class DatabaseConfig:
    """数据库配置"""
    mongodb_uri: str = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/techfinx')
    redis_url: str = os.getenv('REDIS_URL', 'redis://localhost:6379')
    database_name: str = 'techfinx'

@dataclass
class APIConfig:
    """API配置"""
    base_url: str = os.getenv('API_BASE_URL', 'http://localhost:8000/api')
    api_key: str = os.getenv('SCRAPER_API_KEY', '')
    timeout: int = 30

@dataclass
class TwitterConfig:
    """Twitter配置"""
    api_key: str = os.getenv('TWITTER_API_KEY', '')
    api_secret: str = os.getenv('TWITTER_API_SECRET', '')
    access_token: str = os.getenv('TWITTER_ACCESS_TOKEN', '')
    access_secret: str = os.getenv('TWITTER_ACCESS_SECRET', '')
    bearer_token: str = os.getenv('TWITTER_BEARER_TOKEN', '')
    keywords: List[str] = None
    max_tweets: int = 50
    rate_limit: int = 300  # 5分钟

    def __post_init__(self):
        if self.keywords is None:
            self.keywords = [
                '#AI', '#FinTech', '#TechFinX', '#Blockchain', '#Crypto',
                '#MachineLearning', '#DeepLearning', '#NLP', '#ComputerVision',
                '#ArtificialIntelligence', '#DataScience', '#BigData'
            ]

@dataclass
class RSSConfig:
    """RSS配置"""
    feeds: List[str] = None
    max_articles: int = 100
    rate_limit: int = 600  # 10分钟

    def __post_init__(self):
        if self.feeds is None:
            self.feeds = [
                'https://feeds.feedburner.com/oreilly/radar',
                'https://techcrunch.com/feed/',
                'https://www.ft.com/rss/home',
                'https://feeds.finance.yahoo.com/rss/2.0/headline',
                'https://cointelegraph.com/rss',
                'https://www.coindesk.com/arc/outboundfeeds/rss/',
                'https://feeds.feedburner.com/venturebeat/SZYF',
                'https://feeds.feedburner.com/oreilly/radar',
                'https://feeds.feedburner.com/techcrunch/startups',
                'https://feeds.feedburner.com/techcrunch/fundings-exits'
            ]

@dataclass
class NewsConfig:
    """Google News配置"""
    api_key: str = os.getenv('GOOGLE_NEWS_API_KEY', '')
    keywords: List[str] = None
    language: str = 'en'
    country: str = 'us'
    max_articles: int = 50
    rate_limit: int = 1800  # 30分钟

    def __post_init__(self):
        if self.keywords is None:
            self.keywords = [
                'artificial intelligence', 'fintech', 'blockchain', 'cryptocurrency',
                'machine learning', 'deep learning', 'neural networks', 'data science',
                'quantum computing', 'robotics', 'automation', 'digital transformation'
            ]

@dataclass
class ContentConfig:
    """内容处理配置"""
    min_content_length: int = 100
    max_content_length: int = 10000
    duplicate_threshold: float = 0.8
    auto_publish: bool = False
    content_filter: bool = True
    language_detection: bool = True
    image_download: bool = True
    max_images: int = 5

@dataclass
class ScraperConfig:
    """抓取器配置"""
    enabled_sources: List[str] = None
    run_interval: int = 30  # 分钟
    max_workers: int = 4
    retry_attempts: int = 3
    retry_delay: int = 5  # 秒

    def __post_init__(self):
        if self.enabled_sources is None:
            self.enabled_sources = ['twitter', 'rss', 'news']

@dataclass
class LoggingConfig:
    """日志配置"""
    level: str = os.getenv('LOG_LEVEL', 'INFO')
    file_path: str = os.getenv('LOG_FILE', './logs/scraper.log')
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    backup_count: int = 5
    format: str = '{time:YYYY-MM-DD HH:mm:ss} | {level} | {name}:{function}:{line} | {message}'

@dataclass
class MonitoringConfig:
    """监控配置"""
    sentry_dsn: str = os.getenv('SENTRY_DSN', '')
    enable_metrics: bool = True
    metrics_port: int = 9090

# 全局配置实例
database_config = DatabaseConfig()
api_config = APIConfig()
twitter_config = TwitterConfig()
rss_config = RSSConfig()
news_config = NewsConfig()
content_config = ContentConfig()
scraper_config = ScraperConfig()
logging_config = LoggingConfig()
monitoring_config = MonitoringConfig()

# 分类映射
CATEGORY_MAPPING = {
    'tech': ['ai', 'artificial intelligence', 'machine learning', 'deep learning', 'neural networks', 'computer vision', 'nlp', 'data science'],
    'finance': ['fintech', 'blockchain', 'cryptocurrency', 'bitcoin', 'ethereum', 'defi', 'nft', 'trading', 'investment'],
    'policy': ['regulation', 'policy', 'government', 'legal', 'compliance', 'privacy', 'security', 'gdpr'],
    'research': ['research', 'study', 'paper', 'academic', 'university', 'scientific', 'innovation'],
    'industry': ['industry', 'business', 'startup', 'enterprise', 'corporate', 'market', 'economy', 'growth']
}

# 关键词权重
KEYWORD_WEIGHTS = {
    'artificial intelligence': 10,
    'machine learning': 9,
    'deep learning': 9,
    'fintech': 8,
    'blockchain': 8,
    'cryptocurrency': 7,
    'neural networks': 7,
    'data science': 6,
    'quantum computing': 6,
    'robotics': 5,
    'automation': 5
}

# 内容质量评分权重
QUALITY_WEIGHTS = {
    'title_length': 0.1,
    'content_length': 0.2,
    'keyword_density': 0.2,
    'readability': 0.2,
    'image_count': 0.1,
    'link_count': 0.1,
    'freshness': 0.1
}

# 用户代理列表
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0'
]

# 请求头配置
DEFAULT_HEADERS = {
    'User-Agent': USER_AGENTS[0],
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
}

# 图片下载配置
IMAGE_CONFIG = {
    'allowed_formats': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    'max_size': 5 * 1024 * 1024,  # 5MB
    'min_size': 1024,  # 1KB
    'timeout': 30
}

# 内容过滤规则
CONTENT_FILTERS = {
    'min_title_length': 10,
    'max_title_length': 200,
    'min_content_length': 100,
    'max_content_length': 10000,
    'forbidden_words': [
        'spam', 'scam', 'fake', 'clickbait', 'advertisement',
        'promotion', 'marketing', 'sales', 'buy now'
    ],
    'required_keywords': [
        'ai', 'artificial intelligence', 'machine learning', 'fintech',
        'blockchain', 'cryptocurrency', 'technology', 'innovation'
    ]
}

# 去重配置
DEDUPLICATION_CONFIG = {
    'title_similarity_threshold': 0.8,
    'content_similarity_threshold': 0.7,
    'url_similarity_threshold': 0.9,
    'time_window_hours': 24
}

# 缓存配置
CACHE_CONFIG = {
    'default_ttl': 3600,  # 1小时
    'article_ttl': 1800,  # 30分钟
    'feed_ttl': 300,  # 5分钟
    'search_ttl': 600  # 10分钟
}

# 错误重试配置
RETRY_CONFIG = {
    'max_attempts': 3,
    'base_delay': 1,  # 秒
    'max_delay': 60,  # 秒
    'exponential_backoff': True
}

# 通知配置
NOTIFICATION_CONFIG = {
    'email_enabled': False,
    'webhook_enabled': False,
    'webhook_url': '',
    'email_recipients': []
}

def get_config() -> Dict:
    """获取完整配置"""
    return {
        'database': database_config,
        'api': api_config,
        'twitter': twitter_config,
        'rss': rss_config,
        'news': news_config,
        'content': content_config,
        'scraper': scraper_config,
        'logging': logging_config,
        'monitoring': monitoring_config
    }

def validate_config() -> bool:
    """验证配置"""
    errors = []
    
    # 检查必要的环境变量
    if not database_config.mongodb_uri:
        errors.append("MONGODB_URI is required")
    
    if not api_config.api_key:
        errors.append("SCRAPER_API_KEY is required")
    
    # 检查Twitter配置
    if 'twitter' in scraper_config.enabled_sources:
        if not twitter_config.bearer_token and not twitter_config.api_key:
            errors.append("Twitter API credentials are required")
    
    # 检查Google News配置
    if 'news' in scraper_config.enabled_sources:
        if not news_config.api_key:
            errors.append("GOOGLE_NEWS_API_KEY is required")
    
    if errors:
        print("❌ 配置验证失败:")
        for error in errors:
            print(f"   - {error}")
        return False
    
    return True

if __name__ == "__main__":
    # 验证配置
    if validate_config():
        print("✅ 配置验证通过")
    else:
        exit(1)
