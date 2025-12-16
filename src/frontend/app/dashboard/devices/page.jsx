'use client';
import { useState } from "react";
import DeviceCard from "@/components/ui/DeviceCard";

const widgetPanel = "w-[700px] h-[150px] border border-white rounded rounded-lg flex justify-center items-center flex-col bg-white/5 backdrop-blur-md border border-white/40 rounded-xl shadow-[inset_0_1px_0px_rgba(255,255,255,0.7),0_0_10px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.15)] before:content-[''] before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/70 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none hover:bg-white/30 transition-all duration-300 after:content-[''] after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-tl after:from-white/40 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none";
export default function devicePage() {

    const [devices, setDevices] = useState({
        temp: "active",
        smoke: "active",
        waterLevel: "active",
        water: "active",
        fan: "off",
        door: "open"
    });

    return (
        <div className="mt-[60px] flex flex-col flex-1 h-screen bg-[#060C11] justify-center items-center text-white px-4">

            <div className={widgetPanel}>
                <h2 className="text-2xl font-semibold mb-4">System</h2>

                <div className="flex justify-center items-center">
                    <div className="flex justify-between flex-col text-gray-300 mb-4 px-4">
                        <div>Device active: 5</div>
                        <div>System status: <span className="text-green-400">Active</span></div>
                    </div>

                    <div className="flex justify-between px-10 gap-8">
                        <button className="bg-green-600 px-6 py-2 rounded-xl">Enable</button>
                        <button className="bg-red-500 px-6 py-2 rounded-xl">Disable</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-20 mt-[20px]">

                <DeviceCard
                    title="Temperature sensor"
                    status={devices.temp}
                    onOnClick={() => updateDevice("temp", "active")}
                    onOffClick={() => updateDevice("temp", "off")}
                />

                <DeviceCard
                    title="Smoke detector"
                    status={devices.smoke}
                    onOnClick={() => updateDevice("smoke", "active")}
                    onOffClick={() => updateDevice("smoke", "off")}
                />

                <DeviceCard
                    title="Water level sensor"
                    status={devices.waterLevel}
                    onOnClick={() => updateDevice("waterLevel", "active")}
                    onOffClick={() => updateDevice("waterLevel", "off")}
                />

                <DeviceCard
                    title="Water Sensor"
                    status={devices.water}
                    onOnClick={() => updateDevice("water", "active")}
                    onOffClick={() => updateDevice("water", "off")}
                />

                <DeviceCard
                    title="Fan"
                    status={devices.fan}
                    onOnClick={() => updateDevice("fan", "on")}
                    onOffClick={() => updateDevice("fan", "off")}
                />

                <DeviceCard
                    title="Door"
                    status={devices.door}
                    onOnClick={() => updateDevice("door", "open")}
                    onOffClick={() => updateDevice("door", "off")}
                />


            </div>


        </div>
    );
}