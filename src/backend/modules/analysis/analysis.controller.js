import Sensor from '../sensor/sensor.model.js';

// Calculate Flood Score (0-100)
export const calculateFloodScore = async (req, res) => {
    try {
        // Get latest water level and water leak data
        const waterLevel = await Sensor.findOne({ type: 'water_level' }).sort({ timestamp: -1 });
        const waterLeak = await Sensor.findOne({ type: 'water_leak' }).sort({ timestamp: -1 });

        let score = 0;

        // Water level contribution (0-60 points)
        if (waterLevel) {
            const level = waterLevel.value;
            if (level > 80) score += 60;
            else if (level > 60) score += 45;
            else if (level > 40) score += 30;
            else if (level > 20) score += 15;
        }

        // Water leak contribution (0-40 points)
        if (waterLeak && waterLeak.value > 0) {
            score += 40;
        }

        res.json({ floodScore: Math.min(score, 100), timestamp: new Date() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Calculate Fire Risk (0-100)
export const calculateFireRisk = async (req, res) => {
    try {
        // Get latest temperature and smoke data
        const temperature = await Sensor.findOne({ type: 'temperature' }).sort({ timestamp: -1 });
        const smoke = await Sensor.findOne({ type: 'smoke' }).sort({ timestamp: -1 });

        let risk = 0;

        // Temperature contribution (0-50 points)
        if (temperature) {
            const temp = temperature.value;
            if (temp > 60) risk += 50;
            else if (temp > 45) risk += 35;
            else if (temp > 35) risk += 20;
            else if (temp > 28) risk += 10;
        }

        // Smoke contribution (0-50 points)
        if (smoke) {
            const smokeLevel = smoke.value;
            if (smokeLevel > 300) risk += 50;
            else if (smokeLevel > 200) risk += 35;
            else if (smokeLevel > 100) risk += 20;
            else if (smokeLevel > 50) risk += 10;
        }

        res.json({ fireRisk: Math.min(risk, 100), timestamp: new Date() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get radar chart data (normalized values for Water, Temperature, Motion, Fire, Safe)
export const getRadarData = async (req, res) => {
    try {
        const waterLevel = await Sensor.findOne({ type: 'water_level' }).sort({ timestamp: -1 });
        const temperature = await Sensor.findOne({ type: 'temperature' }).sort({ timestamp: -1 });
        const motion = await Sensor.findOne({ type: 'motion' }).sort({ timestamp: -1 });
        const smoke = await Sensor.findOne({ type: 'smoke' }).sort({ timestamp: -1 });

        // Normalize values to 0-100 scale
        const data = {
            Water: waterLevel ? Math.min((waterLevel.value / 100) * 100, 100) : 0,
            Temperature: temperature ? Math.min((temperature.value / 100) * 100, 100) : 0,
            Motion: motion ? (motion.value > 0 ? 80 : 20) : 0,
            Fire: smoke ? Math.min((smoke.value / 500) * 100, 100) : 0,
            Safe: 0
        };

        // Safe is inverse of danger (100 - average of other metrics)
        const avgDanger = (data.Water + data.Temperature + data.Motion + data.Fire) / 4;
        data.Safe = Math.max(100 - avgDanger, 0);

        res.json({ data, timestamp: new Date() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get AI notification (simple rule-based suggestion)
export const getAINotification = async (req, res) => {
    try {
        const waterLevel = await Sensor.findOne({ type: 'water_level' }).sort({ timestamp: -1 });
        const temperature = await Sensor.findOne({ type: 'temperature' }).sort({ timestamp: -1 });
        const smoke = await Sensor.findOne({ type: 'smoke' }).sort({ timestamp: -1 });
        const waterLeak = await Sensor.findOne({ type: 'water_leak' }).sort({ timestamp: -1 });

        let message = '';
        let severity = 'low';

        // Check for critical conditions
        if (waterLevel && waterLevel.value > 80) {
            message = '🚨 CRITICAL: Water level is dangerously high! Activate pumps immediately and close flood doors.';
            severity = 'critical';
        } else if (smoke && smoke.value > 300) {
            message = '🔥 CRITICAL: High smoke levels detected! Evacuate immediately and activate ventilation.';
            severity = 'critical';
        } else if (temperature && temperature.value > 60) {
            message = '⚠️ WARNING: Temperature is very high. Check for fire hazards and ensure ventilation is active.';
            severity = 'high';
        } else if (waterLeak && waterLeak.value > 0) {
            message = '💧 ALERT: Water leak detected. Investigate the source and monitor water levels closely.';
            severity = 'medium';
        } else if (waterLevel && waterLevel.value > 40) {
            message = '⚡ CAUTION: Water level rising. Monitor conditions and prepare pump systems.';
            severity = 'medium';
        } else {
            message = '✅ All systems normal. Environmental conditions are within safe parameters.';
            severity = 'low';
        }

        res.json({ message, severity, timestamp: new Date() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
