import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPopup, setShowPopup] = useState(false);

  const handlePatientInputRedirect = () => {
    navigate("/patient");
  };

  const handlePatientHistoryRedirect = () => {
    if (user) {
      navigate("/history");
    } else {
      setShowPopup(true);
    }
  };

  const handleModelAnalysisRedirect = () => {
    navigate("/dashboard");
  };

  return (
    <div className="_03-all-records-page">
      <div className="rectangle-9" onClick={handlePatientInputRedirect}>
        <img className="image" src="healthp.png" alt="Image" />
        <div className="patient-input">Patient Input</div>
        <svg className="vector3"
          width="10"
          height="18"
          viewBox="0 0 10 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.61753 -8.37173e-07L10 9L0.617528 18L-1.85661e-06 17.4076L8.75498 9L-4.16303e-07 0.592357L0.61753 -8.37173e-07Z"
            fill="#333333"
          />
        </svg>
      </div>

      <div className="rectangle-13" onClick={handlePatientHistoryRedirect}>
        <img className="group" src="healthbook.png" alt="Group" />
        <div className="patient-history">Patient History</div>
        <svg className="vector2"
          width="10"
          height="18"
          viewBox="0 0 10 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.61753 -8.37173e-07L10 9L0.617528 18L-1.85661e-06 17.4076L8.75498 9L-4.16303e-07 0.592357L0.61753 -8.37173e-07Z"
            fill="#333333"
          />
        </svg>
      </div>

      <div className="rectangle-30" onClick={handleModelAnalysisRedirect}>
        <img className="group" src="dna.png" alt="Group" />
        <div className="model-analysis">Model Analysis</div>
        <svg className="vector2"
          width="10"
          height="18"
          viewBox="0 0 10 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.61753 -8.37173e-07L10 9L0.617528 18L-1.85661e-06 17.4076L8.75498 9L-4.16303e-07 0.592357L0.61753 -8.37173e-07Z"
            fill="#333333"
          />
        </svg>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>You need to login first to visit "patient history".</p>
            <button onClick={() => setShowPopup(false)} className="close-popup">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;