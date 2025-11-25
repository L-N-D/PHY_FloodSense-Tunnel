import authRouter from '../modules/auth/auth.routes.js';
import express from 'express';

const router = express.Router();

router.use('/auth', authRouter);

const commonRoute = router;
export default commonRoute;