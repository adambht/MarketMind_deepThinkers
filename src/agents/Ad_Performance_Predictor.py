import numpy as np
import pandas as pd
import tensorflow as tf
from typing import Dict, List
from openai import OpenAI
from typing import Union
import joblib
import secret
import json
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler

client = OpenAI(api_key=secret.api_key)

def preprocess_ad_data(ad_data: pd.DataFrame) -> pd.DataFrame:
    """
    Preprocess the ad data, including one-hot encoding and column reordering.
    """
    # 1. Apply one-hot encoding
    ad_data['CTR'] = ad_data['Clicks'] / ad_data['Impressions']
    ad_data = ad_data.drop(columns=['Clicks', 'Impressions'])
    
    categorical_features = ['Target_Audience', 'Campaign_Goal', 'Channel_Used', 'Language', 'Customer_Segment']
    for col in categorical_features:
        le = joblib.load(f'nexai/src/models/machine_learning_models/encoders/{col}_encoder.pkl')
        ad_data[col] = le.transform(ad_data[col])
        
    
    
    ad_data['Duration'] = ad_data['Duration'].str.replace(' Days', '').astype(int)
    numerical_features = [
        'Conversion_Rate', 
        'Engagement_Score', 
        'Duration'
    ]
    
    scaler = joblib.load("nexai/src/models/machine_learning_models/encoders/numerical_scaler.pkl")
    ad_data[numerical_features] = scaler.transform(ad_data[numerical_features])


    # 2. Load the saved model columns (i.e., the expected order of columns from the model)
    model_columns = joblib.load('nexai/src/models/machine_learning_models/model_columns.pkl')  # Assuming the columns were saved during training

    # 3. Reorder the input columns to match the model's expected order
    # Ensure all columns in model_columns are present, adding missing ones as needed
    for col in model_columns:
        if col not in ad_data.columns:
            ad_data[col] = 0  # Add missing column with default value 0

    # Reorder the columns to match the model's expected input order
    ad_data = ad_data[model_columns]

    return ad_data

def _prepare_input_features(product_desc: str) -> dict:
    """Use LLM to infer ad campaign features from a product description."""
    

    prompt = f"""
You're an expert ad strategist. Given the product description below, infer the likely values for the following ad campaign features. 
Respond with a Python dictionary. Only use the **provided options** for each field.

Product description: "{product_desc}"

Valid values:
- Target_Audience: ['Men 35-44', 'Women 45-60', 'Men 45-60', 'Men 25-34', 'Women 35-44', 'All Ages', 'Women 25-34', 'Men 18-24', 'Women 18-24']
- Campaign_Goal: ['Product Launch', 'Market Expansion', 'Increase Sales', 'Brand Awareness']
- Duration: ['15 Days', '30 Days', '45 Days', '60 Days']
- Channel_Used: ['Instagram', 'Facebook', 'Pinterest', 'Twitter']
- Conversion_Rate: float between 0.08 and 0.15
- Language: ['Spanish', 'French', 'English']
- Clicks: integer between 293 and 40000
- Impressions: integer between 1937 and 120000
- Engagement_Score: integer between 1 and 10
- Customer_Segment: ['Health', 'Home', 'Technology', 'Food', 'Fashion']

Respond **only** with a Python dictionary and make sure to respect the feature names and values, e.g.:

{{
  "Target_Audience": "Men 25-34",
  "Campaign_Goal": "Brand Awareness",
  "Duration": "30 Days",
  "Channel_Used": "Instagram",
  "Conversion_Rate": 0.11,
  "Language": "English",
  "Clicks": 2300,
  "Impressions": 10000,
  "Engagement_Score": 7,
  "Customer_Segment": "Technology"
}}
"""

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}],
    )

    # ✅ FIXED: use .content instead of ["content"]
    output_text = response.choices[0].message.content
    print(f"output: {output_text}")
    print("xxxxxxxxxx")
    print(json.loads(output_text.replace("'", '"')))
    
    try:
        return json.loads(output_text.replace("'", '"'))
    except json.JSONDecodeError:
        raise ValueError("LLM did not return valid JSON.")


def predict_ctr_from_description(product_desc: str) -> Union[float, None]:
    """
    Predict the CTR for an ad based on a product description using LLM-inferred features and a trained ML model.
    """
    try:
        
        print("dkhalt lel function predcit_ctr_from_description")
        # Step 1: Get inferred ad features from LLM
        features = _prepare_input_features(product_desc)
        print("aaaaaaaaaa")
        print(features)

        # Step 2: Convert to DataFrame
        input_df = pd.DataFrame([features])
        print(input_df.head())

        # Step 3: Preprocess the input (if your model was trained on processed data)
        processed_input = preprocess_ad_data(input_df)
        print(processed_input.head())
        
         # **REMOVE 'CTR' COLUMN** before prediction
        processed_input = processed_input.drop(columns=['CTR'], errors='ignore')  # Safely drop if 'CTR' exists

        # Step 4: Load the trained model
        model = joblib.load('nexai/src/models/machine_learning_models/ctr_model.pkl')

        # Step 5: Predict CTR
        predicted_ctr = model.predict(processed_input)[0]
        print("Predicted CTR:", predicted_ctr)
        return predicted_ctr

    except Exception as e:
        print(f"Error predicting CTR: {e}")
        return None
    
def evaluate_ctr_with_llm(current_ctr: float, product_desc: str) -> str:
    """
    Ask the LLM to evaluate the CTR based on the product description and give a concise, easy-to-read summary.

    Args:
        current_ctr (float): The current CTR for the ad.
        product_desc (str): The description of the product being advertised.

    Returns:
        str: The formatted evaluation of the CTR, including performance, industry comparison, expected trend, and quick suggestions.
    """
    prompt = f"""
You are an ad performance expert.

Given the product description and CTR value below, evaluate the ad's performance. 

Product Description: "{product_desc}"
CTR: {current_ctr:.4f} ({current_ctr*100:.1f}%)

Please respond in a **clean and easy-to-scan format** using short bullet points or a simple table.

Include:
1. 🔍 Quick verdict: Is the CTR good, average, or poor?
2. 📊 Comparison with industry benchmarks
3. 📈 Expected trend (30-day outlook)
4. 💡 2–3 short, actionable tips to improve CTR or maintain performance

Keep it brief (under 150 words), bullet-style preferred. Avoid long paragraphs.
    """

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}],
    )

    output_text = response.choices[0].message.content
    print(f"output: {output_text}")
    return output_text