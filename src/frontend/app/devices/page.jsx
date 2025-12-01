'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Devices() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDevices();
        const interval = setInterval(fetchDevices, 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchDevices = async () => {
        try {
            const data = await api.devices.getAll();
            setDevices(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching devices:', error);
            setLoading(false);
        }
    };

    const handleDeviceToggle = async (name, status) => {
        try {
            await api.devices.control(name, status);
            fetchDevices();
        } catch (error) {
            console.error('Error controlling device:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-cyan-500/20 border-t-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Page Header */}
            <div className="mb-10">
                <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">Devices</h1>
                <p className="text-lg text-gray-400">Remote control for fan, pump, door and lights.</p>
            </div>

            {/* Device Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
                {devices.map((device) => {
                    const isOn = device.status === 'on';
                    const colorClass = isOn ? 'text-green-400' : 'text-red-400';
                    const bgGradient = isOn ? 'from-green-500/20 to-transparent' : 'from-red-500/20 to-transparent';
                    const borderColor = isOn ? 'border-green-500/50' : 'border-red-500/50';
                    const shadowColor = isOn ? 'shadow-green-500/20' : 'shadow-red-500/20';

                    return (
                        <div
                            key={device.name}
                            className={`group relative rounded-3xl bg-gradient-to-br from-[#3F3F3F] to-[#2a2a2a] border border-gray-500/50 px-8 py-10 cursor-pointer hover:${borderColor} transition-all duration-300 shadow-xl hover:${shadowColor}`}
                            onClick={() => handleDeviceToggle(device.name, isOn ? 'off' : 'on')}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                            <div className="relative flex flex-col items-center space-y-6">
                                <p className="text-sm uppercase tracking-widest text-gray-300 font-bold">{device.name}</p>
                                <div className={`text-8xl transition-transform duration-300 group-hover:scale-110 ${isOn ? 'drop-shadow-[0_0_20px_rgba(74,222,128,0.5)]' : 'grayscale opacity-70'}`}>
                                    {device.name === 'fan' && '🌀'}
                                    {device.name === 'motor' && '⚙️'}
                                    {device.name === 'door' && '🚪'}
                                    {device.name === 'light' && '💡'}
                                    {device.name === 'buzzer' && '🔔'}
                                </div>
                                <div className={`px-5 py-1.5 rounded-full border ${isOn ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                                    <p className={`text-base font-bold tracking-wider ${colorClass}`}>{isOn ? 'ACTIVE' : 'OFFLINE'}</p>
                                </div>
                                <div className={`w-full h-1.5 rounded-full bg-gradient-to-r ${isOn ? 'from-green-600 to-green-400 shadow-green-500/50' : 'from-red-600 to-red-400 shadow-red-500/50'} shadow-lg`}></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Info Card */}
            <div className="rounded-3xl bg-gradient-to-br from-[#3F3F3F] to-[#2a2a2a] border border-gray-500/50 px-8 py-8 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4">Device Information</h3>
                <div className="space-y-3 text-gray-300">
                    <p>• <strong className="text-cyan-400">Fan:</strong> Ventilation system for smoke extraction</p>
                    <p>• <strong className="text-cyan-400">Motor:</strong> Water pump for drainage</p>
                    <p>• <strong className="text-cyan-400">Door:</strong> Flood prevention barrier</p>
                    <p>• <strong className="text-cyan-400">Light:</strong> Emergency LED lighting</p>
                    <p>• <strong className="text-cyan-400">Buzzer:</strong> Audio alarm system</p>
                </div>
            </div>
        </div>
    );
}
