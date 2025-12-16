import express from 'express';
import { authVerifyToken } from './auth.middleware.js';
import { loginController, logoutController, registerController } from './auth.controller.js';

const router = express.Router();

router.post('/login', loginController);
router.post('/logout', authVerifyToken, logoutController);
router.post('/register', registerController);
// router.post('/save-device-token', authVerifyToken, saveDeviceTokenController);
// router.get('/profile', authAccessToken);

const authRouter = router;
export default authRouter;