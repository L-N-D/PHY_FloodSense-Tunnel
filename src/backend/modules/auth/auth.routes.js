import express from 'express';
import {authAccessToken} from '../../middleware/auth.middleware'

const router = express.Router();

router.post('/login');
router.get('/profile', authAccessToken)

model.exports = authRouter;