import express from 'express';
import {
    getAllDevices,
    getDevice,
    controlDevice,
    initializeDevices
} from './device.controller.js';

const router = express.Router();

// Initialize devices (run once to create default devices)
router.post('/initialize', initializeDevices);

// Get all devices
router.get('/', getAllDevices);

// Get specific device
router.get('/:name', getDevice);

// Control device
router.post('/:name/control', controlDevice);

export default router;
