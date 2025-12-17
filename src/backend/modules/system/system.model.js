import mongoose from 'mongoose';

const systemActionSchema = new mongoose.Schema(
  {
    device: {
      type: String,
      enum: ['fan', 'pump', 'gate', 'buzzer'],
      required: true,
    },

    action: {
      type: String,
      enum: ['ON', 'OFF'],
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'system_actions',
  }
);

export default mongoose.model('SystemModel', systemActionSchema);
