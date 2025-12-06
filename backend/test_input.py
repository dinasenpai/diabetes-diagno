import json
import sys
import os
import pickle
import numpy as np
import pandas as pd
from sklearn.preprocessing import RobustScaler

# Test data matching production format
test_data = {
    "age": 21,
    "hypertension": 0,
    "heart_disease": 1,
    "BMI": 27.89,
    "HbA1C_level": 6.6,
    "blood_glucose_level": 100,
    "gender": "Male",
    "smoking_history": "never"
}

print("Test data:", json.dumps(test_data, indent=2))

# Run prediction and capture output
try:
    # Load the trained Random Forest model
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, 'random_forest_model.pkl')
    
    if not os.path.exists(model_path):
        print(f"Error: Model not found at {model_path}", file=sys.stderr)
        sys.exit(1)
    
    with open(model_path, 'rb') as file:
        model = pickle.load(file)
    
    # Prepare input data (one-hot encode categorical features)
    input_df = pd.DataFrame([test_data])
    input_df = pd.get_dummies(input_df, columns=['gender', 'smoking_history'], drop_first=True)
    
    # Get feature names from model and align input
    feature_names = ['age', 'hypertension', 'heart_disease', 'BMI', 'HbA1C_level', 
                     'blood_glucose_level', 'gender_Female', 'smoking_history_current', 
                     'smoking_history_ever', 'smoking_history_former', 'smoking_history_not current', 
                     'smoking_history_never']
    
    # Ensure all expected features are present
    for feature in feature_names:
        if feature not in input_df.columns:
            input_df[feature] = 0
    
    # Reorder columns to match training
    input_df = input_df[feature_names]
    
    # Make prediction
    prediction = model.predict(input_df)[0]
    probability = model.predict_proba(input_df)[0]
    
    result = {
        'prediction': int(prediction),
        'probability_no_diabetes': round(float(probability[0]), 3),
        'probability_diabetes': round(float(probability[1]), 3),
        'input': test_data
    }
    
    print(json.dumps(result, indent=2))
    
except Exception as e:
    print(f"Error during prediction: {str(e)}", file=sys.stderr)
    import traceback
    traceback.print_exc()