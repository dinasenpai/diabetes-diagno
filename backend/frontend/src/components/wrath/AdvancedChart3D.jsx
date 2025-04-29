import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const AdvancedChart3D = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rotation, setRotation] = useState({
    x: 30,
    y: 30,
    z: 0
  });

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

  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '30px', color: '#e53e3e' }}>
        <h3>⚠️ Unable to load metrics</h3>
        <p>Please check your backend connection and try again.</p>
      </div>
    );
  }

  const models = ['Random Forest', 'SVM'];
  const accuracy = [data.RandomForest.accuracy, data.SVM.accuracy];
  const precision = [data.RandomForest.precision, data.SVM.precision];
  const recall = [data.RandomForest.recall, data.SVM.recall];

  const handleViewChange = (view) => {
    switch(view) {
      case 'front':
        setRotation({ x: 0, y: 0, z: 0 });
        break;
      case 'top':
        setRotation({ x: 90, y: 0, z: 0 });
        break;
      case 'side':
        setRotation({ x: 0, y: 90, z: 0 });
        break;
      case 'perspective':
        setRotation({ x: 30, y: 30, z: 0 });
        break;
      default:
        setRotation({ x: 30, y: 30, z: 0 });
    }
  };

  const trace1 = {
    x: accuracy,
    y: precision,
    z: recall,
    mode: 'markers+text',
    text: models,
    textposition: 'top center',
    textfont: {
      family: 'Poppins',
      size: 12,
      color: '#334155'
    },
    type: 'scatter3d',
    marker: { 
      size: 12, 
      color: ['#8884d8', '#82ca9d'],
      opacity: 0.8,
      symbol: 'circle'
    },
    hoverinfo: 'text',
    hovertext: models.map((model, idx) => 
      `${model}<br>Accuracy: ${(accuracy[idx] * 100).toFixed(1)}%<br>` +
      `Precision: ${(precision[idx] * 100).toFixed(1)}%<br>` +
      `Recall: ${(recall[idx] * 100).toFixed(1)}%`
    )
  };

  // Add planes at each axis
  const planeZ = {
    x: [0, 1, 1, 0, 0],
    y: [0, 0, 1, 1, 0],
    z: [0, 0, 0, 0, 0],
    type: 'scatter3d',
    mode: 'lines',
    line: {
      color: 'rgba(150, 150, 150, 0.3)',
      width: 1
    },
    surfaceaxis: 2,
    showlegend: false,
    hoverinfo: 'none'
  };

  const planeX = {
    x: [0, 0, 0, 0, 0],
    y: [0, 0, 1, 1, 0],
    z: [0, 1, 1, 0, 0],
    type: 'scatter3d',
    mode: 'lines',
    line: {
      color: 'rgba(150, 150, 150, 0.3)',
      width: 1
    },
    showlegend: false,
    hoverinfo: 'none'
  };

  const planeY = {
    x: [0, 0, 1, 1, 0],
    y: [0, 0, 0, 0, 0],
    z: [0, 1, 1, 0, 0],
    type: 'scatter3d',
    mode: 'lines',
    line: {
      color: 'rgba(150, 150, 150, 0.3)',
      width: 1
    },
    showlegend: false,
    hoverinfo: 'none'
  };

  // Add perfect score point
  const perfectScore = {
    x: [1],
    y: [1],
    z: [1],
    mode: 'markers+text',
    // text: ['Perfect Score'],
    textposition: 'top center',
    textfont: {
      family: 'Poppins',
      size: 10,
      color: '#9e9e9e'
    },
    type: 'scatter3d',
    marker: { 
      size: 8, 
      color: '#9e9e9e',
      opacity: 0.5,
      symbol: 'diamond'
    },
    showlegend: false,
    hoverinfo: 'text',
    hovertext: 'Perfect Score (100%, 100%, 100%)'
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ textAlign: 'center' }}>3D Plot of Model Metrics</h2>
      
      <div className="view-controls" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '10px', 
        margin: '20px 0' 
      }}>
        <button 
          onClick={() => handleViewChange('front')}
          style={{
            padding: '8px 15px',
            backgroundColor: rotation.x === 0 && rotation.y === 0 ? '#8884d8' : '#e2e8f0',
            color: rotation.x === 0 && rotation.y === 0 ? 'white' : '#334155',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontFamily: 'Poppins',
            transition: 'all 0.3s ease'
          }}
        >
          Front View
        </button>
        <button 
          onClick={() => handleViewChange('top')}
          style={{
            padding: '8px 15px',
            backgroundColor: rotation.x === 90 ? '#8884d8' : '#e2e8f0',
            color: rotation.x === 90 ? 'white' : '#334155',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontFamily: 'Poppins',
            transition: 'all 0.3s ease'
          }}
        >
          Top View
        </button>
        <button 
          onClick={() => handleViewChange('side')}
          style={{
            padding: '8px 15px',
            backgroundColor: rotation.y === 90 ? '#8884d8' : '#e2e8f0',
            color: rotation.y === 90 ? 'white' : '#334155',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontFamily: 'Poppins',
            transition: 'all 0.3s ease'
          }}
        >
          Side View
        </button>
        <button 
          onClick={() => handleViewChange('perspective')}
          style={{
            padding: '8px 15px',
            backgroundColor: rotation.x === 30 && rotation.y === 30 ? '#8884d8' : '#e2e8f0',
            color: rotation.x === 30 && rotation.y === 30 ? 'white' : '#334155',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontFamily: 'Poppins',
            transition: 'all 0.3s ease'
          }}
        >
          Perspective View
        </button>
      </div>
      
      <div className="chart-3d-container">
        <Plot
          data={[trace1, planeX, planeY, planeZ, perfectScore]}
          layout={{
            width: 700,
            height: 500,
            paper_bgcolor: 'rgba(0,0,0,0)',
            margin: { l: 0, r: 0, b: 0, t: 0, pad: 0 },
            scene: {
              xaxis: { 
                title: {
                  text: 'Accuracy',
                  font: { family: 'Poppins', size: 12, color: '#334155' }
                },
                range: [0.8, 1.05],
                backgroundcolor: 'rgb(250, 250, 252)',
                gridcolor: 'rgb(230, 230, 230)',
                showbackground: true,
                tickformat: '.0%',
                tickfont: { family: 'Poppins', size: 10 }
              },
              yaxis: { 
                title: {
                  text: 'Precision',
                  font: { family: 'Poppins', size: 12, color: '#334155' }
                },
                range: [0.8, 1.05],
                backgroundcolor: 'rgb(250, 250, 252)',
                gridcolor: 'rgb(230, 230, 230)',
                showbackground: true,
                tickformat: '.0%',
                tickfont: { family: 'Poppins', size: 10 }
              },
              zaxis: { 
                title: {
                  text: 'Recall',
                  font: { family: 'Poppins', size: 12, color: '#334155' }
                },
                range: [0.8, 1.05],
                backgroundcolor: 'rgb(250, 250, 252)',
                gridcolor: 'rgb(230, 230, 230)',
                showbackground: true,
                tickformat: '.0%',
                tickfont: { family: 'Poppins', size: 10 }
              },
              camera: {
                eye: {
                  x: rotation.x/90,
                  y: rotation.y/90,
                  z: 2
                }
              },
              aspectratio: { x: 1, y: 1, z: 1 }
            }
          }}
          config={{
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: [
              'toImage',
              'sendDataToCloud',
              'editInChartStudio',
              'toggleHover',
              'hoverClosest3d',
              'hoverCompareCartesian',
              'resetCameraLastSave3d'
            ]
          }}
        />
      </div>

      <div className="chart-explanation" style={{
        maxWidth: '800px',
        margin: '30px auto',
        padding: '20px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <h4 style={{ textAlign: 'center', marginBottom: '15px' }}>Understanding the 3D Visualization</h4>
        <p>
          This 3D plot visualizes three critical performance metrics simultaneously:
        </p>
        <ul>
          <li><strong>X-axis:</strong> Accuracy - The proportion of correctly classified instances</li>
          <li><strong>Y-axis:</strong> Precision - The proportion of true positives among positive predictions</li>
          <li><strong>Z-axis:</strong> Recall - The proportion of true positives identified correctly</li>
        </ul>
        <p style={{ marginTop: '15px' }}>
          The closer a model is to the "Perfect Score" (1.0, 1.0, 1.0) point, the better its overall performance.
          As shown in the visualization, Random Forest achieves perfect scores across all metrics, while SVM shows
          strong recall but slightly lower accuracy and precision.
        </p>
        <p style={{ marginTop: '15px', fontStyle: 'italic', color: '#64748b' }}>
          Use the view controls above to examine the model performance from different angles, or
          use your mouse to rotate, zoom, and pan the 3D chart for a more interactive experience.
        </p>
      </div>
    </div>
  );
};

export default AdvancedChart3D;