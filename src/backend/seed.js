import Sensor from './modules/sensor/sensor.model.js';
import Device from './modules/device/device.model.js';

// Seed sample sensor data
export const seedSensorData = async () => {
    try {
        // Clear existing data (optional)
        // await Sensor.deleteMany({});

        const sampleData = [];
        const now = new Date();

        // Generate last 24 hours of data
        for (let i = 0; i < 24; i++) {
            const timestamp = new Date(now - i * 60 * 60 * 1000); // Every hour

            // Temperature data (20-35°C)
            sampleData.push({
                type: 'temperature',
                value: 20 + Math.random() * 15,
                unit: '°C',
                timestamp
            });

            // Water level data (0-100%)
            sampleData.push({
                type: 'water_level',
                value: Math.random() * 100,
                unit: '%',
                timestamp
            });

            // Smoke data (0-500 ppm)
            sampleData.push({
                type: 'smoke',
                value: Math.random() * 100,
                unit: 'ppm',
                timestamp
            });

            // Water leak data (0 or 1)
            sampleData.push({
                type: 'water_leak',
                value: Math.random() > 0.9 ? 1 : 0,
                unit: 'detected',
                timestamp
            });

            // Motion data (0 or 1)
            sampleData.push({
                type: 'motion',
                value: Math.random() > 0.7 ? 1 : 0,
                unit: 'detected',
                timestamp
            });
        }

        await Sensor.insertMany(sampleData);
        console.log('✅ Sensor data seeded successfully');
    } catch (error) {
        console.error('❌ Error seeding sensor data:', error.message);
    }
};

// Seed default devices
export const seedDevices = async () => {
    try {
        const defaultDevices = [
            { name: 'fan', status: 'off', description: 'Ventilation fan' },
            { name: 'motor', status: 'off', description: 'Water pump motor' },
            { name: 'door', status: 'off', description: 'Flood prevention door' },
            { name: 'light', status: 'off', description: 'LED lights' },
            { name: 'buzzer', status: 'off', description: 'Alarm buzzer' }
        ];

        for (const deviceData of defaultDevices) {
            await Device.findOneAndUpdate(
                { name: deviceData.name },
                deviceData,
                { upsert: true, new: true }
            );
        }

        console.log('✅ Devices initialized successfully');
    } catch (error) {
        console.error('❌ Error seeding devices:', error.message);
    }
};
