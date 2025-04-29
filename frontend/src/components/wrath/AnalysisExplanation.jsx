import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AnalysisExplanation = () => {
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
    return <div className="loading">Loading analysis data...</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '30px', color: '#e53e3e' }}>
        <h3>⚠️ Error Loading Analysis</h3>
        <p>{error}</p>
        <p>Please check your backend connection and try again.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '30px', color: '#e53e3e' }}>
        <h3>⚠️ Unable to load analysis</h3>
        <p>Please check your backend connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="analysis-container" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>📊 Analysis Explanation</h2>

      <section className="data-description">
        <h3>🔍 Dataset Overview</h3>
        <p>
          The analysis is based on the Chronic Kidney Disease dataset containing various medical parameters such as:
        </p>
        <ul>
          <li><strong>Demographic Data:</strong> Age, Blood Pressure</li>
          <li><strong>Blood Tests:</strong> Hemoglobin, Blood Glucose Random, Blood Urea, Serum Creatinine</li>
          <li><strong>Urine Tests:</strong> Specific Gravity, Albumin, Sugar</li>
          <li><strong>Other Parameters:</strong> Hypertension, Diabetes Mellitus, Appetite, Anemia</li>
        </ul>
      </section>

      <section className="model-comparison">
        <h3>📈 Model Performance Analysis</h3>
        
        <div className="result-cards" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px', backgroundColor: '#f0f7ff', padding: '20px', borderRadius: '10px' }}>
            <h4>Random Forest Results</h4>
            <p>
              The Random Forest model performance metrics:
            </p>
            <ul>
              <li><strong>Accuracy: {(data.RandomForest.accuracy * 100).toFixed(1)}%</strong></li>
              <li><strong>Precision: {(data.RandomForest.precision * 100).toFixed(1)}%</strong></li>
              <li><strong>Recall: {(data.RandomForest.recall * 100).toFixed(1)}%</strong></li>
              <li><strong>F1-Score: {(data.RandomForest.f1_score * 100).toFixed(1)}%</strong></li>
            </ul>
          </div>
          
          <div style={{ flex: 1, minWidth: '300px', backgroundColor: '#f0fff4', padding: '20px', borderRadius: '10px' }}>
            <h4>Support Vector Machine (SVM) Results</h4>
            <p>
              The SVM model performance metrics:
            </p>
            <ul>
              <li><strong>Accuracy: {(data.SVM.accuracy * 100).toFixed(1)}%</strong></li>
              <li><strong>Precision: {(data.SVM.precision * 100).toFixed(1)}%</strong></li>
              <li><strong>Recall: {(data.SVM.recall * 100).toFixed(1)}%</strong></li>
              <li><strong>F1-Score: {(data.SVM.f1_score * 100).toFixed(1)}%</strong></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="confusion-matrix-explanation">
        <h3>🎯 Understanding the Confusion Matrices</h3>
        
        <div className="confusion-cards" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px', backgroundColor: '#f5f0ff', padding: '20px', borderRadius: '10px' }}>
            <h4>Random Forest Confusion Matrix</h4>
            <p>
              The confusion matrix shows:
            </p>
            <ul>
              <li><strong>True Negatives ({data.RandomForest.confusion_matrix[0][0]})</strong> - Correctly identified non-CKD cases</li>
              <li><strong>True Positives ({data.RandomForest.confusion_matrix[1][1]})</strong> - Correctly identified CKD cases</li>
              <li><strong>False Positives ({data.RandomForest.confusion_matrix[0][1]})</strong> - Healthy patients misclassified as having CKD</li>
              <li><strong>False Negatives ({data.RandomForest.confusion_matrix[1][0]})</strong> - CKD patients misclassified as healthy</li>
            </ul>
          </div>

          <div style={{ flex: 1, minWidth: '300px', backgroundColor: '#f0f8ff', padding: '20px', borderRadius: '10px' }}>
            <h4>SVM Confusion Matrix</h4>
            <p>
              The SVM confusion matrix reveals:
            </p>
            <ul>
              <li><strong>True Negatives ({data.SVM.confusion_matrix[0][0]})</strong> - Correctly identified non-CKD cases</li>
              <li><strong>True Positives ({data.SVM.confusion_matrix[1][1]})</strong> - Correctly identified CKD cases</li>
              <li><strong>False Positives ({data.SVM.confusion_matrix[0][1]})</strong> - Healthy patients misclassified as having CKD</li>
              <li><strong>False Negatives ({data.SVM.confusion_matrix[1][0]})</strong> - CKD patients misclassified as healthy</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="clinical-implications">
        <h3>🏥 Clinical Implications</h3>
        <p>
          Based on these results:
        </p>
        <ul>
          <li>The Random Forest model shows {data.RandomForest.accuracy === 1 ? 'perfect' : 'excellent'} accuracy ({(data.RandomForest.accuracy * 100).toFixed(1)}%), making it highly reliable for clinical applications</li>
          <li>The SVM model achieves {(data.SVM.recall * 100).toFixed(1)}% recall, ensuring most CKD cases are identified</li>
          <li>Both models demonstrate strong potential for supporting clinical decision-making in CKD diagnosis</li>
          <li>The Random Forest model {data.RandomForest.accuracy > data.SVM.accuracy ? 'outperforms' : 'performs similarly to'} the SVM model in overall accuracy</li>
        </ul>
      </section>

      <section className="model-comparison">
        <h3>📈 Why Random Forest Performs Better</h3>
        <div className="explanation-card">
          <h4>1. Complex Feature Relationships</h4>
          <ul>
            <li>The dataset contains multiple interdependent medical parameters</li>
            <li>Random Forest can capture non-linear relationships through multiple decision trees</li>
            <li>Parameters like blood pressure, glucose, and creatinine have complex interactions</li>
          </ul>

          <h4>2. Handling Missing Values</h4>
          <ul>
            <li>Medical datasets often contain missing values</li>
            <li>Random Forest inherently handles missing values through its ensemble nature</li>
            <li>Each tree can work with different subsets of available features</li>
          </ul>
        
          <h4>3. Feature Importance</h4>
          <ul>
            <li>Medical data typically has varying levels of feature importance</li>
            <li>Random Forest automatically determines feature importance</li>
            <li>Less relevant or noisy features get lower weights in the final prediction</li>
          </ul>

          <h4>4. Preventing Overfitting</h4>
          <ul>
            <li>Random Forest uses bagging (bootstrap aggregating)</li>
            <li>Each tree is trained on a different subset of the data</li>
            <li>The final prediction is an averaged vote from all trees, reducing overfitting</li>
          </ul>

          <h4>5. Performance Metrics Comparison</h4>
          <div className="metrics-comparison">
            <p><strong>Random Forest vs SVM:</strong></p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ backgroundColor: '#e9ecef', padding: '10px', borderRadius: '5px' }}>
                Accuracy: <strong>{(data.RandomForest.accuracy * 100).toFixed(1)}% vs {(data.SVM.accuracy * 100).toFixed(1)}%</strong>
              </div>
              <div style={{ backgroundColor: '#e9ecef', padding: '10px', borderRadius: '5px' }}>
                Precision: <strong>{(data.RandomForest.precision * 100).toFixed(1)}% vs {(data.SVM.precision * 100).toFixed(1)}%</strong>
              </div>
              <div style={{ backgroundColor: '#e9ecef', padding: '10px', borderRadius: '5px' }}>
                Recall: <strong>{(data.RandomForest.recall * 100).toFixed(1)}% vs {(data.SVM.recall * 100).toFixed(1)}%</strong>
              </div>
              <div style={{ backgroundColor: '#e9ecef', padding: '10px', borderRadius: '5px' }}>
                F1-Score: <strong>{(data.RandomForest.f1_score * 100).toFixed(1)}% vs {(data.SVM.f1_score * 100).toFixed(1)}%</strong>
              </div>
            </div>
          </div>

          <h4>6. Confusion Matrix Analysis</h4>
          <div className="matrix-comparison">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <p><strong>Random Forest:</strong></p>
                <ul>
                  <li>{data.RandomForest.confusion_matrix[0][0] + data.RandomForest.confusion_matrix[1][1]} correct classifications</li>
                  <li>{data.RandomForest.confusion_matrix[0][0]} true negatives, {data.RandomForest.confusion_matrix[1][1]} true positives</li>
                  <li>{data.RandomForest.confusion_matrix[0][1]} false positives, {data.RandomForest.confusion_matrix[1][0]} false negatives</li>
                </ul>
              </div>
              
              <div style={{ flex: 1, minWidth: '250px' }}>
                <p><strong>SVM:</strong></p>
                <ul>
                  <li>{data.SVM.confusion_matrix[0][0] + data.SVM.confusion_matrix[1][1]} correct classifications</li>
                  <li>{data.SVM.confusion_matrix[0][0]} true negatives, {data.SVM.confusion_matrix[1][1]} true positives</li>
                  <li>{data.SVM.confusion_matrix[0][1]} false positives, {data.SVM.confusion_matrix[1][0]} false negatives</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnalysisExplanation;