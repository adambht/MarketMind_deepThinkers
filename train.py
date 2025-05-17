#path: src/models/machine_learning_model/ctr_model.py
import pandas as pd
from src.utils.data_preprocessing import preprocess_ad_data, split_ad_data
from src.utils.model_training import train_ctr_model, evaluate_ctr_model
import joblib

# Load your raw ad data
data = pd.read_csv("src/data/Ad_Performance/Social_Media_Advertising.csv")

# Preprocess the data
processed_data = preprocess_ad_data(data)

# Split into train and test sets
X_train, X_test, y_train, y_test = split_ad_data(processed_data)

# Show some results
print("Training features shape:", X_train.shape)
print("Test features shape:", X_test.shape)
print("First few rows of training features:\n", X_train.head())

# Train model
model = train_ctr_model(X_train, y_train)

# Evaluate
predictions = evaluate_ctr_model(model, X_test, y_test)


