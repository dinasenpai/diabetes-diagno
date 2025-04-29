import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Landing from "./components/landing";
import Home from "./components/home";
import Login from "./components/login";
import Navbar from "./components/navbar";
import Patient from "./components/patient";
import History from "./components/history";
import Output from "./components/output";
import Dashboard from "./components/dashboard";
import EmailVerification from "./components/EmailVerification";

// import ModelComparison from './components/wrath/ModelComparison';
// import AdvancedChart3D from './components/wrath/AdvancedChart3D';
// import GaugeCharts from './components/wrath/GaugeCharts';
// import AnalysisExplanation from './components/wrath/AnalysisExplanation';
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/patient" element={<Patient />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/output" element={<Output />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  {/* <Route path="/dashboard/model-comparison" element={<ModelComparison />} />
                  <Route path="/dashboard/advanced-chart-3d" element={<AdvancedChart3D />} />
                  <Route path="/dashboard/gauge-charts" element={<GaugeCharts />} />
                  <Route path="/dashboard/analysis-explanation" element={<AnalysisExplanation />} /> */}
                  <Route path="/verify/:token" element={<EmailVerification />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;