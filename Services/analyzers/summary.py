# analyzers/summary.py

# Sentiment categorization
def get_sentiment_label(sentiment_score):
    if sentiment_score <= -0.6:
        return "😡 Very Negative"
    elif sentiment_score <= -0.3:
        return "🙁 Negative"
    elif sentiment_score < 0.3:
        return "😐 Neutral"
    elif sentiment_score < 0.6:
        return "🙂 Positive"
    else:
        return "🤩 Very Positive"

# Toxicity categorization
def get_toxicity_label(toxic_percentage):
    if toxic_percentage <= 1:
        return "🟢 Very Low Toxicity"
    elif toxic_percentage <= 5:
        return "🟡 Low Toxicity"
    elif toxic_percentage <= 15:
        return "🟠 Moderate Toxicity"
    elif toxic_percentage <= 30:
        return "🔴 High Toxicity"
    else:
        return "⚫ Very High Toxicity"

# Generate the final plain-text summary
def generate_summary_response(avg_sentiment, toxic_percentage):
    sentiment_label = get_sentiment_label(avg_sentiment)
    toxicity_label = get_toxicity_label(toxic_percentage)

    summary = (
        f"Overall, the reviews are {sentiment_label} (average sentiment score: {avg_sentiment:.2f}). "
        f"Toxicity level: {toxicity_label} ({toxic_percentage:.2f}% of the reviews). "
    )

    if toxic_percentage <= 1:
        summary += "🟢 Toxicity is very rare and does not significantly affect the general perception."
    elif toxic_percentage <= 5:
        summary += "🟡 A small portion of reviews show toxicity, but the general sentiment remains positive."
    elif toxic_percentage <= 15:
        summary += "🟠 Moderate toxicity detected. Attention may be needed to address certain negative feedback."
    elif toxic_percentage <= 30:
        summary += "🔴 High toxicity observed. Sentiment may be heavily influenced by toxic reviews."
    else:
        summary += "⚫ Very high toxicity found. Reputation risk is critical — immediate actions are recommended."

    return {"summary": summary}
