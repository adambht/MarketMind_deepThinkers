import pandas as pd
import re
from google_trans_new import google_translator
import nltk
from nltk.corpus import stopwords
from nltk.sentiment import SentimentIntensityAnalyzer
from transformers import pipeline
import torch
import joblib
from transformers import AutoModelForSequenceClassification, AutoTokenizer

# Path to the Tunisian sentiment model
tunisian_model_path = "model/tunisian_sentiment"  # adjust path as needed
tunisian_model = AutoModelForSequenceClassification.from_pretrained(tunisian_model_path)
tunisian_tokenizer = AutoTokenizer.from_pretrained(tunisian_model_path)
tunisian_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
tunisian_model.to(tunisian_device)


# Load Gen Z model and vectorizer
genz_model = joblib.load('model/gen_z/genz_sentiment_model.pkl')
genz_vectorizer = joblib.load('model/gen_z/genz_tfidf_vectorizer.pkl')


label_map = {0: "Neutral", 1: "Positive", 2: "Negative"}

# Initialize NLTK for VADER and stopwords
nltk.download('stopwords')
nltk.download('vader_lexicon')
stop_words = set(stopwords.words('english'))

# Initialize models
translator = google_translator()
sia = SentimentIntensityAnalyzer()
toxic_pipeline = pipeline("text-classification", model="unitary/toxic-bert", framework="pt")
emotion_classifier = pipeline('text-classification', model='bhadresh-savani/bert-base-uncased-emotion', tokenizer='bhadresh-savani/bert-base-uncased-emotion', truncation=True)

def translate_review(review):
    try:
        return translator.translate(review, dest='en').text
    except:
        return review  # return original if translation fails



def get_sentiment_genz(text):
    preprocessed = preprocess_review(text)  # reuse the English preprocessing
    vectorized = genz_vectorizer.transform([preprocessed])
    prediction = genz_model.predict(vectorized)[0]
    label_map = {-1: 'Negative', 0: 'Neutral', 1: 'Positive'}
    return label_map[prediction]

def preprocess_review(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\d+', '', text)
    text = ' '.join([word for word in text.split() if word not in stop_words])
    return text

def preprocess_tunisian_text(text):
    # Preprocessing function used during training for Tunisian model
    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def get_sentiment_vader(review):
    scores = sia.polarity_scores(review)
    compound_score = scores['compound']
    if compound_score >= 0.1:
        sentiment = 'Positive'
    elif compound_score <= -0.1:
        sentiment = 'Negative'
    else:
        sentiment = 'Neutral'
    return sentiment, compound_score

def detect_toxicity(comment, threshold=0.85):
    try:
        result = toxic_pipeline(comment[:512])
        label = result[0]['label']
        score = result[0]['score']
        if label.lower() == 'toxic' and score > threshold:
            return 'toxic'
        else:
            return 'non-toxic'
    except:
        return 'error'

def detect_emotion(text):
    try:
        result = emotion_classifier(text)
        return result[0]['label']
    except:
        return 'unknown'

def get_sentiment_tunisian(text):
    # Preprocess Tunisian text before inference
    text = preprocess_tunisian_text(text)
    
    # Tokenize and move inputs to device
    inputs = tunisian_tokenizer(text, return_tensors='pt', padding=True, truncation=True, max_length=128)
    inputs = {key: val.to(tunisian_device) for key, val in inputs.items()}

    # Run model
    outputs = tunisian_model(**inputs)
    logits = outputs.logits

    # Get prediction
    prediction = torch.argmax(logits, dim=1).item()
    sentiment = label_map[prediction]
    return sentiment

def analyze_data(data: pd.DataFrame, model_type: str = 'vader') -> pd.DataFrame:
    # Apply preprocessing and translation if necessary
    data['review'] = data['review'].astype(str)
    
    if model_type == 'vader':  # If VADER or another English model is selected
        data['review'] = data['review'].apply(translate_review)
        data['review'] = data['review'].apply(preprocess_review)
        
        data['sentiment'] = ''
        data['sentiment_score'] = 0.0
        for i, row in data.iterrows():
            sentiment, score = get_sentiment_vader(row['review'])
            data.at[i, 'sentiment'] = sentiment
            data.at[i, 'sentiment_score'] = score
            
        data['toxicity'] = data['review'].apply(lambda x: detect_toxicity(x))
        data['emotion'] = data['review'].apply(lambda x: detect_emotion(x))
    
    elif model_type == 'tunisian':  # If the Tunisian model is selected
        data['review'] = data['review'].apply(preprocess_tunisian_text)  # Apply Tunisian preprocessing
        
        data['sentiment'] = data['review'].apply(lambda x: get_sentiment_tunisian(x))
        data['sentiment_score'] = None  # Since Tunisian model only provides sentiment label, not score
        
        data['toxicity'] = None  # No toxicity detection in the Tunisian model
        data['emotion'] = None  # No emotion detection in the Tunisian model
    
    elif model_type == 'genz':
        data['review'] = data['review'].apply(translate_review)  # still needed if some Gen Z text is not in English
        data['review'] = data['review'].apply(preprocess_review)

        data['sentiment'] = data['review'].apply(get_sentiment_genz)
        data['sentiment_score'] = None  # no compound score in Gen Z model
        data['toxicity'] = data['review'].apply(lambda x: detect_toxicity(x))
        data['emotion'] = data['review'].apply(lambda x: detect_emotion(x))


    return data
