import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { predictionAPI } from "../services/api";
import "./history.css";

const History = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPopup, setShowPopup] = useState(!user);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setShowPopup(false);
      setLoading(true);
      predictionAPI.getPredictionHistory()
        .then(res => {
          setPredictions(res.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch prediction history.");
          setLoading(false);
        });
    } else {
      setShowPopup(true);
    }
  }, [user]);

  const handleBackRedirect = () => {
    navigate("/home");
  };

  return (
    <div className="_04-report-page">
      <div className="rectangle-1"></div>
      <div className="frame-13">
        <div className="rectangle-6"></div>
        {/* Removed search bar */}
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>You need to login first to visit "patient history".</p>
            <button onClick={() => setShowPopup(false)} className="close-popup">Close</button>
          </div>
        </div>
      )}
      {user && (
        <div className="history-scroll-list">
          {loading && <div>Loading...</div>}
          {error && <div className="error-message">{error}</div>}
          {predictions.length === 0 && !loading && !error && (
            <div>No prediction history found.</div>
          )}
          {predictions.map((pred, idx) => (
            <div className="history-card" key={pred._id || idx}>
              <div><strong>Date:</strong> {new Date(pred.createdAt).toLocaleString()}</div>
              <div><strong>Name:</strong> {pred.name}</div>
              <div><strong>Age:</strong> {pred.age}</div>
              <div><strong>Gender:</strong> {pred.gender}</div>
              <div><strong>Heart Disease:</strong> {pred.heart_disease ? "Yes" : "No"}</div>
              <div><strong>Hypertension:</strong> {pred.hypertension ? "Yes" : "No"}</div>
              <div><strong>Smoking History:</strong> {pred.smoking_history}</div>
              <div><strong>BMI:</strong> {pred.BMI}</div>
              <div><strong>HbA1C Level:</strong> {pred.HbA1C_level}</div>
              <div><strong>Blood Glucose Level:</strong> {pred.blood_glucose_level}</div>
              <div><strong>Prediction:</strong> {pred.predictionResult || pred.prediction}</div>
              <div><strong>Management Suggestions:</strong> {pred.managementSuggestions}</div>
            </div>
          ))}
        </div>
      )}
      <div className="frame-14">
        <div className="rectangle-77"></div>
        <div
          className="back1"
          onClick={handleBackRedirect}
          style={{ cursor: "pointer" }}
        >
          Back
        </div>
      </div>
    </div>
  );
};

export default History;