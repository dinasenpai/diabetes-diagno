import sys
import os
import json
import pickle
import traceback
import numpy as np
import pandas as pd
from sklearn.preprocessing import RobustScaler

def preprocess_input(data):
    try:
        # Print debug info
        print("Data received in preprocess:", data, file=sys.stderr)
        
        # Convert data to dictionary if it's a string
        if isinstance(data, str):
            data = json.loads(data)
            
        # Convert input data to DataFrame with explicit data structure
        input_data = {
            'age': [int(data['age'])],
            'hypertension': [int(data['hypertension'])],
            'heart_disease': [int(data['heart_disease'])],
            'BMI': [float(data['BMI'])],
            'HbA1C_level': [float(data['HbA1C_level'])],
            'blood_glucose_level': [float(data['blood_glucose_level'])],
            'gender': [str(data['gender'])],
            'smoking_history': [str(data['smoking_history'])]
        }
        
        input_df = pd.DataFrame(input_data)
        
        # Handle numerical features - use exact column names from input
        numeric_columns = ['BMI', 'HbA1C_level', 'blood_glucose_level']
        
        # Print column names for debugging
        print("Available columns:", input_df.columns.tolist(), file=sys.stderr)
        print("Looking for columns:", numeric_columns, file=sys.stderr)
        
        # Handle numerical features
        input_df[numeric_columns] = input_df[numeric_columns].replace(0, np.NaN)
        
        # Create dummy variables for categorical features
        input_df = pd.get_dummies(input_df, columns=['gender', 'smoking_history'])
        
        # Map 'not current' to 'ever' in smoking history
        if 'smoking_history_not current' in input_df.columns:
            input_df['smoking_history_ever'] = input_df['smoking_history_not current']
            input_df = input_df.drop('smoking_history_not current', axis=1)
        
        # Define columns in exact order from model training (remove gender_Other if not in model)
        model_columns = [
            'age', 'hypertension', 'heart_disease', 'BMI', 'HbA1C_level',
            'blood_glucose_level','Outcome', 'gender_Male',
            'smoking_history_current', 'smoking_history_ever',
            'smoking_history_former', 'smoking_history_never'
        ]
        
        # Add missing columns with 0s
        for col in model_columns:
            if col not in input_df.columns:
                input_df[col] = 0
        
        # Ensure columns are in the exact order as training data
        input_df = input_df[model_columns]
        
        return input_df
        
    except Exception as e:
        print(f"Error in preprocess_input: {str(e)}", file=sys.stderr)
        raise

def predict():
    try:
        # Read input from stdin
        input_json = sys.stdin.read()
        input_data = json.loads(input_json)
        
        # Load the model
        model_path = os.path.join(os.path.dirname(__file__), 'random_forest_model.pkl')
        with open(model_path, 'rb') as file:
            model = pickle.load(file)
        
        # Debug logs to stderr
        print("Input received:", input_json, file=sys.stderr)
        print("Model features:", model.feature_names_in_, file=sys.stderr)
        
        # Preprocess input data
        processed_input = preprocess_input(input_data)
        print("Processed input:", processed_input, file=sys.stderr)
        
        # Make prediction
        prediction = model.predict(processed_input)
        prediction_proba = model.predict_proba(processed_input)
        
        # Only output the JSON result to stdout
        result = {
            'prediction': 'Yes' if prediction[0] == 1 else 'No',
            'probability': float(prediction_proba[0][1])
        }
        
        # Send only the result JSON to stdout
        print(json.dumps(result))
        
    except Exception as e:
        error_msg = {'error': str(e), 'traceback': traceback.format_exc()}
        print(json.dumps(error_msg), file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    predict()