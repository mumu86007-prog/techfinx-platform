"""
Base Scraper Class
基础抓取器类，所有抓取器的父类
"""

import asyncio
import hashlib
import time
from abc import ABC, abstractmethod
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import requests
from bs4 import BeautifulSoup
from loguru import logger
import redis
from pymongo import MongoClient
from dataclasses import dataclass

from config import (
    database_config, api_config, content_config, 
    CACHE_CONFIG, RETRY_CONFIG, CONTENT_FILTERS,
    DEDUPLICATION_CONFIG, DEFAULT_HEADERS
)

@dataclass
class ScrapedArticle:
    """抓取的文章数据结构"""
    title: str
    content: str
    excerpt: str
    url: str
    source: str
    category: str
    tags: List[str]
    author: str
    publish_time: datetime
    images: List[str]
    language: str = 'en'
    quality_score: float = 0.0
    raw_data: Dict = None

class BaseScraper(ABC):
    """基础抓取器类"""
    
    def __init__(self, name: str):
        self.name = name
        self.logger = logger.bind(scraper=name)
        self.session = requests.Session()
        self.session.headers.update(DEFAULT_HEADERS)
        
        # 数据库连接
        self.mongo_client = MongoClient(database_config.mongodb_uri)
        self.db = self.mongo_client[database_config.database_name]
        self.articles_collection = self.db.articles
        
        # Redis连接
        self.redis_client = redis.from_url(database_config.redis_url)
        
        # 统计信息
        self.stats = {
            'total_scraped': 0,
            'successful': 0,
            'failed': 0,
            'duplicates': 0,
            'filtered': 0,
            'last_run': None,
            'errors': []
        }
    
    @abstractmethod
    async def scrape(self, **kwargs) -> List[ScrapedArticle]:
        """抓取文章，子类必须实现"""
        pass
    
    def _make_request(self, url: str, **kwargs) -> Optional[requests.Response]:
        """发送HTTP请求，带重试机制"""
        for attempt in range(RETRY_CONFIG['max_attempts']):
            try:
                response = self.session.get(url, timeout=30, **kwargs)
                response.raise_for_status()
                return response
            except requests.exceptions.RequestException as e:
                self.logger.warning(f"请求失败 (尝试 {attempt + 1}/{RETRY_CONFIG['max_attempts']}): {e}")
                
                if attempt < RETRY_CONFIG['max_attempts'] - 1:
                    delay = RETRY_CONFIG['base_delay'] * (2 ** attempt) if RETRY_CONFIG['exponential_backoff'] else RETRY_CONFIG['base_delay']
                    delay = min(delay, RETRY_CONFIG['max_delay'])
                    time.sleep(delay)
                else:
                    self.logger.error(f"请求最终失败: {url}")
                    self.stats['errors'].append(f"Request failed: {url} - {str(e)}")
                    return None
        
        return None
    
    def _extract_text(self, html: str) -> str:
        """从HTML中提取纯文本"""
        try:
            soup = BeautifulSoup(html, 'html.parser')
            
            # 移除脚本和样式标签
            for script in soup(["script", "style"]):
                script.decompose()
            
            # 提取文本
            text = soup.get_text()
            
            # 清理文本
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = ' '.join(chunk for chunk in chunks if chunk)
            
            return text
        except Exception as e:
            self.logger.error(f"文本提取失败: {e}")
            return ""
    
    def _detect_language(self, text: str) -> str:
        """检测文本语言"""
        try:
            from langdetect import detect
            return detect(text)
        except Exception:
            return 'en'
    
    def _calculate_quality_score(self, article: ScrapedArticle) -> float:
        """计算文章质量评分"""
        score = 0.0
        
        # 标题长度评分
        title_length = len(article.title)
        if 20 <= title_length <= 100:
            score += 0.1
        elif 10 <= title_length < 20 or 100 < title_length <= 150:
            score += 0.05
        
        # 内容长度评分
        content_length = len(article.content)
        if 500 <= content_length <= 3000:
            score += 0.2
        elif 200 <= content_length < 500 or 3000 < content_length <= 5000:
            score += 0.1
        
        # 关键词密度评分
        content_lower = article.content.lower()
        keyword_count = sum(1 for keyword in CONTENT_FILTERS['required_keywords'] 
                           if keyword in content_lower)
        score += min(keyword_count * 0.05, 0.2)
        
        # 图片数量评分
        if 1 <= len(article.images) <= 5:
            score += 0.1
        elif len(article.images) > 5:
            score += 0.05
        
        # 新鲜度评分
        hours_old = (datetime.now() - article.publish_time).total_seconds() / 3600
        if hours_old <= 24:
            score += 0.1
        elif hours_old <= 72:
            score += 0.05
        
        return min(score, 1.0)
    
    def _categorize_article(self, title: str, content: str) -> str:
        """根据标题和内容分类文章"""
        text = f"{title} {content}".lower()
        
        category_scores = {}
        for category, keywords in CATEGORY_MAPPING.items():
            score = sum(1 for keyword in keywords if keyword in text)
            category_scores[category] = score
        
        # 返回得分最高的分类
        if category_scores:
            return max(category_scores, key=category_scores.get)
        
        return 'tech'  # 默认分类
    
    def _extract_tags(self, title: str, content: str) -> List[str]:
        """提取文章标签"""
        text = f"{title} {content}".lower()
        tags = []
        
        for keyword, weight in KEYWORD_WEIGHTS.items():
            if keyword in text:
                tags.append(keyword)
        
        # 限制标签数量
        return tags[:10]
    
    def _is_duplicate(self, article: ScrapedArticle) -> bool:
        """检查文章是否重复"""
        try:
            # 检查标题相似度
            existing_articles = self.articles_collection.find({
                'source': article.source,
                'publishTime': {
                    '$gte': datetime.now() - timedelta(hours=DEDUPLICATION_CONFIG['time_window_hours'])
                }
            })
            
            for existing in existing_articles:
                # 简单的相似度检查
                title_similarity = self._calculate_similarity(article.title, existing.get('title', ''))
                if title_similarity > DEDUPLICATION_CONFIG['title_similarity_threshold']:
                    return True
                
                # 检查URL
                if article.url == existing.get('sourceUrl', ''):
                    return True
            
            return False
        except Exception as e:
            self.logger.error(f"重复检查失败: {e}")
            return False
    
    def _calculate_similarity(self, text1: str, text2: str) -> float:
        """计算文本相似度"""
        try:
            from difflib import SequenceMatcher
            return SequenceMatcher(None, text1.lower(), text2.lower()).ratio()
        except Exception:
            return 0.0
    
    def _filter_content(self, article: ScrapedArticle) -> bool:
        """内容过滤"""
        # 检查标题长度
        if not (CONTENT_FILTERS['min_title_length'] <= len(article.title) <= CONTENT_FILTERS['max_title_length']):
            return False
        
        # 检查内容长度
        if not (CONTENT_FILTERS['min_content_length'] <= len(article.content) <= CONTENT_FILTERS['max_content_length']):
            return False
        
        # 检查禁用词
        text = f"{article.title} {article.content}".lower()
        for word in CONTENT_FILTERS['forbidden_words']:
            if word in text:
                return False
        
        # 检查必需关键词
        has_required_keyword = any(keyword in text for keyword in CONTENT_FILTERS['required_keywords'])
        if not has_required_keyword:
            return False
        
        return True
    
    def _save_article(self, article: ScrapedArticle) -> bool:
        """保存文章到数据库"""
        try:
            # 检查是否重复
            if self._is_duplicate(article):
                self.stats['duplicates'] += 1
                self.logger.info(f"跳过重复文章: {article.title}")
                return False
            
            # 内容过滤
            if not self._filter_content(article):
                self.stats['filtered'] += 1
                self.logger.info(f"文章被过滤: {article.title}")
                return False
            
            # 计算质量评分
            article.quality_score = self._calculate_quality_score(article)
            
            # 准备数据库文档
            doc = {
                'title': article.title,
                'slug': self._generate_slug(article.title),
                'excerpt': article.excerpt,
                'content': article.content,
                'htmlContent': article.content,  # 简化处理
                'category': article.category,
                'tags': article.tags,
                'author': article.author,
                'source': article.source,
                'sourceUrl': article.url,
                'featuredImage': article.images[0] if article.images else None,
                'images': article.images,
                'publishTime': article.publish_time,
                'updateTime': datetime.now(),
                'status': 'published' if content_config.auto_publish else 'draft',
                'seo': {
                    'metaTitle': article.title,
                    'metaDescription': article.excerpt,
                    'keywords': article.tags,
                    'canonicalUrl': article.url
                },
                'stats': {
                    'views': 0,
                    'likes': 0,
                    'shares': 0,
                    'comments': 0
                },
                'qualityScore': article.quality_score,
                'language': article.language,
                'rawData': article.raw_data
            }
            
            # 插入数据库
            result = self.articles_collection.insert_one(doc)
            
            if result.inserted_id:
                self.stats['successful'] += 1
                self.logger.info(f"文章保存成功: {article.title}")
                
                # 清除相关缓存
                self._clear_cache()
                
                return True
            else:
                self.stats['failed'] += 1
                self.logger.error(f"文章保存失败: {article.title}")
                return False
                
        except Exception as e:
            self.stats['failed'] += 1
            self.stats['errors'].append(f"Save failed: {article.title} - {str(e)}")
            self.logger.error(f"保存文章失败: {e}")
            return False
    
    def _generate_slug(self, title: str) -> str:
        """生成URL友好的slug"""
        import re
        import unicodedata
        
        # 转换为小写
        slug = title.lower()
        
        # 移除特殊字符
        slug = re.sub(r'[^\w\s-]', '', slug)
        
        # 替换空格为连字符
        slug = re.sub(r'[-\s]+', '-', slug)
        
        # 移除首尾连字符
        slug = slug.strip('-')
        
        # 限制长度
        slug = slug[:50]
        
        return slug
    
    def _clear_cache(self):
        """清除相关缓存"""
        try:
            # 清除文章相关缓存
            pattern = f"articles:*"
            keys = self.redis_client.keys(pattern)
            if keys:
                self.redis_client.delete(*keys)
            
            # 清除分类相关缓存
            pattern = f"category:*"
            keys = self.redis_client.keys(pattern)
            if keys:
                self.redis_client.delete(*keys)
            
            # 清除搜索相关缓存
            pattern = f"search:*"
            keys = self.redis_client.keys(pattern)
            if keys:
                self.redis_client.delete(*keys)
                
        except Exception as e:
            self.logger.error(f"清除缓存失败: {e}")
    
    def _update_stats(self):
        """更新统计信息"""
        self.stats['last_run'] = datetime.now()
        self.stats['total_scraped'] = self.stats['successful'] + self.stats['failed'] + self.stats['duplicates'] + self.stats['filtered']
    
    def get_stats(self) -> Dict:
        """获取统计信息"""
        self._update_stats()
        return self.stats
    
    def reset_stats(self):
        """重置统计信息"""
        self.stats = {
            'total_scraped': 0,
            'successful': 0,
            'failed': 0,
            'duplicates': 0,
            'filtered': 0,
            'last_run': None,
            'errors': []
        }
    
    def __del__(self):
        """析构函数，清理资源"""
        try:
            if hasattr(self, 'session'):
                self.session.close()
            if hasattr(self, 'mongo_client'):
                self.mongo_client.close()
            if hasattr(self, 'redis_client'):
                self.redis_client.close()
        except Exception:
            pass
