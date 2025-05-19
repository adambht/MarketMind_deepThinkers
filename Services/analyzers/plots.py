import matplotlib.pyplot as plt
import seaborn as sns
from wordcloud import WordCloud
import os
import uuid

# Directory to save plots
PLOT_DIR = "/app/static/plots"
os.makedirs(PLOT_DIR, exist_ok=True)

def save_plot(fig, name=None):
    plot_dir = "/app/static/plots"  # Absolute container path
    os.makedirs(plot_dir, exist_ok=True)
    
    if name is None:
        name = f"{uuid.uuid4().hex}.png"
    
    absolute_path = os.path.join(plot_dir, name)
    fig.savefig(absolute_path, bbox_inches='tight', dpi=100)
    plt.close(fig)
    
    return f"static/plots/{name}"  # URL path (no leading slash)

def plot_sentiment_distribution(data):
    fig, ax = plt.subplots()
    sns.countplot(data=data, x='sentiment', ax=ax)
    ax.bar_label(ax.containers[0])
    ax.set_title('Distribution des sentiments')
    return save_plot(fig)

def plot_avg_sentiment_per_platform(data):
    avg_sentiment = data.groupby('source')['sentiment_score'].mean().reset_index()
    fig, ax = plt.subplots(figsize=(8, 6))
    sns.barplot(data=avg_sentiment, x='source', y='sentiment_score', palette='viridis', ax=ax)
    ax.set_title('Average Sentiment Score per Platform')
    ax.set_xlabel('Platform')
    ax.set_ylabel('Average Sentiment Score')
    ax.axhline(0, color='black', linestyle='--')
    return save_plot(fig)

def plot_wordcloud(data, sentiment=None):
    if sentiment:
        data = data[data['sentiment'] == sentiment]
    review_text = " ".join(str(i) for i in data['review'])
    wc = WordCloud(max_font_size=50, max_words=100, background_color="white", colormap='Spectral').generate(review_text)
    fig = plt.figure(figsize=(10, 10))
    plt.imshow(wc, interpolation='bilinear')
    plt.axis("off")
    return save_plot(fig)

def plot_toxicity_distribution(data):
    fig, ax = plt.subplots()
    sns.countplot(data=data, x='toxicity', ax=ax)
    ax.set_title("Toxic vs Non-Toxic Reviews")
    return save_plot(fig)

def plot_toxicity_by_sentiment(data):
    fig, ax = plt.subplots()
    sns.countplot(data=data, x='sentiment', hue='toxicity', ax=ax)
    ax.set_title("Toxicity by Sentiment")
    return save_plot(fig)

def plot_emotion_distribution(data):
    emotion_counts = data['emotion'].value_counts()
    fig, ax = plt.subplots(figsize=(10, 6))
    sns.barplot(x=emotion_counts.index, y=emotion_counts.values, palette='Set2', ax=ax)
    ax.set_title('Distribution of Emotions in the Dataset')
    ax.set_xlabel('Emotion')
    ax.set_ylabel('Number of Comments')
    plt.xticks(rotation=45)
    return save_plot(fig)
