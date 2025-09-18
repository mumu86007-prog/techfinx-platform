"""
TechfinX Content Scraper Package
内容抓取系统包
"""

__version__ = "1.0.0"
__author__ = "TechfinX Team"
__description__ = "Content scraper for TechfinX platform"

from .scraper_manager import scraper_manager
from .scrapers.base_scraper import BaseScraper, ScrapedArticle
from .scrapers.twitter_scraper import TwitterScraper
from .scrapers.rss_scraper import RSSScraper
from .scrapers.news_scraper import NewsScraper

__all__ = [
    'scraper_manager',
    'BaseScraper',
    'ScrapedArticle',
    'TwitterScraper',
    'RSSScraper',
    'NewsScraper'
]
