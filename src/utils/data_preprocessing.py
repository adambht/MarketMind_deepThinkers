# nexai/src/utils/data_preprocessing.py
import pandas as pd
import numpy as np
from typing import Dict, List

def preprocess_ad_data(ad_data: pd.DataFrame) -> pd.DataFrame:
    """
    Preprocess the ad data
    
    Args:
        ad_data(pd.DataFrame): Raw ad data
    
    Returns:
        pd.DataFrame: Preprocessed ad data
    """
    # Handle missing values 
    
    #Drop unnecessary features
    columns_to_drop = [
    "Campaign_ID", "Acquisition_Cost", "ROI",
    "Location", "Date", "Company",
    ] 
    ad_data = ad_data.drop(columns=columns_to_drop)
    
    #make target feature
    ad_data['CTR'] = ad_data['Clicks'] / ad_data['Impressions']
    
    #Convert Duration to integer
    ad_data['Duration'] = ad_data['Duration'].str.replace(' Days', '').astype(int)

    # Normalize numerical features
    numerical_features = [
        'Conversion_Rate', 
        'Clicks', 
        'Impressions', 
        'Engagement_Score', 
        'CTR',
        'Duration'
    ]
    
    for feature in numerical_features:
        ad_data[feature] = (ad_data[feature] - ad_data[feature].mean()) / ad_data[feature].std()
    
    # Encode categorical features
    categorical_features = ['Target_Audience', 'Campaign_Goal', 'Channel_Used','Language','Customer_Segment']
    ad_data = pd.get_dummies(ad_data, columns=categorical_features)
    
    return ad_data 


def split_ad_data(data: pd.DataFrame, test_size: float = 0.2):
    """
    Split ad data into training and testing sets
    
    Args:
        data (pd.DataFrame): Preprocessed ad data
        test_size (float): Proportion of data to use for testing
    
    Returns:
        Tuple of training and testing datasets
    """
    from sklearn.model_selection import train_test_split
    
    # Separate features and target
    X = data.drop('CTR', axis=1)
    y = data['CTR']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=42
    )
    
    return X_train, X_test, y_train, y_test
