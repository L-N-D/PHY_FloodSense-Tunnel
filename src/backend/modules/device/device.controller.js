import Device from './device.model.js';

// Get all devices
export const getAllDevices = async (req, res) => {
    try {
        const devices = await Device.find();
        res.json(devices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get specific device
export const getDevice = async (req, res) => {
    try {
        const { name } = req.params;
        const device = await Device.findOne({ name });

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        res.json(device);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Control device (turn on/off)
export const controlDevice = async (req, res) => {
    try {
        const { name } = req.params;
        const { status } = req.body;

        if (!['on', 'off'].includes(status)) {
            return res.status(400).json({ message: 'Status must be "on" or "off"' });
        }

        const device = await Device.findOneAndUpdate(
            { name },
            { status, lastAction: new Date() },
            { new: true, upsert: true }
        );

        res.json(device);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Initialize devices
export const initializeDevices = async (req, res) => {
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

        const devices = await Device.find();
        res.json({ message: 'Devices initialized', devices });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
