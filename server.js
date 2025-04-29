const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const runPythonScript = require("./Runpython");

const auth = require('./middleware/extractauth');
const predictRoute = require('./routes/predict');
const authRoute = require('./routes/auth');

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());

// Apply auth middleware globally
app.use(auth);

// Compare models endpoint
app.get("/compare-models", async (req, res) => {
  try {
    const data = await runPythonScript("model.py");
    res.json(data);
  } catch (err) {
    console.error("Error in compare-models:", err);
    res.status(500).json({ 
      error: err.message || 'Unknown error',
      details: err.error || err,
      output: err.details || 'No additional details'
    });
  }
});

// Routes
app.use('/auth', authRoute);
app.use('/predict', predictRoute);

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log("MongoDB connected successfully");
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
});
