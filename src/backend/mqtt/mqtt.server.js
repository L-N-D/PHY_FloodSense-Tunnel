import client from "./mqtt.client.js";

const CMD_DEVICE_TOPICS = 'esp32/cmd';

const DEVICE = [
    'gate',
    'pump',
    'fan',
    'light',
];

export const sendCmdToEsp = ({ deviceName, state }) => {

    // console.log(state);

    if (!DEVICE.includes(deviceName)) {
        console.log('[mqtt.server.js] | Invalid device');
        return;
    }

    const topic = `${CMD_DEVICE_TOPICS}/${deviceName}`;

    // const payload = JSON.stringify({
    //     deviceName,
    //     state,
    // });

    const payload = state ? '1' : '0';


    client.publish(topic, payload, { qos: 1 }, (err) => {
        if (err) {
            console.error('MQTT publish error:', err);
        } else {
            console.log(`[CMD] ${topic} -> ${payload}`);
        }
    });

}