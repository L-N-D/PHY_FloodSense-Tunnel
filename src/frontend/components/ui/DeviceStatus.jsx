"use client";
import { useState, useEffect } from "react";
import { useDevices } from "@/hook/useDevices";

const DeviceStatus = ({ label = "Device", isOn = false, iconName = "fa-question" }) => {
    const [isMounted, setIsMounted] = useState(false);
    const {toggleDevice} = useDevices();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="flex flex-col items-center justify-center h-full w-full text-white"></div>;
    }

    const statusColor = isOn ? "text-green-500" : "text-red-500";

    const handleClick = () => {

        toggleDevice({deviceName: label.toLowerCase(), status: !isOn});

    }

    return (
        <div className="flex flex-col items-center justify-center h-full w-full text-white relative cursor-pointer" onClick={handleClick}>
            <div className="text-xl font-bold mb-4">{label}</div>

            {/* Icon Placeholder - Replace with FontAwesome Icon */}
            {/* Example: <i className={`fa-solid ${iconName} text-5xl ${statusColor}`}></i> */}
            <div className={`text-5xl ${statusColor} mb-4`}>
                {/* @[ICON_PLACEHOLDER] - User to insert FontAwesome icon here: {iconName} */}
                <i className={`fa-solid ${iconName}`}></i>
            </div>

            {/* Status Bar */}
            <div className={`w-3/4 h-2 rounded-full ${isOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
        </div>
    );
};

export default DeviceStatus;
