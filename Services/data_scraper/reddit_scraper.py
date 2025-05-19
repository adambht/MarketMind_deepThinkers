import praw
import pandas as pd

# Initialize Reddit API client
reddit = praw.Reddit(
    client_id='WgQrst71sTeBV65_pUXhFQ',
    client_secret='8VikrisxpxUsOtAnCclU3FCKUnKJaA',
    user_agent='scrapper',
    username='aaazzzaazz ',
    password='Saheliano20765664'
)

def scrape_reddit_data(query: str, limit: int = 10, max_comments_per_post: int = 10):
    posts = []

    # Scrape Reddit posts
    for submission in reddit.subreddit("all").search(query, sort="relevance", limit=limit):
        posts.append({
            "title": submission.title,
            "score": submission.score,
            "subreddit": submission.subreddit.display_name,
            "url": submission.url,
            "num_comments": submission.num_comments,
            "created_utc": submission.created_utc,
            "id": submission.id,
            "selftext": submission.selftext
        })

    # Convert posts to DataFrame
    df_reddit = pd.DataFrame(posts)

    comments_data = []

    # Fetch comments for each post
    for _, row in df_reddit.iterrows():
        try:
            submission = reddit.submission(id=row['id'])
            submission.comments.replace_more(limit=0)  # Flatten the comment tree

            for i, comment in enumerate(submission.comments[:max_comments_per_post]):
                comments_data.append({
                    "post_id": row["id"],
                    "post_title": row["title"],
                    "subreddit": row["subreddit"],
                    "review": comment.body,
                    "comment_score": comment.score,
                    "source": "Reddit"
                })

        except Exception as e:
            print(f"Error fetching comments for post {row['id']}: {e}")

    # Convert comments to DataFrame
    df_comments = pd.DataFrame(comments_data)

    # Return relevant columns
    return df_comments[['review', 'source']]
