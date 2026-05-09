import { predict } from '../AI/predict.js';
import fs from 'fs';
import path from 'path';

const DATASET_PATH = path.resolve('AI/dataset/Precautions.json');

export const getPrediction = async (req, res) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please describe your symptoms.' 
            });
        }

        // Handle both string and array inputs
        const symptomText = Array.isArray(symptoms) ? symptoms.join(' ') : symptoms;
        const normalizedText = symptomText.toLowerCase().trim();

        // Greeting detection
        const greetings = ['hi', 'hello', 'hey', 'greetings', 'hola', 'hi there', 'hello there'];
        if (greetings.includes(normalizedText) || normalizedText.split(' ').some(word => greetings.includes(word))) {
            return res.status(200).json({
                success: true,
                message: "Hello! I'm your MediQueue AI assistant. How can I help you today? Please describe any symptoms you're feeling.",
                predictions: []
            });
        }

        const predictions = predict(symptomText);
        
        if (predictions.length === 0 || (predictions[0] && predictions[0].confidence < 0.1)) {
            return res.status(200).json({
                success: true,
                message: "I couldn't identify any specific medical symptoms in your message. Could you try describing how you feel (e.g., 'I have a fever' or 'My chest hurts')?",
                predictions: []
            });
        }

        const topPrediction = predictions[0];
        
        // Find metadata
        let dataset = [];
        try {
            dataset = JSON.parse(fs.readFileSync(DATASET_PATH, 'utf8'));
        } catch (e) {
            console.error('Could not load dataset:', e.message);
        }

        const match = dataset.find(item => item.outcome.disease === topPrediction.disease);
        
        let responseMessage = `Based on your symptoms, it's likely you have ${topPrediction.disease} (Confidence: ${(topPrediction.confidence * 100).toFixed(1)}%).`;
        
        if (match) {
            const meds = match.outcome.medicines && match.outcome.medicines.length > 0 
                ? ` You might consider taking ${match.outcome.medicines.join(', ')}.` 
                : '';
            
            const precs = match.outcome.precautions && match.outcome.precautions.length > 0 
                ? ` Please follow these precautions: ${match.outcome.precautions.join(', ')}.` 
                : '';
            
            responseMessage += meds + precs;
            
            // Add metadata to the object for UI components if needed
            topPrediction.medicines = match.outcome.medicines;
            topPrediction.precautions = match.outcome.precautions;
        }

        res.status(200).json({
            success: true,
            message: responseMessage,
            predictions
        });
    } catch (error) {
        console.error('AI Prediction Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error processing AI prediction',
            error: error.message
        });
    }
};
