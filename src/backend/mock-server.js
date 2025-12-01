import express, { json } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(json());

const PORT = 1307;

// Mock data
let mockSensorData = {
    temperature: { type: 'temperature', value: 28.5, unit: '°C', timestamp: new Date() },
    water_level: { type: 'water_level', value: 45.2, unit: '%', timestamp: new Date() },
    smoke: { type: 'smoke', value: 85, unit: 'ppm', timestamp: new Date() },
    water_leak: { type: 'water_leak', value: 0, unit: 'detected', timestamp: new Date() },
    motion: { type: 'motion', value: 1, unit: 'detected', timestamp: new Date() }
};

let mockDevices = [
    { name: 'fan', status: 'off', description: 'Ventilation fan', lastAction: new Date() },
    { name: 'motor', status: 'off', description: 'Water pump motor', lastAction: new Date() },
    { name: 'door', status: 'off', description: 'Flood prevention door', lastAction: new Date() },
    { name: 'light', status: 'on', description: 'LED lights', lastAction: new Date() },
    { name: 'buzzer', status: 'off', description: 'Alarm buzzer', lastAction: new Date() }
];

// Generate mock history data
function generateHistory(type, count = 50) {
    const history = [];
    const now = Date.now();
    for (let i = 0; i < count; i++) {
        const timestamp = new Date(now - i * 60 * 60 * 1000); // Every hour
        let value;
        if (type === 'temperature') value = 20 + Math.random() * 15;
        else if (type === 'water_level') value = Math.random() * 100;
        else if (type === 'smoke') value = Math.random() * 150;
        else if (type === 'water_leak') value = Math.random() > 0.9 ? 1 : 0;
        else if (type === 'motion') value = Math.random() > 0.7 ? 1 : 0;

        history.push({
            type,
            value,
            unit: mockSensorData[type].unit,
            timestamp,
            deviceId: 'ESP32-001'
        });
    }
    return history;
}

// Sensor routes
app.get('/api/sensors/current', (req, res) => {
    // Slightly randomize values to simulate real-time changes
    mockSensorData.temperature.value = 25 + Math.random() * 10;
    mockSensorData.water_level.value = 30 + Math.random() * 40;
    mockSensorData.smoke.value = 50 + Math.random() * 100;
    mockSensorData.water_leak.value = Math.random() > 0.95 ? 1 : 0;
    mockSensorData.motion.value = Math.random() > 0.6 ? 1 : 0;

    Object.values(mockSensorData).forEach(sensor => sensor.timestamp = new Date());
    res.json(mockSensorData);
});

app.get('/api/sensors/:type/history', (req, res) => {
    const { type } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    res.json(generateHistory(type, limit));
});

app.get('/api/sensors/:type/latest', (req, res) => {
    const { type } = req.params;
    res.json(mockSensorData[type] || null);
});

app.get('/api/sensors/:type/stats', (req, res) => {
    const { type } = req.params;
    const history = generateHistory(type, 100);
    const values = history.map(h => h.value);

    res.json({
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length
    });
});

app.post('/api/sensors', (req, res) => {
    res.status(201).json({ message: 'Sensor data added' });
});

// Device routes
app.get('/api/devices', (req, res) => {
    res.json(mockDevices);
});

app.get('/api/devices/:name', (req, res) => {
    const device = mockDevices.find(d => d.name === req.params.name);
    res.json(device || { error: 'Device not found' });
});

app.post('/api/devices/:name/control', (req, res) => {
    const { name } = req.params;
    const { status } = req.body;
    const device = mockDevices.find(d => d.name === name);

    if (device) {
        device.status = status;
        device.lastAction = new Date();
        console.log(`✅ Device ${name} turned ${status}`);
        res.json(device);
    } else {
        res.status(404).json({ error: 'Device not found' });
    }
});

app.post('/api/devices/initialize', (req, res) => {
    res.json({ message: 'Devices initialized', devices: mockDevices });
});

// Analysis routes
app.get('/api/analysis/flood-score', (req, res) => {
    const waterLevel = mockSensorData.water_level.value;
    const waterLeak = mockSensorData.water_leak.value;

    let score = 0;
    if (waterLevel > 80) score += 60;
    else if (waterLevel > 60) score += 45;
    else if (waterLevel > 40) score += 30;
    else if (waterLevel > 20) score += 15;

    if (waterLeak > 0) score += 40;

    res.json({ floodScore: Math.min(score, 100), timestamp: new Date() });
});

app.get('/api/analysis/fire-risk', (req, res) => {
    const temp = mockSensorData.temperature.value;
    const smoke = mockSensorData.smoke.value;

    let risk = 0;
    if (temp > 60) risk += 50;
    else if (temp > 45) risk += 35;
    else if (temp > 35) risk += 20;
    else if (temp > 28) risk += 10;

    if (smoke > 300) risk += 50;
    else if (smoke > 200) risk += 35;
    else if (smoke > 100) risk += 20;
    else if (smoke > 50) risk += 10;

    res.json({ fireRisk: Math.min(risk, 100), timestamp: new Date() });
});

app.get('/api/analysis/radar-data', (req, res) => {
    const data = {
        Water: Math.min((mockSensorData.water_level.value / 100) * 100, 100),
        Temperature: Math.min((mockSensorData.temperature.value / 100) * 100, 100),
        Motion: mockSensorData.motion.value > 0 ? 80 : 20,
        Fire: Math.min((mockSensorData.smoke.value / 500) * 100, 100),
        Safe: 0
    };

    const avgDanger = (data.Water + data.Temperature + data.Motion + data.Fire) / 4;
    data.Safe = Math.max(100 - avgDanger, 0);

    res.json({ data, timestamp: new Date() });
});

app.get('/api/analysis/ai-notification', (req, res) => {
    const waterLevel = mockSensorData.water_level.value;
    const temp = mockSensorData.temperature.value;
    const smoke = mockSensorData.smoke.value;
    const waterLeak = mockSensorData.water_leak.value;

    let message = '';
    let severity = 'low';

    if (waterLevel > 80) {
        message = '🚨 CRITICAL: Water level is dangerously high! Activate pumps immediately and close flood doors.';
        severity = 'critical';
    } else if (smoke > 300) {
        message = '🔥 CRITICAL: High smoke levels detected! Evacuate immediately and activate ventilation.';
        severity = 'critical';
    } else if (temp > 60) {
        message = '⚠️ WARNING: Temperature is very high. Check for fire hazards and ensure ventilation is active.';
        severity = 'high';
    } else if (waterLeak > 0) {
        message = '💧 ALERT: Water leak detected. Investigate the source and monitor water levels closely.';
        severity = 'medium';
    } else if (waterLevel > 40) {
        message = '⚡ CAUTION: Water level rising. Monitor conditions and prepare pump systems.';
        severity = 'medium';
    } else {
        message = '✅ All systems normal. Environmental conditions are within safe parameters.';
        severity = 'low';
    }

    res.json({ message, severity, timestamp: new Date() });
});

// Root route
app.get('/', (req, res) => {
    res.send('🚀 FloodSense Mock API Server is running!');
});

app.listen(PORT, () => {
    console.log('\n========================================');
    console.log('🚀 FloodSense MOCK API Server Started!');
    console.log('========================================');
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`📊 Mock data mode (no database required)`);
    console.log(`✅ All endpoints available`);
    console.log('========================================\n');
});
