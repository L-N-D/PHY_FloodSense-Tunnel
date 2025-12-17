import express from 'express';
import { countAlarmsTodayController, getNotificationController } from './arlam.controller.js';

const router = express.Router();

router.get('/countTotal', countAlarmsTodayController);
router.get('/notification', getNotificationController);

const arlamRouter = router;
export default arlamRouter;