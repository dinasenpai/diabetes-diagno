import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleHomeRedirect = () => {
    navigate("/home");
  };

  const handleLoginRedirect = () => {
    setShowPopup(false);
    navigate("/login");
  };

  return (
    <div className="navbar">
      <button className="navbar-button" onClick={handleHomeRedirect}>
        Home
      </button>
      <button className="navbar-button" onClick={() => setShowPopup(true)}>
        Profile
      </button>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Sign In</h2>
            <button className="popup-button" onClick={handleLoginRedirect}>
              Go to Login
            </button>
            <button
              className="popup-button"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;