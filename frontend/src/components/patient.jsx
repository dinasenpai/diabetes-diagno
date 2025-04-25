import React from "react";
import { useNavigate } from "react-router-dom";
import "./patient.css";

const Patient = () => {
  const navigate = useNavigate();

  const handleBackRedirect = () => {
    navigate("/home");
  };

  const handleSubmitRedirect = () => {
    navigate("/output");
  };

  return (
    <div className="_03-all-records-page">
      <div className="rectangle-9">
        <input type="text" placeholder="Heart Disease" className="input-box" />
      </div>
      <div className="rectangle-14">
        <input type="text" placeholder="Hypertension" className="input-box" />
      </div>
      <div className="rectangle-15">
        <input type="text" placeholder="Age" className="input-box" />
      </div>
      <div className="rectangle-16">
        <input type="text" placeholder="Gender" className="input-box" />
      </div>
      <div className="rectangle-17">
        <input type="text" placeholder="Smoking History" className="input-box" />
      </div>
      <div className="rectangle-18">
        <input type="text" placeholder="Blood Glucose" className="input-box" />
      </div>
      <div className="rectangle-19">
        <input type="text" placeholder="HbA1C Level" className="input-box" />
      </div>
      <div className="rectangle-13">
        <input type="text" placeholder="BMI" className="input-box" />
      </div>

      <div
        className="submit"
        onClick={handleSubmitRedirect}
        style={{ cursor: "pointer" }}
      >
        Submit
      </div>
      <div
        className="back"
        onClick={handleBackRedirect}
        style={{ cursor: "pointer" }}
      >
        Back
      </div>

      <div className="patient-inputs">Patient Inputs</div>
      <img className="image-3" src="image-30.png" alt="Image" />
    </div>
  );
};

export default Patient;