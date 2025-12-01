import express from 'express';
import {
    calculateFloodScore,
    calculateFireRisk,
    getRadarData,
    getAINotification
} from './analysis.controller.js';

const router = express.Router();

// Get flood score
router.get('/flood-score', calculateFloodScore);

// Get fire risk
router.get('/fire-risk', calculateFireRisk);

// Get radar chart data
router.get('/radar-data', getRadarData);

// Get AI notification
router.get('/ai-notification', getAINotification);

export default router;
