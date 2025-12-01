import express from 'express';
import {
    getCurrentReadings,
    getSensorHistory,
    getLatestReading,
    addSensorReading,
    getSensorStats
} from './sensor.controller.js';

const router = express.Router();

// Get current readings for all sensors
router.get('/current', getCurrentReadings);

// Get historical data for a sensor type
router.get('/:type/history', getSensorHistory);

// Get latest reading for a sensor type
router.get('/:type/latest', getLatestReading);

// Get statistics for a sensor type
router.get('/:type/stats', getSensorStats);

// Add new sensor reading
router.post('/', addSensorReading);

export default router;
