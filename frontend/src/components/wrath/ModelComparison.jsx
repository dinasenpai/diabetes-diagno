import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';

const ModelComparison = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/compare-models");
        setData(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading model comparison data</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '30px', color: '#e53e3e' }}>
        <h3>⚠️ Error Loading Model Data</h3>
        <p>{error}</p>
        <p>Please check your backend connection and try again.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '30px', color: '#e53e3e' }}>
        <h3>⚠️ Unable to load model data</h3>
        <p>Please check your backend connection and try again.</p>
      </div>
    );
  }

  // Convert backend data into chart-friendly format
  const chartData = [
    {
      metric: "Accuracy",
      RandomForest: data.RandomForest.accuracy,
      SVM: data.SVM.accuracy,
    },
    {
      metric: "Precision",
      RandomForest: data.RandomForest.precision,
      SVM: data.SVM.precision,
    },
    {
      metric: "Recall",
      RandomForest: data.RandomForest.recall,
      SVM: data.SVM.recall,
    },
    {
      metric: "F1 Score",
      RandomForest: data.RandomForest.f1_score,
      SVM: data.SVM.f1_score,
    },
  ];

  const customToolTip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '10px', 
          border: '1px solid #ccc',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{`Metric: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ 
              margin: '5px 0 0', 
              color: entry.color 
            }}>
              {`${entry.name}: ${(entry.value * 100).toFixed(1)}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ textAlign: "center" }}>📊 Model Performance Comparison</h2>

      <div className="chart-container" style={{ margin: '30px 0' }}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="metric" tick={{ fill: '#334155' }} />
            <YAxis domain={[0, 1]} tickFormatter={(tick) => `${(tick * 100)}%`} tick={{ fill: '#334155' }} />
            <Tooltip content={customToolTip} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="RandomForest" fill="#8884d8" name="Random Forest" radius={[4, 4, 0, 0]} />
            <Bar dataKey="SVM" fill="#82ca9d" name="SVM" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3 style={{ textAlign: "center", marginTop: "50px" }}>📊 Radar Chart Comparison</h3>

      <div className="radar-container" style={{ margin: '30px 0' }}>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={chartData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: '#334155' }} />
            <PolarRadiusAxis angle={30} domain={[0, 1]} tickFormatter={(tick) => `${(tick * 100)}%`} tick={{ fill: '#334155' }} />
            <Radar name="Random Forest" dataKey="RandomForest" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Radar name="SVM" dataKey="SVM" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Tooltip content={customToolTip} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="confusion-matrices" style={{ marginTop: "50px" }}>
        <h3 style={{ textAlign: "center" }}>Confusion Matrices</h3>

        <div style={{ 
          display: "flex", 
          gap: "50px", 
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          marginTop: "30px"
        }}>
          {/* Random Forest Confusion Matrix */}
          <div className="matrix-container">
            <h4 style={{ textAlign: "center", marginBottom: "15px" }}>Random Forest</h4>
            <table>
              <thead>
                <tr>
                  <th>Actual \ Predicted</th>
                  <th>Negative</th>
                  <th>Positive</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: "bold" }}>Negative</td>
                  <td style={{ backgroundColor: "#c6f6d5" }}>{data.RandomForest.confusion_matrix[0][0]}</td>
                  <td style={{ backgroundColor: "#fed7d7" }}>{data.RandomForest.confusion_matrix[0][1]}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold" }}>Positive</td>
                  <td style={{ backgroundColor: "#fed7d7" }}>{data.RandomForest.confusion_matrix[1][0]}</td>
                  <td style={{ backgroundColor: "#c6f6d5" }}>{data.RandomForest.confusion_matrix[1][1]}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SVM Confusion Matrix */}
          <div className="matrix-container">
            <h4 style={{ textAlign: "center", marginBottom: "15px" }}>SVM</h4>
            <table>
              <thead>
                <tr>
                  <th>Actual \ Predicted</th>
                  <th>Negative</th>
                  <th>Positive</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: "bold" }}>Negative</td>
                  <td style={{ backgroundColor: "#c6f6d5" }}>{data.SVM.confusion_matrix[0][0]}</td>
                  <td style={{ backgroundColor: "#fed7d7" }}>{data.SVM.confusion_matrix[0][1]}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold" }}>Positive</td>
                  <td style={{ backgroundColor: "#fed7d7" }}>{data.SVM.confusion_matrix[1][0]}</td>
                  <td style={{ backgroundColor: "#c6f6d5" }}>{data.SVM.confusion_matrix[1][1]}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelComparison;