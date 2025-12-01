import mongoose from 'mongoose';

const sensorSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['temperature', 'water_level', 'smoke', 'water_leak', 'motion']
    },
    value: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    location: {
        type: String,
        default: 'tunnel'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    deviceId: {
        type: String,
        default: 'ESP32-001'
    }
}, {
    timestamps: true
});

// Index for faster queries
sensorSchema.index({ type: 1, timestamp: -1 });

const Sensor = mongoose.model('Sensor', sensorSchema);

export default Sensor;
