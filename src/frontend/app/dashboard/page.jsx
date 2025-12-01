'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Dashboard() {
    const [sensorData, setSensorData] = useState({});
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [sensors, devicesData] = await Promise.all([
                api.sensors.getCurrent(),
                api.devices.getAll()
            ]);
            setSensorData(sensors);
            setDevices(devicesData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleDeviceToggle = async (name, status) => {
        try {
            await api.devices.control(name, status);
            fetchData();
        } catch (error) {
            console.error('Error controlling device:', error);
        }
    };

    const getWarningCount = () => {
        let count = 0;
        if (sensorData.temperature?.value > 35) count++;
        if (sensorData.water_level?.value > 60) count++;
        if (sensorData.smoke?.value > 100) count++;
        if (sensorData.water_leak?.value > 0) count++;
        return count;
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
                <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">Dashboard</h1>
                <p className="text-lg text-gray-400">Real-time monitoring and control</p>
            </div>

            {/* Sensors Section - 2x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Temperature Sensor Card */}
                <div className="group relative rounded-3xl bg-gradient-to-br from-[#3F3F3F] to-[#2a2a2a] border border-gray-500/50 px-8 py-10 hover:border-cyan-500/50 transition-all duration-300 shadow-xl hover:shadow-cyan-500/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex flex-col items-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-2">
                            <span className="text-4xl">🌡️</span>
                        </div>
                        <p className="text-sm uppercase tracking-widest text-gray-400 font-bold">Temperature Sensor</p>
                        <div className="flex items-baseline gap-1">
                            <p className="text-8xl font-black text-cyan-400 drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]">
                                {sensorData.temperature?.value?.toFixed(1) || '0'}
                            </p>
                            <span className="text-5xl font-bold text-cyan-400/70">°C</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-lg shadow-cyan-500/50"></div>
                    </div>
                </div>

                {/* Water Level Sensor Card */}
                <div className="group relative rounded-3xl bg-gradient-to-br from-[#3F3F3F] to-[#2a2a2a] border border-gray-500/50 px-8 py-10 hover:border-red-500/50 transition-all duration-300 shadow-xl hover:shadow-red-500/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex flex-col items-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                            <span className="text-4xl">💧</span>
                        </div>
                        <p className="text-sm uppercase tracking-widest text-gray-400 font-bold">Water Level Sensor</p>
                        <div className="flex items-baseline gap-1">
                            <p className="text-8xl font-black text-red-400 drop-shadow-[0_0_25px_rgba(248,113,113,0.6)]">
                                {sensorData.water_level?.value?.toFixed(1) || '0'}
                            </p>
                            <span className="text-5xl font-bold text-red-400/70">%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-red-600 to-red-400 shadow-lg shadow-red-500/50"></div>
                    </div>
                </div>

                {/* Smoke Detector Card */}
                <div className="group relative rounded-3xl bg-gradient-to-br from-[#3F3F3F] to-[#2a2a2a] border border-gray-500/50 px-8 py-10 hover:border-green-500/50 transition-all duration-300 shadow-xl hover:shadow-green-500/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex flex-col items-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                            <span className="text-4xl">💨</span>
                        </div>
                        <p className="text-sm uppercase tracking-widest text-gray-400 font-bold">Smoke Detector</p>
                        <div className="flex items-baseline gap-1">
                            <p className="text-8xl font-black text-green-400 drop-shadow-[0_0_25px_rgba(74,222,128,0.6)]">
                                {sensorData.smoke?.value?.toFixed(0) || '0'}
                            </p>
                            <span className="text-5xl font-bold text-green-400/70">ppm</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-green-600 to-green-400 shadow-lg shadow-green-500/50"></div>
                    </div>
                </div>

                {/* Warning Card */}
                <div className="group relative rounded-3xl bg-gradient-to-br from-[#3F3F3F] to-[#2a2a2a] border border-gray-500/50 px-8 py-10 hover:border-yellow-500/50 transition-all duration-300 shadow-xl hover:shadow-yellow-500/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex flex-col items-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-2">
                            <span className="text-4xl">⚠️</span>
                        </div>
                        <p className="text-sm uppercase tracking-widest text-gray-400 font-bold">Active Warnings</p>
                        <div className="flex items-baseline gap-1">
                            <p className="text-8xl font-black text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.6)]">
                                {getWarningCount()}
                            </p>
                            <span className="text-5xl font-bold text-yellow-400/70">alerts</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-400 shadow-lg shadow-yellow-500/50"></div>
                    </div>
                </div>
            </div>

            {/* Devices Section - 1x4 Grid */}
            <div className="mt-12">
                <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">Device Controls</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {['fan', 'motor', 'door', 'light'].map((deviceName) => {
                        const device = devices.find(d => d.name === deviceName);
                        if (!device) return null;

                        const isOn = device.status === 'on';
                        const colorClass = isOn ? 'text-green-400' : 'text-red-400';
                        const bgGradient = isOn ? 'from-green-500/20 to-transparent' : 'from-red-500/20 to-transparent';
                        const borderColor = isOn ? 'border-green-500/50' : 'border-red-500/50';
                        const shadowColor = isOn ? 'shadow-green-500/20' : 'shadow-red-500/20';

                        return (
                            <div
                                key={deviceName}
                                className={`group relative rounded-3xl bg-gradient-to-br from-[#3F3F3F] to-[#2a2a2a] border border-gray-500/50 px-6 py-8 cursor-pointer hover:${borderColor} transition-all duration-300 shadow-xl hover:${shadowColor}`}
                                onClick={() => handleDeviceToggle(device.name, isOn ? 'off' : 'on')}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                <div className="relative flex flex-col items-center space-y-6">
                                    <p className="text-sm uppercase tracking-widest text-gray-300 font-bold">{deviceName}</p>
                                    <div className={`text-7xl transition-transform duration-300 group-hover:scale-110 ${isOn ? 'drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]' : 'grayscale opacity-70'}`}>
                                        {deviceName === 'fan' && '🌀'}
                                        {deviceName === 'motor' && '⚙️'}
                                        {deviceName === 'door' && '🚪'}
                                        {deviceName === 'light' && '💡'}
                                    </div>
                                    <div className={`px-4 py-1 rounded-full border ${isOn ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                                        <p className={`text-sm font-bold tracking-wider ${colorClass}`}>{isOn ? 'ACTIVE' : 'OFFLINE'}</p>
                                    </div>
                                    <div className={`w-full h-1.5 rounded-full bg-gradient-to-r ${isOn ? 'from-green-600 to-green-400 shadow-green-500/50' : 'from-red-600 to-red-400 shadow-red-500/50'} shadow-lg`}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
