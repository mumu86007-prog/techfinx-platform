#!/usr/bin/env python3
"""
TechfinX Content Scraper
内容抓取系统主程序
"""

import asyncio
import sys
import argparse
from datetime import datetime
from loguru import logger
import signal
import os

from scraper_manager import scraper_manager
from config import logging_config, validate_config

# 配置日志
logger.remove()
logger.add(
    sys.stdout,
    level=logging_config.level,
    format=logging_config.format
)
logger.add(
    logging_config.file_path,
    level=logging_config.level,
    format=logging_config.format,
    rotation=logging_config.max_file_size,
    retention=logging_config.backup_count
)

class ScraperApp:
    """抓取应用主类"""
    
    def __init__(self):
        self.is_running = False
        self.setup_signal_handlers()
    
    def setup_signal_handlers(self):
        """设置信号处理器"""
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
    
    def _signal_handler(self, signum, frame):
        """信号处理器"""
        logger.info(f"收到信号 {signum}，开始优雅关闭...")
        self.is_running = False
    
    async def run_once(self, sources=None, **kwargs):
        """运行一次抓取"""
        logger.info("开始单次抓取任务")
        
        try:
            result = await scraper_manager.run_scraping(sources=sources, **kwargs)
            
            if result['success']:
                logger.info(f"抓取任务完成: {result['message']}")
                logger.info(f"共抓取 {result['total_articles']} 篇文章")
                logger.info(f"耗时 {result['duration']:.2f} 秒")
            else:
                logger.error(f"抓取任务失败: {result['message']}")
                if 'error' in result:
                    logger.error(f"错误详情: {result['error']}")
            
            return result
            
        except Exception as e:
            logger.error(f"抓取任务异常: {e}")
            return {'success': False, 'message': str(e)}
    
    async def run_scheduler(self):
        """运行定时调度器"""
        logger.info("启动定时调度器")
        self.is_running = True
        
        try:
            await scraper_manager.start_scheduler()
        except KeyboardInterrupt:
            logger.info("收到中断信号，停止调度器")
        except Exception as e:
            logger.error(f"调度器异常: {e}")
        finally:
            self.is_running = False
            await scraper_manager.stop_scheduler()
    
    async def get_status(self):
        """获取状态"""
        try:
            status = await scraper_manager.get_status()
            logger.info("抓取器状态:")
            logger.info(f"  运行状态: {'运行中' if status['is_running'] else '已停止'}")
            logger.info(f"  启用的源: {status['enabled_sources']}")
            logger.info(f"  可用的抓取器: {status['available_scrapers']}")
            logger.info(f"  总运行次数: {status['stats']['total_runs']}")
            logger.info(f"  成功次数: {status['stats']['successful_runs']}")
            logger.info(f"  失败次数: {status['stats']['failed_runs']}")
            logger.info(f"  总文章数: {status['stats']['total_articles']}")
            
            if status['stats']['last_run']:
                logger.info(f"  上次运行: {status['stats']['last_run']}")
            if status['stats']['next_run']:
                logger.info(f"  下次运行: {status['stats']['next_run']}")
            
            return status
            
        except Exception as e:
            logger.error(f"获取状态失败: {e}")
            return None
    
    async def get_articles_stats(self, hours=24):
        """获取文章统计"""
        try:
            stats = await scraper_manager.get_articles_stats(hours)
            logger.info(f"文章统计 ({hours}小时):")
            logger.info(f"  总文章数: {stats['total_articles']}")
            
            for source, data in stats['by_source'].items():
                logger.info(f"  {source}: {data['count']} 篇 (平均质量: {data['avg_quality']:.2f})")
            
            return stats
            
        except Exception as e:
            logger.error(f"获取文章统计失败: {e}")
            return None
    
    def reset_stats(self):
        """重置统计信息"""
        scraper_manager.reset_stats()
        logger.info("统计信息已重置")

def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='TechfinX Content Scraper')
    parser.add_argument('--mode', choices=['once', 'scheduler', 'status', 'stats'], 
                       default='once', help='运行模式')
    parser.add_argument('--sources', nargs='+', 
                       choices=['twitter', 'rss', 'news'],
                       help='要运行的抓取器')
    parser.add_argument('--keywords', nargs='+', 
                       help='抓取关键词')
    parser.add_argument('--max-articles', type=int, 
                       help='最大文章数量')
    parser.add_argument('--hours', type=int, default=24,
                       help='统计时间范围（小时）')
    parser.add_argument('--reset-stats', action='store_true',
                       help='重置统计信息')
    
    args = parser.parse_args()
    
    # 验证配置
    if not validate_config():
        logger.error("配置验证失败，程序退出")
        sys.exit(1)
    
    # 创建应用实例
    app = ScraperApp()
    
    async def run_app():
        """运行应用"""
        try:
            if args.reset_stats:
                app.reset_stats()
                return
            
            if args.mode == 'once':
                await app.run_once(
                    sources=args.sources,
                    keywords=args.keywords,
                    max_articles=args.max_articles
                )
            elif args.mode == 'scheduler':
                await app.run_scheduler()
            elif args.mode == 'status':
                await app.get_status()
            elif args.mode == 'stats':
                await app.get_articles_stats(args.hours)
            
        except KeyboardInterrupt:
            logger.info("程序被用户中断")
        except Exception as e:
            logger.error(f"程序异常: {e}")
            sys.exit(1)
    
    # 运行应用
    asyncio.run(run_app())

if __name__ == "__main__":
    main()
