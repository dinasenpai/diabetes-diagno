import React from "react";
import { useNavigate } from "react-router-dom";
import "./landing.css";

const Landing = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/home");
  };

  return (
    <div className="home-page-desktop" onClick={handleRedirect}>
      <svg
        className="vector"
        width="727"
        height="113"
        viewBox="0 0 727 113"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M151.152 113L145.419 112.849L136.279 17.601L118.521 91.7019L112.823 91.7057L105.043 59.5734L96.3523 73.4697H0V69.6894H92.4825L107.518 45.6582L115.661 79.2913L134.658 0L140.385 0.173893L149.433 94.4275L160.276 45.386L165.91 45.1667L175.72 69.0392H727V72.8194H171.297L163.978 54.9954L151.152 113Z"
          fill="white"
        />
      </svg>
      <div className="frame-1">
        <div className="group-10">
          <div className="my-health-record">My health record</div>
        </div>
        <svg
        className="vector1"
        width="727"
        height="113"
        viewBox="0 0 727 113"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M151.152 113L145.419 112.849L136.279 17.601L118.521 91.7019L112.823 91.7057L105.043 59.5734L96.3523 73.4697H0V69.6894H92.4825L107.518 45.6582L115.661 79.2913L134.658 0L140.385 0.173893L149.433 94.4275L160.276 45.386L165.91 45.1667L175.72 69.0392H727V72.8194H171.297L163.978 54.9954L151.152 113Z"
          fill="white"
        />
      </svg>
      </div>
    </div>
  );
};

export default Landing;