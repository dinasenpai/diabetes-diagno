import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHomeRedirect = () => {
    navigate("/home");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowDropdown(false);
  };

  // Get username from email (everything before @)
  const getUsername = () => {
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return '';
  };

  return (
    <div className="navbar">
      <button className="navbar-button" onClick={handleHomeRedirect}>
        Home
      </button>
      
      {user ? (
        <div className="user-profile" ref={dropdownRef}>
          <button 
            className="username-button" 
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {getUsername()}
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button 
          className="navbar-button" 
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Navbar;