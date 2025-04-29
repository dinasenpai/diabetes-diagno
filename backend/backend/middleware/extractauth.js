const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // Allow request to proceed without authentication
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Add user info to request
    } catch (err) {
      // Token invalid but still allow request to proceed
      console.log('Invalid token:', err.message);
    }
    
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    next();
  }
};

module.exports = auth;