import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./output.css";

const Output = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const predictionData = location.state?.prediction;
    if (predictionData) {
      setPrediction(predictionData);
    }
  }, [location]);

  const handleBack = () => {
    navigate("/patient");
  };

  if (!prediction) {
    return (
      <div className="output-container">
        <h1>No prediction data available</h1>
        <button onClick={handleBack}>Back to Patient Form</button>
      </div>
    );
  }

  return (
    <div className="output-container">
      <h1>Prediction Results</h1>
      <div className="result-card">
        <h2>Patient Information</h2>
        <p><strong>Name:</strong> {prediction.name}</p>
        <p><strong>Age:</strong> {prediction.age}</p>
        <p><strong>Gender:</strong> {prediction.gender}</p>
        
        <h2>Health Metrics</h2>
        <p><strong>BMI:</strong> {prediction.BMI}</p>
        <p><strong>HbA1C Level:</strong> {prediction.HbA1C_level}</p>
        <p><strong>Blood Glucose:</strong> {prediction.blood_glucose_level}</p>
        
        <h2>Prediction Result</h2>
        <div className={`prediction ${prediction.prediction === 'Yes' ? 'positive' : 'negative'}`}>
          <p>
            <strong>Diabetes Prediction:</strong> {prediction.prediction}
          </p>
          {prediction.probability !== undefined && (
            <p><strong>Confidence:</strong> {(prediction.probability * 100).toFixed(2)}%</p>
          )}
        </div>
        
        <h2>Management Suggestions</h2>
        <div className="suggestions">
          {prediction.managementSuggestions.split('\n').map((suggestion, index) => (
            <p key={index}>{suggestion}</p>
          ))}
        </div>
      </div>
      <button onClick={handleBack}>Back to Patient Form</button>
    </div>
  );
};

export default Output;