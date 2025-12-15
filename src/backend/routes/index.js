import authRouter from '../modules/auth/auth.routes.js';
import { refreshTokenController } from '../controllers/jwt/refreshToken.controller.js';
import { authAccessToken, authRefreshToken } from '../middleware/auth.middleware.js';
import express from 'express';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/refresh', authRefreshToken, refreshTokenController);

const commonRoute = router;
export default commonRoute;