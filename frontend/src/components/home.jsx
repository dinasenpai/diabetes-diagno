import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();

  const handlePatientInputRedirect = () => {
    navigate("/patient");
  };

  const handlePatientHistoryRedirect = () => {
    navigate("/history");
  };

  return (
    <div className="_03-all-records-page">
      <div className="rectangle-9"></div>
      <img className="image" src="healthp.png" alt="Image" />
      <div className="rectangle-13"></div>
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
      <div
        className="patient-history"
        onClick={handlePatientHistoryRedirect}
        style={{ cursor: "pointer" }}
      >
        Patient History
      </div>
      <div
        className="patient-input"
        onClick={handlePatientInputRedirect}
        style={{ cursor: "pointer" }}
      >
        Patient Input
      </div>
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
      <img className="group" src="healthbook.png" alt="Group" />

    </div>
  );
};

export default Home;