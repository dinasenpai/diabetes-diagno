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
    enum: ['Male', 'Female']
  },
  hypertension: {
    type: Number, // Changed to Number for 0/1
    required: true
  },
  heart_disease: { // Changed from heartDisease
    type: Number, // Changed to Number for 0/1
    required: true
  },
  smoking_history: { // Changed from smokingHistory
    type: String,
    required: true,
    enum: ['never', 'no info', 'current', 'former', 'not current']
  },
  BMI: { // Changed from bmi
    type: Number,
    required: true
  },
  HbA1C_level: { // Changed from hba1cLevel
    type: Number,
    required: true
  },
  blood_glucose_level: { // Changed from bloodGlucose
    type: Number,
    required: true
  },
  email: {
    type: String, // Email of the user (can be null for unregistered users)
    ref: 'User',
    default: null,
    validate: {
      validator: async function(email) {
        if (!email) return true; // Allow null values
        const User = mongoose.model('User');
        const user = await User.findOne({ email });
        return user !== null;
      },
      message: 'User with this email does not exist'
    }
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
