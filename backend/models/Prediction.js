const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other'] // Gender options
  },
  hypertension: {
    type: Boolean, // True or false
    required: true
  },
  heartDisease: {
    type: Boolean, // True or false
    required: true
  },
  smokingHistory: {
    type: Boolean, // True or false
    required: true
  },
  bmi: {
    type: Number,
    required: true
  },
  hba1cLevel: {
    type: Number, // HbA1c levels range from 4% to 15%
    required: true
  },
  bloodGlucose: {
    type: Number, // Blood glucose level in mg/dL
    required: true
  },
  predictionResult: {
    type: String, // Yes or No (whether diabetic or not)
    required: true
  },
  managementSuggestions: {
    type: String, // Suggestions to improve health (diet, exercise, etc.)
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prediction', predictionSchema);
