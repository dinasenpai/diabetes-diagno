import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';
import ModelComparison from './wrath/ModelComparison';
import AdvancedChart3D from './wrath/AdvancedChart3D';
import GaugeCharts from './wrath/GaugeCharts';
import AnalysisExplanation from './wrath/AnalysisExplanation';

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modelData, setModelData] = useState(null);

  useEffect(() => {
    const fetchModelComparison = async () => {
      try {
        const response = await axios.get("http://localhost:5000/compare-models");
        setModelData(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching model comparison:", err);
        setError(err.message || "Failed to load model comparison data");
        setIsLoading(false);
      }
    };

    fetchModelComparison();
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <h2>Processing Model Comparison...</h2>
        <p>Please wait while we analyze the dataset of 10,000 entries</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>⚠️ Error Loading Dashboard</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1 style={{ textAlign: 'center', color: '#1e3a8a', marginBottom: '30px' }}>
        Diabetes Analysis Dashboard
      </h1>

      <div className="component-container fade-in">
        <AnalysisExplanation data={modelData} />
      </div>

      <div className="component-container fade-in" style={{ animationDelay: '0.2s' }}>
        <ModelComparison data={modelData} />
      </div>

      <div className="component-container fade-in" style={{ animationDelay: '0.4s' }}>
        <GaugeCharts data={modelData} /> 
      </div>

      <div className="component-container fade-in" style={{ animationDelay: '0.6s' }}>
        <AdvancedChart3D data={modelData} />
      </div>
    </div>
  );
}

export default Dashboard;