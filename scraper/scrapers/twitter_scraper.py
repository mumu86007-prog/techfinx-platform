"""
Twitter Scraper
Twitter内容抓取器
"""

import asyncio
import json
import time
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import tweepy
from loguru import logger

from .base_scraper import BaseScraper, ScrapedArticle
from config import twitter_config

class TwitterScraper(BaseScraper):
    """Twitter抓取器"""
    
    def __init__(self):
        super().__init__("twitter")
        self.api = None
        self.client = None
        self._setup_api()
    
    def _setup_api(self):
        """设置Twitter API"""
        try:
            if twitter_config.bearer_token:
                # 使用Bearer Token (推荐)
                self.client = tweepy.Client(
                    bearer_token=twitter_config.bearer_token,
                    wait_on_rate_limit=True
                )
                self.logger.info("Twitter API客户端初始化成功 (Bearer Token)")
            elif twitter_config.api_key and twitter_config.api_secret:
                # 使用API Key和Secret
                auth = tweepy.OAuth2AppHandler(
                    twitter_config.api_key,
                    twitter_config.api_secret
                )
                self.api = tweepy.API(auth, wait_on_rate_limit=True)
                self.logger.info("Twitter API客户端初始化成功 (API Key)")
            else:
                self.logger.error("Twitter API凭据未配置")
                return
            
        except Exception as e:
            self.logger.error(f"Twitter API初始化失败: {e}")
            self.stats['errors'].append(f"API setup failed: {str(e)}")
    
    async def scrape(self, **kwargs) -> List[ScrapedArticle]:
        """抓取Twitter内容"""
        if not self.client and not self.api:
            self.logger.error("Twitter API未初始化")
            return []
        
        articles = []
        
        try:
            # 获取关键词
            keywords = kwargs.get('keywords', twitter_config.keywords)
            max_tweets = kwargs.get('max_tweets', twitter_config.max_tweets)
            
            self.logger.info(f"开始抓取Twitter内容，关键词: {keywords}")
            
            for keyword in keywords:
                try:
                    keyword_articles = await self._scrape_keyword(keyword, max_tweets)
                    articles.extend(keyword_articles)
                    
                    # 避免频率限制
                    await asyncio.sleep(1)
                    
                except Exception as e:
                    self.logger.error(f"抓取关键词 {keyword} 失败: {e}")
                    self.stats['errors'].append(f"Keyword {keyword} failed: {str(e)}")
                    continue
            
            # 保存文章
            for article in articles:
                self._save_article(article)
            
            self.logger.info(f"Twitter抓取完成，共抓取 {len(articles)} 篇文章")
            
        except Exception as e:
            self.logger.error(f"Twitter抓取失败: {e}")
            self.stats['errors'].append(f"Scraping failed: {str(e)}")
        
        return articles
    
    async def _scrape_keyword(self, keyword: str, max_tweets: int) -> List[ScrapedArticle]:
        """抓取特定关键词的推文"""
        articles = []
        
        try:
            if self.client:
                # 使用新的Twitter API v2
                tweets = self.client.search_recent_tweets(
                    query=keyword,
                    max_results=min(max_tweets, 100),  # API限制
                    tweet_fields=['created_at', 'author_id', 'public_metrics', 'context_annotations'],
                    user_fields=['name', 'username'],
                    expansions=['author_id']
                )
                
                if tweets.data:
                    # 获取用户信息
                    users = {user.id: user for user in tweets.includes.get('users', [])}
                    
                    for tweet in tweets.data:
                        try:
                            article = await self._process_tweet_v2(tweet, users, keyword)
                            if article:
                                articles.append(article)
                        except Exception as e:
                            self.logger.error(f"处理推文失败: {e}")
                            continue
            
            elif self.api:
                # 使用旧的Twitter API v1.1
                tweets = tweepy.Cursor(
                    self.api.search_tweets,
                    q=keyword,
                    lang='en',
                    result_type='recent',
                    tweet_mode='extended'
                ).items(max_tweets)
                
                for tweet in tweets:
                    try:
                        article = await self._process_tweet_v1(tweet, keyword)
                        if article:
                            articles.append(article)
                    except Exception as e:
                        self.logger.error(f"处理推文失败: {e}")
                        continue
            
        except Exception as e:
            self.logger.error(f"抓取关键词 {keyword} 失败: {e}")
            raise
        
        return articles
    
    async def _process_tweet_v2(self, tweet, users: Dict, keyword: str) -> Optional[ScrapedArticle]:
        """处理Twitter API v2的推文"""
        try:
            # 获取用户信息
            user = users.get(tweet.author_id)
            if not user:
                return None
            
            # 提取推文内容
            content = tweet.text
            
            # 检查推文长度和质量
            if len(content) < 50:  # 太短的推文
                return None
            
            # 生成标题（使用推文的前100个字符）
            title = content[:100] + "..." if len(content) > 100 else content
            
            # 生成摘要
            excerpt = content[:200] + "..." if len(content) > 200 else content
            
            # 获取发布时间
            publish_time = tweet.created_at
            
            # 提取标签
            tags = self._extract_hashtags(content)
            tags.append(keyword.replace('#', ''))
            
            # 生成文章URL
            url = f"https://twitter.com/{user.username}/status/{tweet.id}"
            
            # 创建文章对象
            article = ScrapedArticle(
                title=title,
                content=content,
                excerpt=excerpt,
                url=url,
                source='twitter',
                category=self._categorize_article(title, content),
                tags=tags,
                author=user.name or user.username,
                publish_time=publish_time,
                images=[],  # Twitter推文中的图片需要额外处理
                language='en',
                raw_data={
                    'tweet_id': tweet.id,
                    'author_id': tweet.author_id,
                    'username': user.username,
                    'public_metrics': tweet.public_metrics,
                    'context_annotations': tweet.context_annotations
                }
            )
            
            return article
            
        except Exception as e:
            self.logger.error(f"处理推文v2失败: {e}")
            return None
    
    async def _process_tweet_v1(self, tweet, keyword: str) -> Optional[ScrapedArticle]:
        """处理Twitter API v1.1的推文"""
        try:
            # 提取推文内容
            content = tweet.full_text
            
            # 检查推文长度和质量
            if len(content) < 50:  # 太短的推文
                return None
            
            # 生成标题
            title = content[:100] + "..." if len(content) > 100 else content
            
            # 生成摘要
            excerpt = content[:200] + "..." if len(content) > 200 else content
            
            # 获取发布时间
            publish_time = tweet.created_at
            
            # 提取标签
            tags = self._extract_hashtags(content)
            tags.append(keyword.replace('#', ''))
            
            # 生成文章URL
            url = f"https://twitter.com/{tweet.user.screen_name}/status/{tweet.id_str}"
            
            # 创建文章对象
            article = ScrapedArticle(
                title=title,
                content=content,
                excerpt=excerpt,
                url=url,
                source='twitter',
                category=self._categorize_article(title, content),
                tags=tags,
                author=tweet.user.name or tweet.user.screen_name,
                publish_time=publish_time,
                images=[],  # Twitter推文中的图片需要额外处理
                language='en',
                raw_data={
                    'tweet_id': tweet.id_str,
                    'user_id': tweet.user.id_str,
                    'screen_name': tweet.user.screen_name,
                    'favorite_count': tweet.favorite_count,
                    'retweet_count': tweet.retweet_count
                }
            )
            
            return article
            
        except Exception as e:
            self.logger.error(f"处理推文v1失败: {e}")
            return None
    
    def _extract_hashtags(self, text: str) -> List[str]:
        """提取推文中的标签"""
        import re
        hashtags = re.findall(r'#\w+', text)
        return [tag.lower().replace('#', '') for tag in hashtags]
    
    async def get_user_tweets(self, username: str, max_tweets: int = 50) -> List[ScrapedArticle]:
        """获取特定用户的推文"""
        articles = []
        
        try:
            if self.client:
                # 使用新的Twitter API v2
                user = self.client.get_user(username=username)
                if not user.data:
                    self.logger.error(f"用户 {username} 不存在")
                    return articles
                
                tweets = self.client.get_users_tweets(
                    user_id=user.data.id,
                    max_results=min(max_tweets, 100),
                    tweet_fields=['created_at', 'public_metrics'],
                    user_fields=['name', 'username']
                )
                
                if tweets.data:
                    for tweet in tweets.data:
                        try:
                            article = await self._process_tweet_v2(tweet, {user.data.id: user.data}, '')
                            if article:
                                articles.append(article)
                        except Exception as e:
                            self.logger.error(f"处理用户推文失败: {e}")
                            continue
            
            elif self.api:
                # 使用旧的Twitter API v1.1
                tweets = tweepy.Cursor(
                    self.api.user_timeline,
                    screen_name=username,
                    tweet_mode='extended'
                ).items(max_tweets)
                
                for tweet in tweets:
                    try:
                        article = await self._process_tweet_v1(tweet, '')
                        if article:
                            articles.append(article)
                    except Exception as e:
                        self.logger.error(f"处理用户推文失败: {e}")
                        continue
            
            # 保存文章
            for article in articles:
                self._save_article(article)
            
            self.logger.info(f"获取用户 {username} 的推文完成，共 {len(articles)} 条")
            
        except Exception as e:
            self.logger.error(f"获取用户推文失败: {e}")
            self.stats['errors'].append(f"User tweets failed: {str(e)}")
        
        return articles
    
    async def get_trending_topics(self) -> List[str]:
        """获取热门话题"""
        try:
            if self.api:
                # 使用旧的API获取热门话题
                trends = self.api.get_place_trends(1)  # 全球热门话题
                if trends:
                    trending = [trend['name'] for trend in trends[0]['trends'][:10]]
                    self.logger.info(f"获取热门话题: {trending}")
                    return trending
            
            return []
            
        except Exception as e:
            self.logger.error(f"获取热门话题失败: {e}")
            return []
    
    def get_rate_limit_status(self) -> Dict:
        """获取API限制状态"""
        try:
            if self.api:
                status = self.api.get_rate_limit_status()
                return {
                    'search_tweets': status['resources']['search']['/search/tweets'],
                    'user_timeline': status['resources']['statuses']['/statuses/user_timeline']
                }
            return {}
            
        except Exception as e:
            self.logger.error(f"获取API限制状态失败: {e}")
            return {}
