"""
Scraper Manager
抓取器管理器，协调所有抓取器的工作
"""

import asyncio
import time
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any
from loguru import logger
import redis
from pymongo import MongoClient

from scrapers.twitter_scraper import TwitterScraper
from scrapers.rss_scraper import RSSScraper
from scrapers.news_scraper import NewsScraper
from config import (
    database_config, scraper_config, logging_config,
    monitoring_config, get_config, validate_config
)

class ScraperManager:
    """抓取器管理器"""
    
    def __init__(self):
        self.logger = logger.bind(component="scraper_manager")
        self.scrapers = {}
        self.is_running = False
        self.stats = {
            'total_runs': 0,
            'successful_runs': 0,
            'failed_runs': 0,
            'last_run': None,
            'next_run': None,
            'total_articles': 0,
            'errors': []
        }
        
        # 数据库连接
        self.mongo_client = MongoClient(database_config.mongodb_uri)
        self.db = self.mongo_client[database_config.database_name]
        self.articles_collection = self.db.articles
        
        # Redis连接
        self.redis_client = redis.from_url(database_config.redis_url)
        
        # 初始化抓取器
        self._initialize_scrapers()
    
    def _initialize_scrapers(self):
        """初始化抓取器"""
        try:
            if 'twitter' in scraper_config.enabled_sources:
                self.scrapers['twitter'] = TwitterScraper()
                self.logger.info("Twitter抓取器初始化成功")
            
            if 'rss' in scraper_config.enabled_sources:
                self.scrapers['rss'] = RSSScraper()
                self.logger.info("RSS抓取器初始化成功")
            
            if 'news' in scraper_config.enabled_sources:
                self.scrapers['news'] = NewsScraper()
                self.logger.info("News抓取器初始化成功")
            
            self.logger.info(f"抓取器初始化完成，共 {len(self.scrapers)} 个抓取器")
            
        except Exception as e:
            self.logger.error(f"抓取器初始化失败: {e}")
            self.stats['errors'].append(f"Initialization failed: {str(e)}")
    
    async def run_scraping(self, sources: Optional[List[str]] = None, **kwargs) -> Dict:
        """运行抓取任务"""
        if self.is_running:
            self.logger.warning("抓取任务已在运行中")
            return {'success': False, 'message': 'Scraping already running'}
        
        self.is_running = True
        start_time = datetime.now()
        
        try:
            self.logger.info("开始抓取任务")
            self.stats['total_runs'] += 1
            self.stats['last_run'] = start_time
            
            # 确定要运行的抓取器
            sources_to_run = sources or scraper_config.enabled_sources
            sources_to_run = [s for s in sources_to_run if s in self.scrapers]
            
            if not sources_to_run:
                self.logger.warning("没有可用的抓取器")
                return {'success': False, 'message': 'No scrapers available'}
            
            # 运行抓取器
            results = {}
            total_articles = 0
            
            for source in sources_to_run:
                try:
                    self.logger.info(f"开始运行 {source} 抓取器")
                    
                    scraper = self.scrapers[source]
                    articles = await scraper.scrape(**kwargs)
                    
                    results[source] = {
                        'success': True,
                        'articles_count': len(articles),
                        'stats': scraper.get_stats()
                    }
                    
                    total_articles += len(articles)
                    
                    self.logger.info(f"{source} 抓取器完成，抓取 {len(articles)} 篇文章")
                    
                except Exception as e:
                    self.logger.error(f"{source} 抓取器失败: {e}")
                    results[source] = {
                        'success': False,
                        'error': str(e),
                        'articles_count': 0
                    }
                    self.stats['errors'].append(f"{source} scraper failed: {str(e)}")
            
            # 更新统计信息
            self.stats['total_articles'] += total_articles
            self.stats['successful_runs'] += 1
            
            # 计算下次运行时间
            self.stats['next_run'] = start_time + timedelta(minutes=scraper_config.run_interval)
            
            # 保存运行结果
            await self._save_run_result(results, total_articles)
            
            self.logger.info(f"抓取任务完成，共抓取 {total_articles} 篇文章")
            
            return {
                'success': True,
                'message': 'Scraping completed successfully',
                'total_articles': total_articles,
                'results': results,
                'duration': (datetime.now() - start_time).total_seconds()
            }
            
        except Exception as e:
            self.logger.error(f"抓取任务失败: {e}")
            self.stats['failed_runs'] += 1
            self.stats['errors'].append(f"Scraping failed: {str(e)}")
            
            return {
                'success': False,
                'message': f'Scraping failed: {str(e)}',
                'error': str(e)
            }
            
        finally:
            self.is_running = False
    
    async def run_single_scraper(self, source: str, **kwargs) -> Dict:
        """运行单个抓取器"""
        if source not in self.scrapers:
            return {
                'success': False,
                'message': f'Scraper {source} not available'
            }
        
        try:
            self.logger.info(f"开始运行 {source} 抓取器")
            
            scraper = self.scrapers[source]
            articles = await scraper.scrape(**kwargs)
            
            self.logger.info(f"{source} 抓取器完成，抓取 {len(articles)} 篇文章")
            
            return {
                'success': True,
                'message': f'{source} scraper completed successfully',
                'articles_count': len(articles),
                'stats': scraper.get_stats()
            }
            
        except Exception as e:
            self.logger.error(f"{source} 抓取器失败: {e}")
            return {
                'success': False,
                'message': f'{source} scraper failed: {str(e)}',
                'error': str(e)
            }
    
    async def get_status(self) -> Dict:
        """获取抓取器状态"""
        try:
            status = {
                'is_running': self.is_running,
                'enabled_sources': scraper_config.enabled_sources,
                'available_scrapers': list(self.scrapers.keys()),
                'stats': self.stats.copy(),
                'scrapers_stats': {}
            }
            
            # 获取每个抓取器的统计信息
            for source, scraper in self.scrapers.items():
                try:
                    status['scrapers_stats'][source] = scraper.get_stats()
                except Exception as e:
                    self.logger.error(f"获取 {source} 统计信息失败: {e}")
                    status['scrapers_stats'][source] = {'error': str(e)}
            
            return status
            
        except Exception as e:
            self.logger.error(f"获取状态失败: {e}")
            return {
                'error': str(e),
                'is_running': self.is_running
            }
    
    async def get_articles_stats(self, hours: int = 24) -> Dict:
        """获取文章统计信息"""
        try:
            # 计算时间范围
            start_time = datetime.now() - timedelta(hours=hours)
            
            # 查询数据库
            pipeline = [
                {
                    '$match': {
                        'publishTime': {'$gte': start_time}
                    }
                },
                {
                    '$group': {
                        '_id': '$source',
                        'count': {'$sum': 1},
                        'avg_quality': {'$avg': '$qualityScore'},
                        'categories': {'$addToSet': '$category'}
                    }
                }
            ]
            
            stats = list(self.articles_collection.aggregate(pipeline))
            
            # 格式化结果
            result = {
                'time_range': f'{hours} hours',
                'total_articles': sum(stat['count'] for stat in stats),
                'by_source': {stat['_id']: {
                    'count': stat['count'],
                    'avg_quality': stat['avg_quality'],
                    'categories': stat['categories']
                } for stat in stats}
            }
            
            return result
            
        except Exception as e:
            self.logger.error(f"获取文章统计失败: {e}")
            return {'error': str(e)}
    
    async def _save_run_result(self, results: Dict, total_articles: int):
        """保存运行结果"""
        try:
            run_result = {
                'timestamp': datetime.now(),
                'total_articles': total_articles,
                'results': results,
                'duration': (datetime.now() - self.stats['last_run']).total_seconds()
            }
            
            # 保存到Redis缓存
            cache_key = f"scraper:run:{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            self.redis_client.setex(cache_key, 86400, str(run_result))  # 24小时过期
            
            # 保存到MongoDB
            self.db.scraper_runs.insert_one(run_result)
            
        except Exception as e:
            self.logger.error(f"保存运行结果失败: {e}")
    
    async def start_scheduler(self):
        """启动定时调度器"""
        self.logger.info("启动抓取调度器")
        
        while True:
            try:
                # 检查是否到了运行时间
                if self.stats['next_run'] and datetime.now() >= self.stats['next_run']:
                    await self.run_scraping()
                
                # 等待1分钟再检查
                await asyncio.sleep(60)
                
            except Exception as e:
                self.logger.error(f"调度器错误: {e}")
                await asyncio.sleep(60)
    
    async def stop_scheduler(self):
        """停止定时调度器"""
        self.logger.info("停止抓取调度器")
        self.is_running = False
    
    def get_config(self) -> Dict:
        """获取配置信息"""
        return get_config()
    
    def update_config(self, new_config: Dict):
        """更新配置"""
        try:
            # 这里可以实现配置更新逻辑
            # 由于配置是全局的，这里只是记录日志
            self.logger.info("配置更新请求")
            self.logger.info(f"新配置: {new_config}")
            
        except Exception as e:
            self.logger.error(f"更新配置失败: {e}")
    
    def reset_stats(self):
        """重置统计信息"""
        self.stats = {
            'total_runs': 0,
            'successful_runs': 0,
            'failed_runs': 0,
            'last_run': None,
            'next_run': None,
            'total_articles': 0,
            'errors': []
        }
        
        # 重置所有抓取器的统计信息
        for scraper in self.scrapers.values():
            scraper.reset_stats()
        
        self.logger.info("统计信息已重置")
    
    def __del__(self):
        """析构函数，清理资源"""
        try:
            if hasattr(self, 'mongo_client'):
                self.mongo_client.close()
            if hasattr(self, 'redis_client'):
                self.redis_client.close()
        except Exception:
            pass

# 全局抓取器管理器实例
scraper_manager = ScraperManager()
