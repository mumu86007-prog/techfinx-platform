"""
Google News Scraper
Google News内容抓取器
"""

import asyncio
import time
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import requests
from bs4 import BeautifulSoup
from loguru import logger

from .base_scraper import BaseScraper, ScrapedArticle
from config import news_config

class NewsScraper(BaseScraper):
    """Google News抓取器"""
    
    def __init__(self):
        super().__init__("news")
        self.keywords = news_config.keywords
        self.language = news_config.language
        self.country = news_config.country
        self.max_articles = news_config.max_articles
        self.api_key = news_config.api_key
    
    async def scrape(self, **kwargs) -> List[ScrapedArticle]:
        """抓取Google News内容"""
        articles = []
        
        try:
            # 获取要抓取的关键词
            keywords = kwargs.get('keywords', self.keywords)
            max_articles = kwargs.get('max_articles', self.max_articles)
            
            self.logger.info(f"开始抓取Google News内容，关键词数量: {len(keywords)}")
            
            for keyword in keywords:
                try:
                    keyword_articles = await self._scrape_keyword(keyword, max_articles)
                    articles.extend(keyword_articles)
                    
                    # 避免频率限制
                    await asyncio.sleep(2)
                    
                except Exception as e:
                    self.logger.error(f"抓取关键词 {keyword} 失败: {e}")
                    self.stats['errors'].append(f"Keyword {keyword} failed: {str(e)}")
                    continue
            
            # 保存文章
            for article in articles:
                self._save_article(article)
            
            self.logger.info(f"Google News抓取完成，共抓取 {len(articles)} 篇文章")
            
        except Exception as e:
            self.logger.error(f"Google News抓取失败: {e}")
            self.stats['errors'].append(f"Scraping failed: {str(e)}")
        
        return articles
    
    async def _scrape_keyword(self, keyword: str, max_articles: int) -> List[ScrapedArticle]:
        """抓取特定关键词的新闻"""
        articles = []
        
        try:
            if self.api_key:
                # 使用Google News API
                articles = await self._scrape_with_api(keyword, max_articles)
            else:
                # 使用网页抓取
                articles = await self._scrape_with_web(keyword, max_articles)
            
        except Exception as e:
            self.logger.error(f"抓取关键词 {keyword} 失败: {e}")
            raise
        
        return articles
    
    async def _scrape_with_api(self, keyword: str, max_articles: int) -> List[ScrapedArticle]:
        """使用Google News API抓取"""
        articles = []
        
        try:
            # 构建API请求URL
            url = "https://newsapi.org/v2/everything"
            params = {
                'q': keyword,
                'apiKey': self.api_key,
                'language': self.language,
                'sortBy': 'publishedAt',
                'pageSize': min(max_articles, 100),  # API限制
                'from': (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
            }
            
            response = self._make_request(url, params=params)
            if not response:
                return articles
            
            data = response.json()
            
            if data.get('status') != 'ok':
                self.logger.error(f"Google News API错误: {data.get('message', 'Unknown error')}")
                return articles
            
            # 处理文章
            for article_data in data.get('articles', []):
                try:
                    article = await self._process_api_article(article_data, keyword)
                    if article:
                        articles.append(article)
                except Exception as e:
                    self.logger.error(f"处理API文章失败: {e}")
                    continue
            
        except Exception as e:
            self.logger.error(f"API抓取失败: {e}")
            raise
        
        return articles
    
    async def _scrape_with_web(self, keyword: str, max_articles: int) -> List[ScrapedArticle]:
        """使用网页抓取Google News"""
        articles = []
        
        try:
            # 构建Google News搜索URL
            search_url = f"https://news.google.com/search?q={keyword}&hl={self.language}&gl={self.country}&ceid={self.country}:{self.language}"
            
            response = self._make_request(search_url)
            if not response:
                return articles
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 查找文章链接
            article_links = []
            for link in soup.find_all('a', href=True):
                href = link.get('href')
                if href and href.startswith('./articles/'):
                    # 处理相对URL
                    full_url = f"https://news.google.com{href[1:]}"
                    article_links.append(full_url)
            
            # 限制文章数量
            article_links = article_links[:max_articles]
            
            # 处理每个文章
            for link in article_links:
                try:
                    article = await self._scrape_article_page(link, keyword)
                    if article:
                        articles.append(article)
                    
                    # 避免频率限制
                    await asyncio.sleep(1)
                    
                except Exception as e:
                    self.logger.error(f"抓取文章页面失败: {e}")
                    continue
            
        except Exception as e:
            self.logger.error(f"网页抓取失败: {e}")
            raise
        
        return articles
    
    async def _process_api_article(self, article_data: Dict, keyword: str) -> Optional[ScrapedArticle]:
        """处理API返回的文章数据"""
        try:
            title = article_data.get('title', '').strip()
            if not title:
                return None
            
            content = article_data.get('content', '').strip()
            if not content:
                content = article_data.get('description', '').strip()
            
            if not content or len(content) < 100:
                return None
            
            # 提取URL
            url = article_data.get('url', '')
            if not url:
                return None
            
            # 提取发布时间
            publish_time = self._extract_publish_time(article_data.get('publishedAt', ''))
            
            # 提取作者
            author = article_data.get('author', '') or article_data.get('source', {}).get('name', 'Google News')
            
            # 提取图片
            images = []
            if article_data.get('urlToImage'):
                images.append(article_data['urlToImage'])
            
            # 提取标签
            tags = [keyword]
            if article_data.get('source', {}).get('name'):
                tags.append(article_data['source']['name'].lower())
            
            # 检测语言
            language = self._detect_language(f"{title} {content}")
            
            # 创建文章对象
            article = ScrapedArticle(
                title=title,
                content=content,
                excerpt=content[:200] + "..." if len(content) > 200 else content,
                url=url,
                source='news',
                category=self._categorize_article(title, content),
                tags=tags,
                author=author,
                publish_time=publish_time,
                images=images,
                language=language,
                raw_data={
                    'source_name': article_data.get('source', {}).get('name', ''),
                    'source_id': article_data.get('source', {}).get('id', ''),
                    'published_at': article_data.get('publishedAt', ''),
                    'url_to_image': article_data.get('urlToImage', ''),
                    'api_keyword': keyword
                }
            )
            
            return article
            
        except Exception as e:
            self.logger.error(f"处理API文章失败: {e}")
            return None
    
    async def _scrape_article_page(self, url: str, keyword: str) -> Optional[ScrapedArticle]:
        """抓取文章页面"""
        try:
            response = self._make_request(url)
            if not response:
                return None
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 提取标题
            title = self._extract_title(soup)
            if not title:
                return None
            
            # 提取内容
            content = self._extract_content(soup)
            if not content or len(content) < 100:
                return None
            
            # 提取作者
            author = self._extract_author(soup)
            
            # 提取发布时间
            publish_time = self._extract_publish_time_from_soup(soup)
            
            # 提取图片
            images = self._extract_images_from_soup(soup)
            
            # 提取标签
            tags = [keyword]
            
            # 检测语言
            language = self._detect_language(f"{title} {content}")
            
            # 创建文章对象
            article = ScrapedArticle(
                title=title,
                content=content,
                excerpt=content[:200] + "..." if len(content) > 200 else content,
                url=url,
                source='news',
                category=self._categorize_article(title, content),
                tags=tags,
                author=author,
                publish_time=publish_time,
                images=images,
                language=language,
                raw_data={
                    'scraped_url': url,
                    'keyword': keyword,
                    'scraped_at': datetime.now().isoformat()
                }
            )
            
            return article
            
        except Exception as e:
            self.logger.error(f"抓取文章页面失败: {e}")
            return None
    
    def _extract_title(self, soup: BeautifulSoup) -> str:
        """提取文章标题"""
        # 尝试不同的标题选择器
        title_selectors = [
            'h1',
            'title',
            '.headline',
            '.article-title',
            '[data-testid="headline"]'
        ]
        
        for selector in title_selectors:
            title_elem = soup.select_one(selector)
            if title_elem:
                title = title_elem.get_text().strip()
                if title and len(title) > 10:
                    return title
        
        return ""
    
    def _extract_content(self, soup: BeautifulSoup) -> str:
        """提取文章内容"""
        # 尝试不同的内容选择器
        content_selectors = [
            '.article-body',
            '.story-body',
            '.content',
            'article',
            '.post-content',
            '[data-testid="article-body"]'
        ]
        
        for selector in content_selectors:
            content_elem = soup.select_one(selector)
            if content_elem:
                content = self._extract_text(content_elem.get_text())
                if content and len(content) > 100:
                    return content
        
        return ""
    
    def _extract_author(self, soup: BeautifulSoup) -> str:
        """提取作者"""
        # 尝试不同的作者选择器
        author_selectors = [
            '.author',
            '.byline',
            '[data-testid="author"]',
            '.article-author',
            'meta[name="author"]'
        ]
        
        for selector in author_selectors:
            author_elem = soup.select_one(selector)
            if author_elem:
                if author_elem.name == 'meta':
                    author = author_elem.get('content', '')
                else:
                    author = author_elem.get_text().strip()
                
                if author:
                    return author
        
        return "Google News"
    
    def _extract_publish_time_from_soup(self, soup: BeautifulSoup) -> datetime:
        """从HTML中提取发布时间"""
        # 尝试不同的时间选择器
        time_selectors = [
            'time',
            '.publish-date',
            '.article-date',
            '[data-testid="timestamp"]',
            'meta[property="article:published_time"]'
        ]
        
        for selector in time_selectors:
            time_elem = soup.select_one(selector)
            if time_elem:
                if time_elem.name == 'meta':
                    time_str = time_elem.get('content', '')
                else:
                    time_str = time_elem.get('datetime') or time_elem.get_text()
                
                if time_str:
                    try:
                        return self._parse_time_string(time_str)
                    except (ValueError, TypeError):
                        continue
        
        return datetime.now()
    
    def _extract_images_from_soup(self, soup: BeautifulSoup) -> List[str]:
        """从HTML中提取图片"""
        images = []
        
        try:
            img_tags = soup.find_all('img')
            for img in img_tags:
                src = img.get('src')
                if src:
                    # 处理相对URL
                    if src.startswith('//'):
                        src = 'https:' + src
                    elif src.startswith('/'):
                        src = 'https://news.google.com' + src
                    
                    images.append(src)
            
            # 限制图片数量
            return images[:5]
            
        except Exception as e:
            self.logger.error(f"提取图片失败: {e}")
            return []
    
    def _parse_time_string(self, time_str: str) -> datetime:
        """解析时间字符串"""
        try:
            # 尝试不同的时间格式
            formats = [
                '%Y-%m-%dT%H:%M:%SZ',
                '%Y-%m-%dT%H:%M:%S.%fZ',
                '%Y-%m-%d %H:%M:%S',
                '%Y-%m-%d',
                '%B %d, %Y',
                '%b %d, %Y'
            ]
            
            for fmt in formats:
                try:
                    return datetime.strptime(time_str, fmt)
                except ValueError:
                    continue
            
            # 如果都失败，返回当前时间
            return datetime.now()
            
        except Exception:
            return datetime.now()
    
    async def get_trending_topics(self) -> List[str]:
        """获取热门话题"""
        try:
            # 这里可以实现获取Google News热门话题的逻辑
            # 由于Google News没有公开的API，这里返回一些默认话题
            trending = [
                'artificial intelligence',
                'machine learning',
                'fintech',
                'blockchain',
                'cryptocurrency',
                'quantum computing',
                'robotics',
                'automation'
            ]
            
            self.logger.info(f"获取热门话题: {trending}")
            return trending
            
        except Exception as e:
            self.logger.error(f"获取热门话题失败: {e}")
            return []
    
    async def get_news_categories(self) -> List[Dict]:
        """获取新闻分类"""
        try:
            categories = [
                {'name': 'Technology', 'id': 'technology'},
                {'name': 'Business', 'id': 'business'},
                {'name': 'Science', 'id': 'science'},
                {'name': 'Health', 'id': 'health'},
                {'name': 'Entertainment', 'id': 'entertainment'},
                {'name': 'Sports', 'id': 'sports'},
                {'name': 'World', 'id': 'world'}
            ]
            
            return categories
            
        except Exception as e:
            self.logger.error(f"获取新闻分类失败: {e}")
            return []
