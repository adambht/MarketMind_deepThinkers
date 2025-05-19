import tweepy
import pandas as pd

# 🔐 Bearer token (store in env var ideally for security)
bearer_token = "YOUR_BEARER_TOKEN_HERE"  # Replace with actual token or use dotenv

# 🔧 Initialize client
client = tweepy.Client(bearer_token=bearer_token)

def scrape(keyword: str, max_results=100) -> list:
    """
    Scrape tweets containing the keyword.
    
    Returns:
        List of tweet texts.
    """
    query = f"{keyword} -is:retweet lang:en"

    try:
        tweets = client.search_recent_tweets(query=query, max_results=max_results)
        tweet_data = []

        if tweets.data:
            for tweet in tweets.data:
                tweet_data.append({
                    'review': tweet.text,
                    'source': 'Twitter'
                })
        return tweet_data

    except Exception as e:
        print(f"Twitter scraping error: {e}")
        return []
