import devicesModel from "./devices.model.js";
import { getSocket } from "../../services/socket.service.js";

const SAVE_INTERVAL = 60 * 1000; // 1 phút

export const saveDeviceDataIfNeeded = async (payload) => {
  const { topic, value } = payload;

  // suy ra device từ topic (giống middleware)
  const parts = topic.split('/');
  const deviceName = parts.length >= 3 ? parts[2] : topic;

  // lấy bản ghi mới nhất của device
  const lastLog = await devicesModel
    .findOne({ device: deviceName })
    .sort({ ts: -1 })
    .lean();

  const now = Date.now();

  if (!lastLog || now - new Date(lastLog.ts).getTime() >= SAVE_INTERVAL) {
    await devicesModel.create({ topic, value });

    console.log(`Saved device ${deviceName}: ${value}`);
    return true;
  }

  return false;
};

export const sendDeviceUpdate = (payload) => {

    const socket = getSocket();

    saveDeviceDataIfNeeded(payload);

    console.log ('Send device: ', payload.sensorName, '| ', payload.value);

    socket.to('dashboard:sensor').emit('device:update', {sensorName: payload.sensorName, value: payload.value});

}