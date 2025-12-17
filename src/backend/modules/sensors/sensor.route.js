import express from 'express';
import {getLogSensorController} from './sensors.controller.js';


const router = express.Router();

router.get('/:sensorName', getLogSensorController);

const sensorRouter = router;
export default sensorRouter;