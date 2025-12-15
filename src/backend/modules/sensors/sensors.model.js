import mongoose from 'mongoose';

const sensorLogSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true, index: true },

    // NEW: tên sensor suy ra từ topic
    sensor: { type: String, index: true },

    value: { type: String, required: true },

    deviceId: { type: String, default: 'esp32-basement', index: true },

    ts: { type: Date, default: Date.now, index: true },
  },
  { collection: 'sensor_logs', versionKey: false }
);

// Tự động suy ra sensor từ topic trước khi save
sensorLogSchema.pre('save', function (next) {
  if (!this.sensor && this.topic) {
    const parts = this.topic.split('/'); // vd: ["esp32","data","temperature"]
    if (parts.length >= 3) {
      if (parts[1] === 'data') this.sensor = parts[2];            // temperature, rain, smoke...
      else if (parts[1] === 'ack') this.sensor = `${parts[2]}_ack`; // gate_ack...
      else this.sensor = parts[parts.length - 1];
    } else {
      this.sensor = this.topic;
    }
  }
  next();
});

export default mongoose.model('SensorLog', sensorLogSchema);
