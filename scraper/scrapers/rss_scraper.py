"""
RSS Scraper
RSS内容抓取器
"""

import asyncio
import feedparser
import time
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from urllib.parse import urljoin, urlparse
import requests
from bs4 import BeautifulSoup
from loguru import logger

from .base_scraper import BaseScraper, ScrapedArticle
from config import rss_config

class RSSScraper(BaseScraper):
    """RSS抓取器"""
    
    def __init__(self):
        super().__init__("rss")
        self.feeds = rss_config.feeds
        self.max_articles = rss_config.max_articles
    
    async def scrape(self, **kwargs) -> List[ScrapedArticle]:
        """抓取RSS内容"""
        articles = []
        
        try:
            # 获取要抓取的RSS源
            feeds = kwargs.get('feeds', self.feeds)
            max_articles = kwargs.get('max_articles', self.max_articles)
            
            self.logger.info(f"开始抓取RSS内容，源数量: {len(feeds)}")
            
            for feed_url in feeds:
                try:
                    feed_articles = await self._scrape_feed(feed_url, max_articles)
                    articles.extend(feed_articles)
                    
                    # 避免频率限制
                    await asyncio.sleep(1)
                    
                except Exception as e:
                    self.logger.error(f"抓取RSS源 {feed_url} 失败: {e}")
                    self.stats['errors'].append(f"Feed {feed_url} failed: {str(e)}")
                    continue
            
            # 保存文章
            for article in articles:
                self._save_article(article)
            
            self.logger.info(f"RSS抓取完成，共抓取 {len(articles)} 篇文章")
            
        except Exception as e:
            self.logger.error(f"RSS抓取失败: {e}")
            self.stats['errors'].append(f"Scraping failed: {str(e)}")
        
        return articles
    
    async def _scrape_feed(self, feed_url: str, max_articles: int) -> List[ScrapedArticle]:
        """抓取单个RSS源"""
        articles = []
        
        try:
            # 解析RSS源
            feed = feedparser.parse(feed_url)
            
            if feed.bozo:
                self.logger.warning(f"RSS源解析警告: {feed_url} - {feed.bozo_exception}")
            
            if not feed.entries:
                self.logger.warning(f"RSS源无内容: {feed_url}")
                return articles
            
            # 处理每个条目
            for entry in feed.entries[:max_articles]:
                try:
                    article = await self._process_entry(entry, feed_url)
                    if article:
                        articles.append(article)
                except Exception as e:
                    self.logger.error(f"处理RSS条目失败: {e}")
                    continue
            
            self.logger.info(f"RSS源 {feed_url} 抓取完成，共 {len(articles)} 篇文章")
            
        except Exception as e:
            self.logger.error(f"抓取RSS源 {feed_url} 失败: {e}")
            raise
        
        return articles
    
    async def _process_entry(self, entry, feed_url: str) -> Optional[ScrapedArticle]:
        """处理RSS条目"""
        try:
            # 提取基本信息
            title = entry.get('title', '').strip()
            if not title:
                return None
            
            # 提取内容
            content = self._extract_content(entry)
            if not content or len(content) < 100:
                return None
            
            # 提取摘要
            excerpt = self._extract_excerpt(entry, content)
            
            # 提取URL
            url = entry.get('link', '')
            if not url:
                return None
            
            # 提取发布时间
            publish_time = self._extract_publish_time(entry)
            
            # 提取作者
            author = self._extract_author(entry)
            
            # 提取标签
            tags = self._extract_tags(entry)
            
            # 提取图片
            images = await self._extract_images(entry, url)
            
            # 检测语言
            language = self._detect_language(f"{title} {content}")
            
            # 创建文章对象
            article = ScrapedArticle(
                title=title,
                content=content,
                excerpt=excerpt,
                url=url,
                source='rss',
                category=self._categorize_article(title, content),
                tags=tags,
                author=author,
                publish_time=publish_time,
                images=images,
                language=language,
                raw_data={
                    'feed_url': feed_url,
                    'entry_id': entry.get('id', ''),
                    'summary': entry.get('summary', ''),
                    'tags': [tag.term for tag in entry.get('tags', [])],
                    'published': entry.get('published', ''),
                    'updated': entry.get('updated', '')
                }
            )
            
            return article
            
        except Exception as e:
            self.logger.error(f"处理RSS条目失败: {e}")
            return None
    
    def _extract_content(self, entry) -> str:
        """提取文章内容"""
        # 尝试不同的内容字段
        content_fields = [
            'content',
            'summary',
            'description',
            'text'
        ]
        
        for field in content_fields:
            if field in entry:
                content = entry[field]
                
                # 如果是列表，取第一个元素
                if isinstance(content, list) and content:
                    content = content[0]
                
                # 如果是字典，尝试获取value
                if isinstance(content, dict):
                    content = content.get('value', '')
                
                if content and len(content) > 100:
                    return self._extract_text(content)
        
        return ""
    
    def _extract_excerpt(self, entry, content: str) -> str:
        """提取文章摘要"""
        # 尝试从summary字段获取
        summary = entry.get('summary', '')
        if summary:
            summary_text = self._extract_text(summary)
            if len(summary_text) > 50:
                return summary_text[:200] + "..." if len(summary_text) > 200 else summary_text
        
        # 从内容中提取
        if content:
            return content[:200] + "..." if len(content) > 200 else content
        
        return ""
    
    def _extract_publish_time(self, entry) -> datetime:
        """提取发布时间"""
        # 尝试不同的时间字段
        time_fields = ['published_parsed', 'updated_parsed', 'created_parsed']
        
        for field in time_fields:
            if field in entry and entry[field]:
                try:
                    return datetime(*entry[field][:6])
                except (ValueError, TypeError):
                    continue
        
        # 如果都没有，返回当前时间
        return datetime.now()
    
    def _extract_author(self, entry) -> str:
        """提取作者"""
        # 尝试不同的作者字段
        author_fields = ['author', 'creator', 'dc:creator']
        
        for field in author_fields:
            if field in entry and entry[field]:
                author = entry[field]
                if isinstance(author, list):
                    author = author[0]
                return author.strip()
        
        return "RSS Feed"
    
    def _extract_tags(self, entry) -> List[str]:
        """提取标签"""
        tags = []
        
        # 从tags字段提取
        if 'tags' in entry:
            for tag in entry['tags']:
                if isinstance(tag, dict) and 'term' in tag:
                    tags.append(tag['term'].lower())
                elif isinstance(tag, str):
                    tags.append(tag.lower())
        
        # 从category字段提取
        if 'category' in entry:
            category = entry['category']
            if isinstance(category, list):
                tags.extend([cat.lower() for cat in category])
            else:
                tags.append(category.lower())
        
        # 去重并限制数量
        return list(set(tags))[:10]
    
    async def _extract_images(self, entry, url: str) -> List[str]:
        """提取图片URL"""
        images = []
        
        try:
            # 从content字段提取图片
            content_fields = ['content', 'summary', 'description']
            
            for field in content_fields:
                if field in entry:
                    content = entry[field]
                    if isinstance(content, list):
                        content = content[0]
                    if isinstance(content, dict):
                        content = content.get('value', '')
                    
                    if content:
                        soup = BeautifulSoup(content, 'html.parser')
                        img_tags = soup.find_all('img')
                        
                        for img in img_tags:
                            img_url = img.get('src')
                            if img_url:
                                # 处理相对URL
                                img_url = urljoin(url, img_url)
                                images.append(img_url)
            
            # 从enclosures字段提取图片
            if 'enclosures' in entry:
                for enclosure in entry['enclosures']:
                    if enclosure.get('type', '').startswith('image/'):
                        img_url = enclosure.get('href', '')
                        if img_url:
                            img_url = urljoin(url, img_url)
                            images.append(img_url)
            
            # 限制图片数量
            return images[:5]
            
        except Exception as e:
            self.logger.error(f"提取图片失败: {e}")
            return []
    
    async def get_feed_info(self, feed_url: str) -> Dict:
        """获取RSS源信息"""
        try:
            feed = feedparser.parse(feed_url)
            
            info = {
                'title': feed.feed.get('title', ''),
                'description': feed.feed.get('description', ''),
                'link': feed.feed.get('link', ''),
                'language': feed.feed.get('language', ''),
                'last_updated': feed.feed.get('updated', ''),
                'entry_count': len(feed.entries),
                'bozo': feed.bozo,
                'bozo_exception': str(feed.bozo_exception) if feed.bozo_exception else None
            }
            
            return info
            
        except Exception as e:
            self.logger.error(f"获取RSS源信息失败: {e}")
            return {}
    
    async def validate_feed(self, feed_url: str) -> bool:
        """验证RSS源是否有效"""
        try:
            feed = feedparser.parse(feed_url)
            
            # 检查是否有条目
            if not feed.entries:
                return False
            
            # 检查是否有标题
            if not feed.feed.get('title'):
                return False
            
            # 检查是否有链接
            if not feed.feed.get('link'):
                return False
            
            return True
            
        except Exception as e:
            self.logger.error(f"验证RSS源失败: {e}")
            return False
    
    async def get_feed_articles_count(self, feed_url: str) -> int:
        """获取RSS源的文章数量"""
        try:
            feed = feedparser.parse(feed_url)
            return len(feed.entries)
        except Exception as e:
            self.logger.error(f"获取RSS源文章数量失败: {e}")
            return 0
