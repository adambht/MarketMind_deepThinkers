import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

def train_ctr_model(X_train, y_train):
    """
    Train a Random Forest model to predict CTR.
    
    Returns:
        trained model
    """
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    model_columns = X_train.columns.tolist()
    
    # Save the model after training
    joblib.dump(model, 'src/models/machine_learning_models/ctr_model.pkl')
    joblib.dump(model_columns,'src/models/machine_learning_models/model_columns.pkl') 
# Save this list to a file
# You can specify the path if needed
    
    return model

def evaluate_ctr_model(model, X_test, y_test):
    """
    Evaluate the trained CTR model on test data.
    """
    predictions = model.predict(X_test)
    mse = mean_squared_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)
    print(f"Mean Squared Error: {mse:.4f}")
    print(f"R^2 Score: {r2:.4f}")
    return predictions

