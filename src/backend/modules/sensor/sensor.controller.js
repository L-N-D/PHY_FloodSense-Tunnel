import Sensor from './sensor.model.js';

// Get current readings for all sensor types
export const getCurrentReadings = async (req, res) => {
    try {
        const sensorTypes = ['temperature', 'water_level', 'smoke', 'water_leak', 'motion'];
        const currentReadings = {};

        for (const type of sensorTypes) {
            const latest = await Sensor.findOne({ type }).sort({ timestamp: -1 });
            currentReadings[type] = latest || null;
        }

        res.json(currentReadings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get historical data for a specific sensor type
export const getSensorHistory = async (req, res) => {
    try {
        const { type } = req.params;
        const { startDate, endDate, limit = 100 } = req.query;

        let query = { type };

        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        const history = await Sensor.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit));

        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get latest reading for a specific sensor type
export const getLatestReading = async (req, res) => {
    try {
        const { type } = req.params;
        const latest = await Sensor.findOne({ type }).sort({ timestamp: -1 });

        if (!latest) {
            return res.status(404).json({ message: 'No data found for this sensor type' });
        }

        res.json(latest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add new sensor reading
export const addSensorReading = async (req, res) => {
    try {
        const sensorData = new Sensor(req.body);
        await sensorData.save();
        res.status(201).json(sensorData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get sensor statistics
export const getSensorStats = async (req, res) => {
    try {
        const { type } = req.params;
        const { hours = 24 } = req.query;

        const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);

        const stats = await Sensor.aggregate([
            {
                $match: {
                    type,
                    timestamp: { $gte: startTime }
                }
            },
            {
                $group: {
                    _id: null,
                    avg: { $avg: '$value' },
                    min: { $min: '$value' },
                    max: { $max: '$value' },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json(stats[0] || { avg: 0, min: 0, max: 0, count: 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
