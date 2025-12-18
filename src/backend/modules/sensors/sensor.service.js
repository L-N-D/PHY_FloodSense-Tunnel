import { getSocket } from "../../services/socket.service.js";
import sensorsModel from "./sensors.model.js";

const SAVE_INTERVAL = 60 * 1000; // 1 phút

export const saveDataIfNeeded = async (data) => {
  const { topic, value } = data;

  // sensor sẽ được suy ra từ topic (middleware)
  const parts = topic.split('/');
  const sensorName = parts.length >= 3 ? parts[2] : topic;

  // lấy bản ghi gần nhất của sensor
  const lastLog = await sensorsModel
    .findOne({ sensor: sensorName })
    .sort({ ts: -1 })
    .lean();

  const now = Date.now();

  // chưa từng lưu HOẶC đã quá 1 phút
  if (!lastLog || now - new Date(lastLog.ts).getTime() >= SAVE_INTERVAL) {
    await sensorsModel.create({ topic, value });
    console.log(`Saved ${sensorName}: ${value}`);
    return true;
  }

  return false;
};


export const sendSensorUpdate = (payload) => {
  const socket = getSocket();
  saveDataIfNeeded(payload);
  console.log('Send data: ',payload.sensorName, '| ', payload.value);
  socket.to('dashboard:sensor').emit('sensor:update', {sensorName: payload.sensorName, value: payload.value});
};


export const getLogs = async (sensorName) => {

  const logs = await sensorsModel.find({ sensor: sensorName })
  .sort({ ts: -1 })
  .limit(60)
  .select({ ts: 1, value: 1, _id: 0 })
  .lean();

  return logs;

}

