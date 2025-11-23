import authRouter from '../modules/auth/auth.routes';
import express from 'express';

const router = express.Router();

router.post('/auth', authRouter);

module.exports = router;