import { Router } from 'express';
import authRoute from '../modules/auth/auth.routes.js';
import sensorRoutes from '../modules/sensor/sensor.routes.js';
import deviceRoutes from '../modules/device/device.routes.js';
import analysisRoutes from '../modules/analysis/analysis.routes.js';

const router = Router();

router.use('/auth', authRoute);
router.use('/sensors', sensorRoutes);
router.use('/devices', deviceRoutes);
router.use('/analysis', analysisRoutes);

export default router;