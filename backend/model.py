import numpy as np
import pandas as pd
import json
import pickle
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.preprocessing import RobustScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
import os
import sys
from sklearn.utils import shuffle

def train_model(file_path, sample_size=None):
    try:
        print(f"Attempting to load dataset from: {file_path}", file=sys.stderr)
        
        # Load the dataset
        df = pd.read_csv(file_path)
        print(f"Successfully loaded dataset with {len(df)} rows", file=sys.stderr)

        # If sample_size is provided, take a random sample
        if sample_size and sample_size < len(df):
            df = shuffle(df, random_state=42).iloc[:sample_size]
            print(f"Using random sample of {sample_size} rows for initial testing", file=sys.stderr)

        # Data Preprocessing
        print("Starting data preprocessing...", file=sys.stderr)
        df[['BMI', 'HbA1C_level', 'blood_glucose_level']] = df[['BMI', 'HbA1C_level', 'blood_glucose_level']].replace(0, np.NaN)
        
        for column in ['BMI', 'HbA1C_level', 'blood_glucose_level']:
            df[column].fillna(df[column].median(), inplace=True)

        df = pd.get_dummies(df, columns=['gender', 'smoking_history'], drop_first=True)
        print("Data preprocessing completed", file=sys.stderr)

        print("Preparing features and target...", file=sys.stderr)
        y = df["Outcome"]
        X = df.drop(["Outcome"], axis=1)

        transformer = RobustScaler().fit(X)
        X = transformer.transform(X)
        X = pd.DataFrame(X, columns=df.columns[:-1])

        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        print(f"Train set size: {len(X_train)}, Test set size: {len(X_test)}", file=sys.stderr)

        print("Starting Random Forest training...", file=sys.stderr)
        rf = RandomForestClassifier(
            n_estimators=100,
            n_jobs=-1,  # Use all CPU cores
            random_state=42
        )
        rf.fit(X_train, y_train)
        print("Random Forest training completed", file=sys.stderr)
        
        print("Starting SVM training (this may take a while)...", file=sys.stderr)
        svm = SVC(
            kernel='rbf',
            random_state=42,
            probability=True,
            cache_size=1000  # Increase cache size to 1000MB
        )
        svm.fit(X_train, y_train)
        print("SVM training completed", file=sys.stderr)

        print("Calculating predictions and metrics...", file=sys.stderr)
        rf_pred = rf.predict(X_test)
        svm_pred = svm.predict(X_test)

        def get_metrics(y_true, y_pred):
            return {
                'accuracy': round(accuracy_score(y_true, y_pred), 3),
                'precision': round(precision_score(y_true, y_pred), 3),
                'recall': round(recall_score(y_true, y_pred), 3),
                'f1_score': round(f1_score(y_true, y_pred), 3),
                'confusion_matrix': confusion_matrix(y_true, y_pred).tolist()
            }

        results = {
            'RandomForest': get_metrics(y_test, rf_pred),
            'SVM': get_metrics(y_test, svm_pred),
            'dataset_size': len(df)
        }

        # Save the Random Forest model
        model_path = os.path.join(os.path.dirname(file_path), 'random_forest_model.pkl')
        with open(model_path, 'wb') as file:
            pickle.dump(rf, file)
        print("Random Forest model saved successfully", file=sys.stderr)

        print("Model comparison completed successfully", file=sys.stderr)
        print(json.dumps(results))
        sys.stdout.flush()
        return results

    except Exception as e:
        error_message = {'error': str(e)}
        print(json.dumps(error_message), file=sys.stderr)
        sys.stderr.flush()
        raise

if __name__ == '__main__':
    try:
        # Get the directory containing this script
        script_dir = os.path.dirname(os.path.abspath(__file__))
        # Construct absolute path to the dataset
        dataset_path = os.path.abspath(os.path.join(script_dir, 'diabetes_prediction_dataset.csv'))
        print(f"Script directory: {script_dir}", file=sys.stderr)
        print(f"Dataset path: {dataset_path}", file=sys.stderr)
        
        # For initial testing, use a smaller sample size (e.g., 10000 rows)
        train_model(dataset_path, sample_size=10000)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)
