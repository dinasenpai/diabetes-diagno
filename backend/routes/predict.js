const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction');

// POST route to save prediction data
router.post('/', async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      hypertension,
      heartDisease,
      smokingHistory,
      bmi,
      hba1cLevel,
      bloodGlucose,
      predictionResult,
      managementSuggestions
    } = req.body;

    const newPrediction = new Prediction({
      name,
      age,
      gender,
      hypertension,
      heartDisease,
      smokingHistory,
      bmi,
      hba1cLevel,
      bloodGlucose,
      predictionResult,
      managementSuggestions
    });

    const saved = await newPrediction.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error saving prediction:', err);
    res.status(500).json({ error: 'Failed to save prediction' });
  }
});

module.exports = router;
