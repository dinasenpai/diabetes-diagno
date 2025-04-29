import json
import sys
from io import StringIO
from predict_diabetes import predict

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

# Simulate stdin input
sys.stdin = StringIO(json.dumps(test_data))

# Run prediction and capture output
try:
    predict()
except Exception as e:
    print(f"Error during prediction: {str(e)}", file=sys.stderr)