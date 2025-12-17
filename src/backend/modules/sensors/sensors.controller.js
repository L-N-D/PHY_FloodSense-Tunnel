import { getLogs } from "./sensor.service.js";

export const getLogSensorController = async (req, res) => {

    try {
        const { sensorName } = req.params;
        // console.log(sensorName);

        if (!sensorName) {
            return res.status(400).json({ message: 'Missing sensorname' });
        }

        const logs = await getLogs(sensorName);

        return res.status(200).json(logs);
    } catch (err) {
        console.error("getSensorLogs error:", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }


}