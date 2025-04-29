import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/auth/verify/${token}`, {
          method: 'GET',
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('Email verified successfully! Redirecting to login...');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setStatus(data.error || 'Verification failed');
        }
      } catch (err) {
        setStatus('An error occurred during verification');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Email Verification</h2>
        <div className={status.includes('successfully') ? 'success-message' : 'error-message'}>
          {status}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;