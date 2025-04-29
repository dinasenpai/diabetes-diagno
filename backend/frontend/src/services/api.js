import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Remove global 401 redirect interceptor
// Let each component handle errors locally

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  verifyEmail: (token) => api.get(`/auth/verify/${token}`),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'), // <-- Add this line
};

export const predictionAPI = {
  submitPrediction: (data) => api.post('/predict', data),
  getPredictionHistory: () => api.get('/predict')
};

export default api;