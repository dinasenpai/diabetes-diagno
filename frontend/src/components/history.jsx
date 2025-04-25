import React from "react";
import { useNavigate } from "react-router-dom";
import "./history.css";

const History = () => {
  const navigate = useNavigate();

  const handleBackRedirect = () => {
    navigate("/home");
  };

  // Mock data for now (replace with database values later)
  const data = {
    diagnoses: "Diabetes Type 2",
    totalRecord: "5 Records",
    deleteRecord: "No",
    date: "Monday, 27 March 2023",
    center: "Healthy Family Center",
    heartDisease: "Yes",
    hbA1CLevel: "7.5%",
    bloodGlucoseLevel: "180 mg/dL",
    diabetesOutput: "Positive",
  };

  return (
    <div className="_04-report-page">
      <div className="rectangle-1"></div>
      <div className="frame-13">
        <div className="rectangle-6"></div>
        <div className="frame-9">
          <div className="search-your-report">Search your report</div>
        </div>
      </div>
      <div className="rectangle-7">
        <div className="data-container">
          <div className="data-label">Diagnoses:</div>
          <div className="data-value">{data.diagnoses}</div>
        </div>
        <div className="data-container">
          <div className="data-label">Total Record:</div>
          <div className="data-value">{data.totalRecord}</div>
        </div>
        <div className="data-container">
          <div className="data-label">Delete Record:</div>
          <div className="data-value">{data.deleteRecord}</div>
        </div>
        <div className="data-container">
          <div className="data-label">Date:</div>
          <div className="data-value">{data.date}</div>
        </div>
        <div className="data-container">
          <div className="data-label">Center:</div>
          <div className="data-value">{data.center}</div>
        </div>
        <div className="data-container">
          <div className="data-label">Heart Disease:</div>
          <div className="data-value">{data.heartDisease}</div>
        </div>
        <div className="data-container">
          <div className="data-label">HbA1C Level:</div>
          <div className="data-value">{data.hbA1CLevel}</div>
        </div>
        <div className="data-container">
          <div className="data-label">Blood Glucose Level:</div>
          <div className="data-value">{data.bloodGlucoseLevel}</div>
        </div>
        <div className="data-container">
          <div className="data-label">Diabetes Output:</div>
          <div className="data-value">{data.diabetesOutput}</div>
        </div>
      </div>
      <div className="frame-14">
        <div className="rectangle-22"></div>
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