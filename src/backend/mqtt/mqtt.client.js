// mqtt/mqtt.client.js
import mqtt from 'mqtt';
import dotenv from 'dotenv';
import { handleAlert } from '../services/notification.service.js';

dotenv.config();

const MQTT_HOST = process.env.MQTT_HOST;
const MQTT_PORT = process.env.MQTT_PORT || 1883;
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;

const clientId = `backend_${Math.random().toString(16).slice(2)}`;

const connectUrl = `mqtt://${MQTT_HOST}:${MQTT_PORT}`;

const client = mqtt.connect(connectUrl, {
  clientId,
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  clean: true,
  reconnectPeriod: 2000,
});

const ALARM_TOPIC = 'esp32/data/alarm';

client.on('connect', () => {
  console.log('MQTT connected to broker');

  client.subscribe(ALARM_TOPIC, (err) => {
    if (err) {
      console.error('Error subscribing to alarm topic:', err);
    } else {
      console.log(`Subscribed to ${ALARM_TOPIC}`);
    }
  });
});

client.on('message', async (topic, message) => {
  try {
    const payload = message.toString();

    if (topic === ALARM_TOPIC) {
      if (payload === 'fire' || payload === 'flood') {
        const alert = {
          type: payload, // 'fire' | 'flood'
          severity: 'HIGH',
          timestamp: Date.now(),
          message:
            payload === 'fire'
              ? 'ESP32 phát hiện nguy cơ CHÁY trong hầm xe.'
              : 'ESP32 phát hiện nguy cơ NGẬP nước trong hầm xe.',
        };

        console.log('Received alarm from ESP32:', alert);

        await handleAlert(alert);
      } else {
        // 'safe' hoặc trạng thái khác -> chỉ log
        console.log('Alarm status:', payload);
      }
    }
  } catch (err) {
    console.error('Error handling MQTT message:', err);
  }
});

client.on('error', (err) => {
  console.error('MQTT error:', err);
});

export default client;
