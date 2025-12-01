import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ['fan', 'motor', 'door', 'light', 'buzzer']
    },
    status: {
        type: String,
        required: true,
        enum: ['on', 'off', 'error'],
        default: 'off'
    },
    lastAction: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Device = mongoose.model('Device', deviceSchema);

export default Device;
