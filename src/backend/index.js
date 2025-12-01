import app from './app.js'
import dotenv from 'dotenv';
import connectDB from './config/db.config.js';
import { seedSensorData, seedDevices } from './seed.js';
import { connectMQTT } from './services/mqtt.service.js';

dotenv.config();

await connectDB();
connectMQTT();

// Seed initial data (optional - won't throw if already exists)
try {
    await seedDevices();
    await seedSensorData();
    console.log('📊 Seed data completed');
} catch (error) {
    console.log('ℹ️  Seed data skipped (may already exist)');
}

const PORT = process.env.DB_PORT || 1307;

app.get('/', (req, res) => { res.send('FloodSense-Tunnel Backend is running'); });

app.listen(PORT, () => console.log(`🚀 Server is running on PORT ${PORT}`));