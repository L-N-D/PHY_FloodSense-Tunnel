import express from 'express';
import { countAlarmsTodayController } from './arlam.controller.js';

const router = express.Router();

router.get('/countTotal', countAlarmsTodayController);

const arlamRouter = router;
export default arlamRouter;