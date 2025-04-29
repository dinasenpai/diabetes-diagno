const { PythonShell } = require('python-shell');
const path = require('path');

const predictDiabetes = async (data) => {
    return new Promise((resolve, reject) => {

        const validationErrors = {};
        
        // Required fields check with updated field names
        const requiredFields = ['age', 'gender', 'hypertension', 'heartDisease', 
                              'smoking_history', 'BMI', 'HbA1C_level', 'blood_glucose_level'];
        
        requiredFields.forEach(field => {
            if (!data[field]) {
                validationErrors[field] = `${field} is required`;
            }
        });

        // Type validation with updated field names
        if (data.age && isNaN(parseInt(data.age))) {
            validationErrors.age = 'Age must be a number';
        }
        if (data.BMI && isNaN(parseFloat(data.BMI))) {
            validationErrors.BMI = 'BMI must be a number';
        }
        if (data.HbA1C_level && isNaN(parseFloat(data.HbA1C_level))) {
            validationErrors.HbA1C_level = 'HbA1C level must be a number';
        }
        if (data.blood_glucose_level && isNaN(parseFloat(data.blood_glucose_level))) {
            validationErrors.blood_glucose_level = 'Blood glucose must be a number';
        }

        // If there are validation errors, reject the promise
        if (Object.keys(validationErrors).length > 0) {
            return reject(new Error(JSON.stringify(validationErrors)));
        }

        // Add debug logging
        console.log('Input data:', JSON.stringify(data, null, 2));

        const inputData = {
            age: parseInt(data.age),
            hypertension: data.hypertension === 'yes' ? 1 : 0,
            heart_disease: data.heartDisease === 'yes' ? 1 : 0,
            BMI: parseFloat(data.BMI),
            HbA1C_level: parseFloat(data.HbA1C_level),
            blood_glucose_level: parseFloat(data.blood_glucose_level),
            gender: String(data.gender),
            smoking_history: String(data.smoking_history).toLowerCase()
        };

        console.log('Input data:', JSON.stringify(inputData, null, 2));

        const options = {
            scriptPath: path.join(__dirname),
            mode: 'text', // Changed from 'json' to 'text' to handle raw output
            pythonOptions: ['-u']
        };

        const pyshell = new PythonShell('predict_diabetes.py', options);
        pyshell.send(JSON.stringify(inputData));

        let result = '';
        let error = '';

        pyshell.on('message', (message) => {
            // Only collect lines that look like JSON
            if (message.trim().startsWith('{')) {
                result = message;
            }
        });

        pyshell.on('stderr', (stderr) => {
            error += stderr + '\n';
        });

        pyshell.end((err) => {
            if (err) {
                console.error('Python shell error:', err);
                console.error('Python stderr:', error);
                reject(err);
                return;
            }
            try {
                if (!result) {
                    throw new Error('No valid JSON result received from Python script');
                }
                const prediction = JSON.parse(result);
                resolve(prediction);
            } catch (error) {
                console.error('JSON parse error:', error);
                reject(error);
            }
        });
    });
};

module.exports = { predictDiabetes };