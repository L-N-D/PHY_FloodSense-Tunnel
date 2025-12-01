import mqtt from 'mqtt';
import Sensor from '../modules/sensor/sensor.model.js';

// MQTT Broker Configuration
const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtts://32eacacd4099498e927685501f317dfe.s1.eu.hivemq.cloud';
// Subscribe to all sub-topics under "sensors/"
const SENSOR_TOPIC = 'sensors/+';

let client;

export const connectMQTT = () => {
    console.log(`🔌 Connecting to MQTT Broker at ${MQTT_BROKER_URL}...`);

    const options = {
        port: 8883,
        username: 'mybroker',
        password: 'Mybroker1',
        protocol: 'mqtts'
    };

    client = mqtt.connect(MQTT_BROKER_URL, options);

    client.on('connect', () => {
        console.log('✅ MQTT Connected');

        // Subscribe to wildcard topic
        client.subscribe(SENSOR_TOPIC, (err) => {
            if (!err) {
                console.log(`📡 Subscribed to topic: ${SENSOR_TOPIC}`);
            } else {
                console.error('❌ MQTT Subscription error:', err);
            }
        });
    });

    client.on('message', async (topic, message) => {
        // Check if topic matches pattern "sensors/..."
        if (topic.startsWith('sensors/')) {
            try {
                const payload = message.toString();
                const data = JSON.parse(payload);

                // Extract sensor type from topic (e.g., "sensors/distance" -> "distance")
                const topicType = topic.split('/')[1];

                // Use type from payload OR fallback to topic type
                const sensorType = data.type || topicType;

                // Validate required fields
                if (data.value === undefined) {
                    console.warn(`⚠️ Invalid MQTT payload on ${topic}:`, data);
                    return;
                }

                // Save to MongoDB
                const sensorData = new Sensor({
                    type: sensorType,
                    value: data.value,
                    unit: data.unit || '', // Optional unit
                    deviceId: data.deviceId || 'ESP32-MQTT',
                    location: data.location || 'tunnel'
                });

                await sensorData.save();
                console.log(`💾 Saved ${sensorType} reading: ${data.value} ${data.unit || ''}`);

            } catch (error) {
                console.error('❌ Error processing MQTT message:', error.message);
            }
        }
    });

    client.on('error', (err) => {
        console.error('❌ MQTT Connection Error:', err);
    });
};

export const publishMessage = (topic, message) => {
    if (client && client.connected) {
        client.publish(topic, JSON.stringify(message));
    } else {
        console.warn('⚠️ MQTT client not connected, cannot publish');
    }
};
