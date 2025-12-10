import express from 'express';
import { getUserController } from './user.controller.js';

const router = express.Router();

router.get('/me', getUserController);

const userRouter = router;
export default userRouter;