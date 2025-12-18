import express from 'express';
import { getSystemLogsController } from './system.controller.js';

const router = express.Router();

router.get('/systemLogs', getSystemLogsController);

const systemRouter = router;
export default systemRouter;



