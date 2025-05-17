import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler

import joblib


def preprocess_ad_data(ad_data: pd.DataFrame) -> pd.DataFrame:
    """
    Preprocess the ad data using label encoding for testing purposes.
    """
    # Make target feature
    ad_data['CTR'] = ad_data['Clicks'] / ad_data['Impressions']
    ad_data = ad_data.drop(columns=['Clicks', 'Impressions'])

    # Drop unnecessary columns if they exist
    columns_to_drop = ["Campaign_ID", "Acquisition_Cost", "ROI", "Location", "Date", "Company"]
    ad_data = ad_data.drop(columns=[col for col in columns_to_drop if col in ad_data.columns])

    # Convert Duration to integer
    ad_data['Duration'] = ad_data['Duration'].str.replace(' Days', '').astype(int)

    # Normalize numerical features
    numerical_features = ['Conversion_Rate', 'Engagement_Score', 'Duration']
    # Initialize and fit the scaler on all numerical features
    scaler = StandardScaler()
    ad_data[numerical_features] = scaler.fit_transform(ad_data[numerical_features])
     # Save the scaler
    joblib.dump(scaler, "src/models/machine_learning_models/encoders/numerical_scaler.pkl")


    
        

    # Encode categorical features (inline, no persistence)
    categorical_features = ['Target_Audience', 'Campaign_Goal', 'Channel_Used', 'Language', 'Customer_Segment']
    encoders = {}
    for col in categorical_features:
        le = LabelEncoder()
        ad_data[col] = le.fit_transform(ad_data[col])
        encoders[col] = le
        joblib.dump(le, f"src/models/machine_learning_models/encoders/{col}_encoder.pkl")
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