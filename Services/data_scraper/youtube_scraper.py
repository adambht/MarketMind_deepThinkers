import requests
import pandas as pd
import re

# Replace with your actual API key
API_KEY = "AIzaSyB5JLaVpWMkQIvahUD7VUCSRWJ8oObVHvs"
SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"
MAX_RESULTS = 20  # You can raise this to 50 max per request

def search_youtube(query, max_results=MAX_RESULTS):
    """
    Search YouTube for videos matching the query and return relevant details.
    """
    params = {
        "part": "snippet",
        "q": query,
        "key": API_KEY,
        "type": "video",
        "maxResults": max_results,
    }

    response = requests.get(SEARCH_URL, params=params)

    if response.status_code != 200:
        print(f"Error: {response.status_code}")
        return None

    data = response.json()
    videos = []

    for item in data.get("items", []):
        video_id = item["id"]["videoId"]
        title = item["snippet"]["title"]
        description = item["snippet"]["description"]
        url = f"https://www.youtube.com/watch?v={video_id}"
        videos.append({
            "title": title,
            "description": description,
            "url": url
        })

    return pd.DataFrame(videos)


def extract_video_id(url):
    """
    Extract video ID from a YouTube URL.
    """
    pattern = r"(?:https?:\/\/(?:www\.)?youtube\.com\/(?:watch\?v=|v\/|e\/|shorts\/|.*\/)([a-zA-Z0-9_-]+))"
    match = re.search(pattern, url)
    return match.group(1) if match else None


def get_top_comments(video_id, api_key, max_comments=10):
    """
    Get top comments from a specific YouTube video.
    """
    comments = []
    url = f"https://www.googleapis.com/youtube/v3/commentThreads"
    params = {
        "part": "snippet",
        "videoId": video_id,
        "maxResults": max_comments,
        "order": "relevance",  # Sorting by relevance
        "textFormat": "plainText",
        "key": api_key
    }

    response = requests.get(url, params=params)
    data = response.json()

    if "items" in data:
        for item in data["items"]:
            snippet = item["snippet"]["topLevelComment"]["snippet"]
            comment_data = {
                "videoId": video_id,
                "review": snippet["textDisplay"],
                "likeCount": snippet["likeCount"],
                "author": snippet["authorDisplayName"]
            }
            comments.append(comment_data)

    return pd.DataFrame(comments)


def scrape_all_comments(api_key, query, max_results=10, max_comments=10):
    """
    Scrape all comments for videos related to the given query.
    """
    videos_df = search_youtube(query, max_results)
    all_comments = []

    for _, row in videos_df.iterrows():
        video_url = row['url']
        video_title = row['title']
        video_id = extract_video_id(video_url)

        if video_id:
            print(f"Scraping comments for video: {video_id}...")

            # Get top comments for the current video
            comments_df = get_top_comments(video_id, api_key, max_comments)

            # Add video title to each comment (this will associate comments with the video title)
            comments_df["videoTitle"] = video_title
            comments_df["source"] = "YouTube"

            # Append the comments DataFrame to the list
            if not comments_df.empty:
                all_comments.append(comments_df)

    # Combine all comments into a single DataFrame
    if all_comments:
        comments_df_all = pd.concat(all_comments, ignore_index=True)
        return comments_df_all
    else:
        return pd.DataFrame()  # Return empty DataFrame if no comments were found
