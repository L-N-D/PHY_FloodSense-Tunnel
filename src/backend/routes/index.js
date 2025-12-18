import authRouter from '../modules/auth/auth.routes.js';
import userRouter from '../modules/user/user.routes.js';
import sensorRouter from '../modules/sensors/sensor.route.js';
import arlamRouter from '../modules/alarm/alarm.route.js';
import systemRouter from '../modules/system/system.route.js';
import { refreshTokenController } from '../controllers/jwt/refreshToken.controller.js';
import { authAccessToken, authRefreshToken } from '../middleware/auth.middleware.js';
import express from 'express';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', authAccessToken, userRouter);
router.get('/refresh', authRefreshToken, refreshTokenController);
router.use('/logs', authAccessToken, sensorRouter);
router.use('/warning', authAccessToken, arlamRouter);
router.use('/system', authAccessToken, systemRouter);

const commonRoute = router;
export default commonRoute;