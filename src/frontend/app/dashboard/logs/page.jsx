'use client';
import { useEffect, useState } from "react";
import { useAPI } from "@/hook/useApi";

const data = [
    { type: "Action", message: "Door closed", time: "15:00 | 20/11/2025" },
    { type: "Warn", message: "High water level", time: "14:35 | 20/11/2025" },
    { type: "Email", message: "Smoke detected", time: "14:10 | 20/11/2025" },
    { type: "System", message: "Door opened", time: "13:00 | 20/11/2025" },
    { type: "Action", message: "Fan activate", time: "12:50 | 20/11/2025" },
    { type: "Action", message: "Fan deactivate", time: "12:00 | 20/11/2025" },
];

export default function LogPage() {
    const typeStyles = {
        fan: "bg-green-700 text-green-200 fa-solid fa-fan",
        pump: "bg-blue-500 text-yellow-200 fa-solid fa-faucet",
        gate: "bg-orange-600 text-orange-200 fa-solid fa-door-open",
        System: "bg-purple-700 text-purple-300",
    };

    const {loading, getSystemLogs} = useAPI();
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getSystemLogs();
            setLogs(res);
        }
        fetchData();
    }, []);



    let historyData = data;

    return (
        <div className="mt-[60px] flex flex-col flex-1 h-screen bg-[#060C11] justify-center items-center text-white px-4">
            {logs.map((item, index) => (
                <div
                    key={index}
                    className="w-[1400px] border border-white/30 rounded-2xl m-2 px-6 py-3"
                >
                    <div className="flex justify-between items-center">

                        <div className="flex items-center gap-3">

                            <div className="w-[70px]">
                                <span
                                    className={`px-3 py-1 rounded-md text-sm font-semibold ${typeStyles[item.device]}`}
                                >
                                </span>
                            </div>

                            <span className="text-white text-sm font-medium">
                                {item.device.toUpperCase()} <i className="fa-solid fa-arrow-right text-red-800"></i> {item.action}
                            </span>
                        </div>

                        {/* RIGHT: time */}
                        <span className="text-gray-300 text-sm">
                            {item.createdAt
                                ? new Date(item.createdAt).toLocaleString('vi-VN', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })
                                : ''}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}