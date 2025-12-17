import { sendCmdToEsp } from "../../mqtt/mqtt.server.js";
import SystemModel from "../system/system.model.js";

export const controlDeviceController = async (payload) => {
    try {
        // console.log(payload.state);
        sendCmdToEsp({deviceName: payload.deviceName, state: payload.state});

        const action = payload.state ? 'ON' : 'OFF';

        // console.log(payload.deviceName);
        await SystemModel.create({
            device: payload.deviceName,
            action: action,
        });

    } catch (err) {
        console.error('Control device error:', err);
        throw err;
    }
};
