import mongoose from 'mongoose';

const alarmLogSchema = new mongoose.Schema({
  type: { type: String, enum: ['fire', 'flood'], required: true },
  severity: { type: String, default: 'HIGH' },
  timestamp: { type: Number, required: true },
  message: { type: String, default: '' },
  deviceId: { type: String, default: 'esp32-basement' },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'alarm_logs' });

export default mongoose.model('AlarmLog', alarmLogSchema);
