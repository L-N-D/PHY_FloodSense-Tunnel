'use client';

import { useEffect, useState, useMemo } from 'react';
import { api } from '@/lib/api';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { format } from 'date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function SmokeLogs() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch history
                const data = await api.sensors.getHistory('smoke', { limit: 50 });
                // Ensure data is sorted by timestamp ascending for the chart
                const sortedData = Array.isArray(data) ? data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) : [];
                setHistory(sortedData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching smoke data:', error);
                setLoading(false);
            }
        };

        fetchData();
        // Set up polling every 5 seconds to keep data fresh
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    // Compute stats
    const stats = useMemo(() => {
        if (!history.length) return null;

        const values = history.map(d => d.value);
        const latest = history[history.length - 1];
        const min = Math.min(...values);
        const max = Math.max(...values);
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;

        return {
            latest,
            min,
            max,
            avg
        };
    }, [history]);

    // Chart Configuration
    const chartData = {
        labels: history.map(d => format(new Date(d.timestamp), 'HH:mm')),
        datasets: [{
            label: 'Smoke Level',
            data: history.map(d => d.value),
            borderColor: '#22c55e', // Green-500
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.4,
            fill: true
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                display: true,
                grid: { display: false },
                ticks: { color: '#9ca3af', maxTicksLimit: 12 }
            },
            y: {
                display: true,
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#9ca3af' }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    // Helper for status badge
    const getStatusBadge = (value) => {
        if (value > 300) return { label: 'Dangerous', class: 'bg-red-600 text-white' };
        if (value > 200) return { label: 'High', class: 'bg-orange-600 text-white' };
        if (value > 100) return { label: 'Elevated', class: 'bg-yellow-600 text-white' };
        return { label: 'Normal', class: 'bg-green-600 text-white' };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500/20 border-t-green-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-1">Smoke Detector Logs</h1>
                <p className="text-sm text-gray-400">History and visualization (Text, Gauge, Chart)</p>
            </div>

            {/* Vertical Stack of Views */}
            <div className="space-y-6">

                {/* 1. Text View */}
                <div className="rounded-2xl bg-[#3F3F3F] border border-gray-500/50 px-6 py-6">
                    <p className="text-sm uppercase tracking-wider text-gray-300 mb-4 font-semibold">Text View</p>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="space-y-1">
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-bold text-green-400">
                                    {stats?.latest?.value?.toFixed(0) ?? '--'}
                                </span>
                                <span className="text-3xl text-green-400/70">ppm</span>
                            </div>
                            <p className="text-sm text-gray-400">
                                Last update: {stats?.latest ? format(new Date(stats.latest.timestamp), 'HH:mm:ss') : '--'}
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-8 border-t md:border-t-0 md:border-l border-gray-600/50 pt-4 md:pt-0 md:pl-8">
                            <div>
                                <p className="text-xs text-gray-400 uppercase mb-1">Min</p>
                                <p className="text-2xl font-semibold text-white">{stats?.min?.toFixed(0) ?? '--'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase mb-1">Avg</p>
                                <p className="text-2xl font-semibold text-white">{stats?.avg?.toFixed(0) ?? '--'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase mb-1">Max</p>
                                <p className="text-2xl font-semibold text-white">{stats?.max?.toFixed(0) ?? '--'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Gauge View */}
                <div className="rounded-2xl bg-[#3F3F3F] border border-gray-500/50 px-6 py-6">
                    <p className="text-sm uppercase tracking-wider text-gray-300 mb-6 font-semibold">Gauge View</p>
                    <div className="flex items-center justify-center py-4">
                        <div className="relative w-64 h-32">
                            <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
                                {/* Background Arc */}
                                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#374151" strokeWidth="16" strokeLinecap="round" />

                                {/* Value Arc */}
                                <path
                                    d="M 20 100 A 80 80 0 0 1 180 100"
                                    fill="none"
                                    stroke="url(#smokeGradient)"
                                    strokeWidth="16"
                                    strokeLinecap="round"
                                    strokeDasharray="251.2"
                                    strokeDashoffset={251.2 * (1 - (Math.min(Math.max(stats?.latest?.value || 0, 0), 500) / 500))}
                                    className="transition-all duration-1000 ease-out"
                                />
                                <defs>
                                    <linearGradient id="smokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#22c55e" />
                                        <stop offset="50%" stopColor="#eab308" />
                                        <stop offset="100%" stopColor="#ef4444" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            {/* Value Text */}
                            <div className="absolute bottom-0 left-0 right-0 text-center transform translate-y-4">
                                <span className="text-4xl font-bold text-white">
                                    {stats?.latest?.value?.toFixed(0) ?? '--'}
                                </span>
                                <span className="text-lg text-gray-400 ml-1">ppm</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Chart View */}
                <div className="rounded-2xl bg-[#3F3F3F] border border-gray-500/50 px-6 py-6">
                    <p className="text-sm uppercase tracking-wider text-gray-300 mb-4 font-semibold">Chart View</p>
                    <div className="h-[300px] w-full">
                        {history.length > 0 ? (
                            <Line data={chartData} options={chartOptions} />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                No data available
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. Recent Readings Table */}
                <div className="rounded-2xl bg-[#3F3F3F] border border-gray-500/50 px-6 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm uppercase tracking-wider text-gray-300 font-semibold">Recent Readings</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-gray-100">
                            <thead className="border-b border-gray-600 text-xs uppercase text-gray-400">
                                <tr>
                                    <th className="py-3 text-left font-semibold">Timestamp</th>
                                    <th className="py-3 text-left font-semibold">Smoke Level</th>
                                    <th className="py-3 text-left font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {history.slice().reverse().slice(0, 10).map((entry, index) => {
                                    const status = getStatusBadge(entry.value);
                                    return (
                                        <tr key={index} className="hover:bg-white/5 transition-colors">
                                            <td className="py-3 pr-4 text-gray-300">
                                                {format(new Date(entry.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                                            </td>
                                            <td className="py-3 pr-4 font-medium">
                                                {entry.value.toFixed(0)} ppm
                                            </td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${status.class}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="py-4 text-center text-gray-500">
                                            No readings found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
