const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction');
const { predictDiabetes } = require('../mlPredictor');

// POST route to save prediction data
router.post('/', async (req, res) => {
  try {
    // Get prediction from ML model first
    const result = await predictDiabetes(req.body);
    
    // Generate management suggestions based on prediction
    let suggestions = req.body.managementSuggestions || '';
    if (result.prediction === 'Yes') {
      suggestions += '\nRecommended actions: Regular blood sugar monitoring, balanced diet, and regular exercise.';
    }

    // Get user email from auth token if it exists
    const userEmail = req.user ? req.user.email : null;

    // Create new prediction with ML model result
    const newPrediction = new Prediction({
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      hypertension: req.body.hypertension === 'yes' ? 1 : 0,
      heart_disease: req.body.heartDisease === 'yes' ? 1 : 0,
      smoking_history: req.body.smoking_history,
      BMI: req.body.BMI,
      HbA1C_level: req.body.HbA1C_level,
      blood_glucose_level: req.body.blood_glucose_level,
      email: userEmail, // Set email from authenticated user if available
      managementSuggestions: suggestions,
      predictionResult: result.prediction
    });

    const saved = await newPrediction.save();

    // Send both the saved data and prediction result
    res.status(201).json({
      ...saved.toObject(),
      prediction: result.prediction,
      probability: result.probability
    });
  } catch (err) {
    console.error('Error saving prediction:', err);
    res.status(500).json({ error: err.message || 'Failed to save prediction' });
  }
});

// GET route to fetch predictions
router.get('/', async (req, res) => {
  try {
    // If user is authenticated, return their predictions
    if (req.user) {
      const predictions = await Prediction.find({ email: req.user.email });
      return res.json(predictions);
    }
    // If not authenticated, return predictions with null email (anonymous predictions)
    const predictions = await Prediction.find({ email: null });
    res.json(predictions);
  } catch (err) {
    console.error('Error fetching predictions:', err);
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
});

module.exports = router;
