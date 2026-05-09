import express from 'express';
import { getPrediction } from '../controllers/aiController.js';

const router = express.Router();

router.post('/predict', getPrediction);

export default router;
