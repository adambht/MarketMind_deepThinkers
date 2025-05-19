# data_scraper/__init__.py
from .reddit_scraper import scrape_reddit_data
from .twitter_scraper import scrape as scrape_twitter_data
from .youtube_scraper import scrape_all_comments

__all__ = [
    'scrape_reddit_data',
    'scrape_twitter_data',
    'scrape_all_comments'
]