import authRouter from '../modules/auth/auth.routes.js';
import userRouter from '../modules/user/user.routes.js';
import { refreshTokenController } from '../controllers/jwt/refreshToken.controller.js';
import { authAccessToken, authRefreshToken } from '../middleware/auth.middleware.js';
import express from 'express';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', authAccessToken, userRouter);
router.get('/refresh', authRefreshToken, refreshTokenController);

const commonRoute = router;
export default commonRoute;