import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { predictionAPI } from "../services/api";
import "./patient.css";

const Patient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    heartDisease: "",
    hypertension: "",
    age: "",
    gender: "",
    smoking_history: "", // Updated from smokingHistory
    blood_glucose_level: "", // Updated from bloodGlucose
    HbA1C_level: "", // Updated from hba1cLevel
    BMI: "", // Updated from bmi
    managementSuggestions: ""
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error on input change
  };

  const handleBackRedirect = () => {
    navigate("/home");
  };

  const handleSubmitRedirect = async () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "This field is required";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorField = Object.keys(newErrors)[0];
      document.getElementsByName(firstErrorField)[0].scrollIntoView({ behavior: "smooth" });
    } else {
      try {
        const response = await predictionAPI.submitPrediction(formData);
        navigate("/output", { state: { prediction: response.data } });
      } catch (error) {
        console.error("Error submitting prediction:", error);
        setErrors({ submit: "Failed to process prediction. Please try again." });
      }
    }
  };

  return (
    <div className="input-container">
      <div className="rectangle-23">
      <img src="/healthbook.png" alt="HealthBook Logo" className="patient-logo" />
      <div className="patient-subtitle">Enter patient details to predict diabetes risk</div>
      <svg className="page-bg-svg" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="720" cy="200" rx="700" ry="180" fill="#fff" fillOpacity="0.08"/>
  <ellipse cx="200" cy="700" rx="300" ry="100" fill="#13a08a" fillOpacity="0.07"/>
</svg>
<div className="floating-shape shape1"></div>
<div className="floating-shape shape2"></div>
<div className="floating-shape shape3"></div>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="input-box"
          value={formData.name}
          onChange={handleInputChange}
        />
        {errors.name && <div className="error-message">{errors.name}</div>}
      </div>
      <div className="rectangle-21">
        <select
          name="heartDisease"
          className="input-box"
          value={formData.heartDisease}
          onChange={handleInputChange}
        >
          <option value="">Heart Disease</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        {errors.heartDisease && <div className="error-message">{errors.heartDisease}</div>}
      </div>
      <div className="rectangle-14">
        <select
          name="hypertension"
          className="input-box"
          value={formData.hypertension}
          onChange={handleInputChange}
        >
          <option value="">Hypertension</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        {errors.hypertension && <div className="error-message">{errors.hypertension}</div>}
      </div>
      <div className="rectangle-15">
        <input
          type="number"
          name="age"
          placeholder="Age"
          className="input-box"
          value={formData.age}
          onChange={handleInputChange}
          min={0}
          max={140}
          onInput={e => {
            if (e.target.value !== '' && (parseInt(e.target.value) < 0 || parseInt(e.target.value) > 140)) {
              e.target.value = Math.max(0, Math.min(140, parseInt(e.target.value)));
            }
          }}
        />
        {errors.age && <div className="error-message">{errors.age}</div>}
      </div>
      <div className="rectangle-16">
        <select
          name="gender"
          className="input-box"
          value={formData.gender}
          onChange={handleInputChange}
        >
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        {errors.gender && <div className="error-message">{errors.gender}</div>}
      </div>
      <div className="rectangle-17">
        <select
          name="smoking_history"
          className="input-box"
          value={formData.smoking_history}
          onChange={handleInputChange}
        >
          <option value="">Smoking History</option>
          <option value="never">Never</option>
          <option value="no info">No Info</option>
          <option value="current">Current</option>
          <option value="former">Former</option>
          <option value="not current">Not Current</option>
        </select>
        {errors.smoking_history && <div className="error-message">{errors.smoking_history}</div>}
      </div>
      <div className="rectangle-18">
        <input
          type="number"
          step="0.01"
          name="blood_glucose_level"
          placeholder="Blood Glucose"
          className="input-box"
          value={formData.blood_glucose_level}
          onChange={handleInputChange}
          min={45}
          max={270}
          onBlur={e => {
            const val = e.target.value;
            if (val === "") return;
            let num = parseFloat(val);
            if (num < 45) num = 45;
            if (num > 270) num = 270;
            if (num !== parseFloat(val)) e.target.value = num;
            setFormData(prev => ({ ...prev, blood_glucose_level: num }));
          }}
        />
        {errors.blood_glucose_level && <div className="error-message">{errors.blood_glucose_level}</div>}
      </div>
      <div className="rectangle-19">
        <input
          type="number"
          step="0.01"
          name="HbA1C_level"
          placeholder="HbA1C Level"
          className="input-box"
          value={formData.HbA1C_level}
          onChange={handleInputChange}
          min={3}
          max={15}
          onBlur={e => {
            const val = e.target.value;
            if (val === "") return;
            let num = parseFloat(val);
            if (num < 3) num = 3;
            if (num > 15) num = 15;
            if (num !== parseFloat(val)) e.target.value = num;
            setFormData(prev => ({ ...prev, HbA1C_level: num }));
          }}
        />
        {errors.HbA1C_level && <div className="error-message">{errors.HbA1C_level}</div>}
      </div>
      <div className="rectangle-22">
        <input
          type="number"
          step="0.01"
          name="BMI"
          placeholder="BMI"
          className="input-box"
          value={formData.BMI}
          onChange={handleInputChange}
          min={15}
          max={60}
          onBlur={e => {
            const val = e.target.value;
            if (val === "") return;
            let num = parseFloat(val);
            if (num < 15) num = 15;
            if (num > 60) num = 60;
            if (num !== parseFloat(val)) e.target.value = num;
            setFormData(prev => ({ ...prev, BMI: num }));
          }}
        />
        {errors.BMI && <div className="error-message">{errors.BMI}</div>}
      </div>
      <div className="rectangle-24">
        <textarea
          name="managementSuggestions"
          placeholder="Management Suggestions"
          className="input-box"
          value={formData.managementSuggestions}
          onChange={handleInputChange}
        />
        {errors.managementSuggestions && <div className="error-message">{errors.managementSuggestions}</div>}
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
    </div>
  );
};

export default Patient;