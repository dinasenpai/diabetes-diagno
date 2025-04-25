import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/landing";
import Home from "./components/home";
import Login from "./components/login";
import Navbar from "./components/navbar";
import Patient from "./components/patient";
import History from "./components/history";
import Output from "./components/output";
import "./App.css";

function App() {
  return (
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
              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;