const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/extractauth');

// JWT token generation
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET, // FIXED: add secret as second argument
    { expiresIn: '24h' }
  );
};

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
};

// Enhanced Gmail configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  debug: true // Enable debug logs
});

// Verify email configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate password
    if (password.length < 8 || password.includes(' ')) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters long and contain no spaces' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create new user
    const user = new User({
      name,
      email,
      password,
      verificationToken
    });

    // Save user first
    const savedUser = await user.save();

    // Prepare verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;
    const mailOptions = {
      from: {
        name: 'Diabetes Diagnosis System',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Email Verification',
      html: `
        <h1>Verify Your Email</h1>
        <p>Hi ${name},</p>
        <p>Thank you for registering. Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>If the button doesn't work, copy and paste this link in your browser:</p>
        <p>${verificationUrl}</p>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(201).json({ 
        message: 'User registered successfully. Please check your email for verification.',
        userId: savedUser._id
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // If email fails, we should still let the user know they're registered
      res.status(201).json({ 
        message: 'User registered successfully, but there was an error sending the verification email. Please contact support.',
        userId: savedUser._id
      });
    }

  } catch (err) {
    console.error('Signup error:', err);
    // Check if user was already saved before the error
    if (err.code === 11000) { // MongoDB duplicate key error
      return res.status(400).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: 'Error creating user. Please try again.' });
  }
});

// Email verification route
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ error: 'Error verifying email' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({ error: 'Please verify your email first' });
    }

    // Check password
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    if (user.password !== hashedPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Set cookie with JWT
    res.cookie('token', token, cookieOptions);

    res.status(200).json({ 
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Add this endpoint for persistent login
router.get('/me', authMiddleware, (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.cookie('token', '', { ...cookieOptions, maxAge: 0 });
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;