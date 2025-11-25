import express from 'express';
// import {authAccessToken} from '../../middleware/auth.middleware'
import { loginController, logoutController } from './auth.controller.js';
import { verifyToken } from './auth.middleware.js';

const router = express.Router();

router.post('/login', loginController);
router.post('/logout', verifyToken, logoutController);
// router.get('/profile', authAccessToken);

const authRouter = router;
export default authRouter;