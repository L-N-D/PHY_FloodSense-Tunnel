import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true, index: true },

    // NEW: tên sensor suy ra từ topic
    device: { type: String, index: true },

    value: { type: String, required: true },

    deviceId: { type: String, default: 'esp32-basement', index: true },

    ts: { type: Date, default: Date.now, index: true },
  },
  { collection: 'devices', versionKey: false }
);

// Tự động suy ra sensor từ topic trước khi save
deviceSchema.pre('save', function (next) {
  if (!this.device && this.topic) {
    const parts = this.topic.split('/'); // vd: ["esp32","data","temperature"]
    if (parts.length >= 3) {
      if (parts[1] === 'data') this.device = parts[2];            // temperature, rain, smoke...
      else if (parts[1] === 'ack') this.device = `${parts[2]}_ack`; // gate_ack...
      else this.device= parts[parts.length - 1];
    } else {
      this.device = this.topic;
    }
  }
  next();
});

export default mongoose.model('Devices', deviceSchema);
