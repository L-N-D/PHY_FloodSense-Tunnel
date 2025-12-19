import mqtt from 'mqtt';
import { handleAlert } from '../services/notification.service.js';
import SensorLog from '../modules/sensors/sensors.model.js';
import AlarmLog from '../modules/alarm/alarm.model.js';
import { sendSensorUpdate } from '../modules/sensors/sensor.service.js';
import { sendDeviceUpdate } from '../modules/devices/devices.service.js';

const MQTT_HOST = process.env.MQTT_HOST;
const MQTT_PORT = process.env.MQTT_PORT;
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;

const ALARM_TOPIC = 'esp32/data/alarm';

const SENSOR_TOPICS = [
  'esp32/data/temperature',
  'esp32/data/humidity',
  'esp32/data/water',
  'esp32/data/smoke',
  'esp32/data/rain',
  'esp32/data/rain_raw',
  'esp32/data/alarm_state',
  'esp32/data/gate',
  'esp32/data/pump',
  'esp32/data/fan',
];

const DEVICE = [
  'gate',
  'pump',
  'fan',
];

const SENSORS = ['temperature', 'humidity', 'water', 'smoke', 'rain'];

const ACK_TOPICS = [
  'esp32/ack/gate',
  'esp32/ack/pump',
  'esp32/ack/fan',
  'esp32/ack/buzzer',
];

let client = null;

export const initMqtt = () => {
  if (client) return client;

  client = mqtt.connect(`mqtt://${MQTT_HOST}:${MQTT_PORT}`, {
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    reconnectPeriod: 2000,
  });

  client.on('connect', () => {
    console.log('Connected to MQTT broker');

    client.subscribe([ALARM_TOPIC, ...SENSOR_TOPICS, ...ACK_TOPICS], (err) => {
      if (err) console.error('MQTT subscribe error:', err);
      else console.log('Subscribed ALARM + SENSOR + ACK topics OK');
    });
  });

  client.on('message', handleMessage);

  return client;

}


const handleMessage = async (topic, message) => {

  const payloadStr = message.toString();

  try {
    // 1) ACK: log + (tuỳ) lưu DB
    if (ACK_TOPICS.includes(topic)) {
      console.log(`[ACK] ${topic}: ${payloadStr}`);
      SensorLog.create({ topic, value: payloadStr, category: 'ack' }).catch(console.error);
      return;
    }

    // 2) SENSOR DATA: lưu log
    if (SENSOR_TOPICS.includes(topic)) {
      const sensorName = topic.split('/').pop();
      console.log('Receive: ', sensorName, ' ', payloadStr);
      const payload = {
        topic: topic,
        sensorName: sensorName,
        value: payloadStr
      };
      if (DEVICE.includes(sensorName)) {
        sendDeviceUpdate(payload);
      }
      if (SENSORS.includes(sensorName)) {
        sendSensorUpdate(payload);
      }
      // await SensorLog.create({ topic, value: payloadStr, category: 'sensor' }).catch(console.error);
      return;
    }

    // 3) ALARM EVENT: parse JSON first, fallback string
    if (topic === ALARM_TOPIC) {
      let alert = null;

      // JSON event
      try {
        const obj = JSON.parse(payloadStr);
        const ts = Number(obj.timestamp);
        if (obj && (obj.type === 'fire' || obj.type === 'flood')) {
          alert = {
            type: obj.type,
            severity: obj.severity || 'HIGH',
            timestamp: ts && ts > 1e12 ? ts : Date.now(),
            message: obj.message || '',
          };
        }
      } catch (_) { }

      // legacy string fallback
      if (!alert && (payloadStr === 'fire' || payloadStr === 'flood')) {
        alert = {
          type: payloadStr,
          severity: 'HIGH',
          timestamp: Date.now(),
          message: payloadStr === 'fire'
            ? 'ESP32 phát hiện nguy cơ CHÁY trong hầm xe.'
            : 'ESP32 phát hiện nguy cơ NGẬP nước trong hầm xe.',
        };
      }

      if (!alert) {
        console.log(`[ALARM] ignore payload: ${payloadStr}`);
        return;
      }

      console.log('Received ALARM EVENT:', alert);

      // lưu alarm history
      await AlarmLog.create(alert);

      // gửi theo ALERT_MODE
      handleAlert(alert).catch(console.error);

    }
  } catch (err) {
    console.error('Error handling MQTT message:', err);
  }

}
