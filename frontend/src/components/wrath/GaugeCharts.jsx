import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const GaugeCharts = () => {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/compare-models");
        setMetrics({
          RandomForest: {
            accuracy: response.data.RandomForest.accuracy,
            precision: response.data.RandomForest.precision,
            recall: response.data.RandomForest.recall
          },
          SVM: {
            accuracy: response.data.SVM.accuracy,
            precision: response.data.SVM.precision,
            recall: response.data.SVM.recall
          }
        });
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
    return <div className="loading">Loading model metrics</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '30px', color: '#e53e3e' }}>
        <h3>⚠️ Error Loading Metrics</h3>
        <p>{error}</p>
        <p>Please check your backend connection and try again.</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div style={{ textAlign: 'center', padding: '30px', color: '#e53e3e' }}>
        <h3>⚠️ Unable to load metrics</h3>
        <p>Please check your backend connection and try again.</p>
      </div>
    );
  }

  const createGaugePlot = (modelName, metric, value, color) => {
    // Determine color based on value
    const gaugeColor = value >= 0.9 ? color : value >= 0.7 ? '#ffb74d' : '#ef5350';
    
    return (
      <div key={`${modelName}-${metric}`} className="gauge-chart" style={{ margin: '10px' }}>
        <Plot
          data={[
            {
              type: "indicator",
              mode: "gauge+number",
              value,
              title: { 
                text: `${metric.charAt(0).toUpperCase() + metric.slice(1)}`, 
                font: { size: 18, color: '#334155', family: 'Poppins' } 
              },
              number: { 
                suffix: '%', 
                valueformat: '.1f',
                font: { size: 20, color: '#334155', family: 'Poppins' }
              },
              gauge: {
                axis: { 
                  range: [0, 100],
                  tickwidth: 1,
                  tickcolor: "#e2e8f0",
                  nticks: 5
                },
                bar: { color: gaugeColor, thickness: 0.75 },
                borderwidth: 2,
                bordercolor: "#e2e8f0",
                steps: [
                  { range: [0, 0.5], color: "#ffecb3" },
                  { range: [0.5, 0.75], color: "#e8f5e9" },
                  { range: [0.75, 1], color: "#e3f2fd" }
                ],
                threshold: {
                  line: { color: "red", width: 4 },
                  thickness: 0.75,
                  value: 90
                }
              }
            }
          ]}
          layout={{
            width: 300,
            height: 250,
            margin: { t: 40, b: 20, l: 20, r: 20 },
            paper_bgcolor: "rgba(0,0,0,0)",
            font: { family: "Poppins" }
          }}
          config={{ responsive: true, displayModeBar: false }}
        />
      </div>
    );
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>📊 Model Metric Gauges</h2>

      <h3 style={{ textAlign: 'center', marginTop: '30px' }}>🔹 Random Forest</h3>
      <div className="gauge-charts-row">
        {Object.entries(metrics.RandomForest).map(([metric, value]) =>
          createGaugePlot("RandomForest", metric, value*100, "#8884d8")
        )}
      </div>

      <h3 style={{ textAlign: 'center', marginTop: '30px' }}>🔹 SVM</h3>
      <div className="gauge-charts-row">
        {Object.entries(metrics.SVM).map(([metric, value]) =>
          createGaugePlot("SVM", metric, value*100, "#82ca9d")
        )}
      </div>
      
      <div className="gauge-explanation" style={{ 
        backgroundColor: '#f8fafc', 
        padding: '20px', 
        borderRadius: '8px', 
        margin: '30px auto',
        maxWidth: '800px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Understanding the Gauge Charts</h4>
        <p>
          Each gauge chart displays a model's performance metric on a scale from 0 to 100%. 
          The colored regions on the gauge represent different levels of performance:
        </p>
        <ul style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '10px' }}>
          <li style={{ flex: '1 1 200px' }}><strong>90-100%</strong>: Excellent performance (blue region)</li>
          <li style={{ flex: '1 1 200px' }}><strong>75-90%</strong>: Good performance (green region)</li>
          <li style={{ flex: '1 1 200px' }}><strong>50-75%</strong>: Moderate performance (yellow region)</li>
          <li style={{ flex: '1 1 200px' }}><strong>0-50%</strong>: Poor performance (red region)</li>
        </ul>
        <p style={{ marginTop: '15px' }}>
          The red threshold line at 90% marks the boundary for excellent performance. 
          For medical diagnostic applications like CKD detection, metrics above this line 
          are generally preferred for clinical implementation.
        </p>
      </div>
    </div>
  );
};

export default GaugeCharts;