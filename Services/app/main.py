from fastapi import FastAPI
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import pandas as pd

from analyzers.analysis_pipeline import analyze_data

from data_scraper.reddit_scraper import scrape_reddit_data
from data_scraper.twitter_scraper import scrape as scrape_twitter_data
from data_scraper.youtube_scraper import scrape_all_comments
from analyzers.plots import plot_sentiment_distribution, plot_avg_sentiment_per_platform, plot_wordcloud, plot_toxicity_distribution, plot_toxicity_by_sentiment, plot_emotion_distribution

from analyzers.summary import generate_summary_response


import os
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"  # Disable GPU


from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")



def filter_response(data):
    # Filter out the fields with null values
    cleaned_data = []
    for item in data:
        cleaned_item = {key: value for key, value in item.items() if value is not None}
        cleaned_data.append(cleaned_item)
    return cleaned_data


# Load environment variables from .env
load_dotenv()
API_KEY = os.getenv("YOUTUBE_API_KEY")

#app = FastAPI()

class AnalyzeRequest(BaseModel):
    keyword: str
    model_type: str = 'vader'  # 'vader', 'genz', or 'tunisian'

@app.get("/")
def health_check():
    return {"status": "Healthy", "message": "Sentiment microservice is running ✅"}

@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    keyword = request.keyword
    model_type = request.model_type.lower()

    all_dataframes = []

    # Try scraping Reddit
    try:
        reddit_data = scrape_reddit_data(keyword)
        if not reddit_data.empty:
            all_dataframes.append(reddit_data)
    except Exception as e:
        print(f"Reddit scraping failed: {e}")

    # Try scraping Twitter
    try:
        twitter_data = scrape_twitter_data(keyword)
        if not twitter_data.empty:
            all_dataframes.append(twitter_data)
    except Exception as e:
        print(f"Twitter scraping failed: {e}")

    # Try scraping YouTube
    try:
        if not API_KEY:
            return {"error": "Missing YouTube API key. Please check your .env file."}
        youtube_data = scrape_all_comments(API_KEY, keyword)
        if not youtube_data.empty:
            all_dataframes.append(youtube_data[['review', 'source']])  # Ensure only necessary columns
    except Exception as e:
        print(f"YouTube scraping failed: {e}")

    if not all_dataframes:
        return {"error": "No data found from any source."}

    # Combine all data
    df = pd.concat(all_dataframes, ignore_index=True)

    analyzed_df = analyze_data(df, model_type=model_type)

    sentiment_plot_url = plot_sentiment_distribution(analyzed_df)
    avg_sentiment_plot_url = plot_avg_sentiment_per_platform(analyzed_df)
    wordcloud_plot_url = plot_wordcloud(analyzed_df)
    toxicity_plot_url = plot_toxicity_distribution(analyzed_df)
    toxicity_sentiment_plot_url = plot_toxicity_by_sentiment(analyzed_df)
    emotion_plot_url = plot_emotion_distribution(analyzed_df)

    avg_sentiment = analyzed_df['sentiment_score'].dropna().mean()  # avoid NaNs
    toxic_percentage = (analyzed_df['toxicity'] == 'toxic').mean() * 100
    summary_natural = generate_summary_response(avg_sentiment, toxic_percentage)

    result = {
        "summary": {
            "stats": {
                "total_comments": len(analyzed_df),
                "positives": int((analyzed_df['sentiment'] == 'Positive').sum()),
                "negatives": int((analyzed_df['sentiment'] == 'Negative').sum()),
                "neutrals": int((analyzed_df['sentiment'] == 'Neutral').sum()),
                "toxic": int((analyzed_df['toxicity'] == 'toxic').sum()),
            },
            "natural_language": summary_natural["summary"]
        },
        "sample_results": filter_response(analyzed_df[['source', 'review', 'sentiment', 'sentiment_score', 'toxicity', 'emotion']].head(5).to_dict(orient="records")),
        "plot_urls": {
            "sentiment_plot": sentiment_plot_url,
            "avg_sentiment_plot": avg_sentiment_plot_url,
            "wordcloud_plot": wordcloud_plot_url,
            "toxicity_plot": toxicity_plot_url,
            "toxicity_sentiment_plot": toxicity_sentiment_plot_url,
            "emotion_plot": emotion_plot_url
        }
    }

    return result
