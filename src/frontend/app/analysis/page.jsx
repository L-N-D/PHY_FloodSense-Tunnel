'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

export default function Analysis() {
    const [floodScore, setFloodScore] = useState(0);
    const [fireRisk, setFireRisk] = useState(0);
    const [radarData, setRadarData] = useState(null);
    const [aiNotification, setAiNotification] = useState('');
    const [severity, setSeverity] = useState('low');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalysis();
        const interval = setInterval(fetchAnalysis, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchAnalysis = async () => {
        try {
            const [floodData, fireData, radar, ai] = await Promise.all([
                api.analysis.getFloodScore(),
                api.analysis.getFireRisk(),
                api.analysis.getRadarData(),
                api.analysis.getAINotification()
            ]);

            setFloodScore(floodData.floodScore);
            setFireRisk(fireData.fireRisk);
            setRadarData(radar.data);
            setAiNotification(ai.message);
            setSeverity(ai.severity);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching analysis:', error);
            setLoading(false);
        }
    };

    // Compute overall risk: maximum of flood and fire risk
    const overallRisk = Math.max(floodScore, fireRisk);

    // Create radar data with exactly 3 axes: Flood, Fire, Risk
    const chartData = {
        labels: ['Flood', 'Fire', 'Risk'],
        datasets: [{
            label: 'Current Status',
            data: [floodScore, fireRisk, overallRisk],
            backgroundColor: 'rgba(6, 182, 212, 0.3)',
            borderColor: 'rgba(6, 182, 212, 1)',
            borderWidth: 3,
            pointBackgroundColor: 'rgba(6, 182, 212, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(6, 182, 212, 1)',
            pointHoverRadius: 8
        }]
    };

    const chartOptions = {
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 20,
                    color: '#e5e7eb',
                    backdropColor: 'transparent',
                    font: {
                        size: 18, // Increased from 14
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.15)',
                    lineWidth: 2
                },
                pointLabels: {
                    color: '#ffffff',
                    font: {
                        size: 24, // Increased from 18
                        weight: 'bold'
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: 18
                },
                bodyFont: {
                    size: 16
                },
                padding: 12,
                callbacks: {
                    label: function (context) {
                        return context.parsed.r + '%';
                    }
                }
            }
        },
        maintainAspectRatio: false
    };

    const getSeverityBorder = (severity) => {
        const borders = {
            low: 'border-green-500 shadow-green-500/50',
            medium: 'border-yellow-500 shadow-yellow-500/50',
            high: 'border-orange-500 shadow-orange-500/50',
            critical: 'border-red-500 shadow-red-500/50'
        };
        return borders[severity] || 'border-gray-500';
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
                <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">Analysis</h1>
                <p className="text-lg text-gray-400">Today overview of flood and fire risk</p>
            </div>

            {/* Top Row - Today Analysis (2 cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Flood Score Card */}
                <div className="group relative rounded-3xl bg-gradient-to-br from-[#3F3F3F] to-[#2a2a2a] border border-gray-500/50 px-8 py-12 hover:border-cyan-500/50 transition-all duration-300 shadow-xl hover:shadow-cyan-500/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex flex-col items-center justify-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-2">
                            <span className="text-4xl">💧</span>
                        </div>
                        <h3 className="text-sm uppercase tracking-widest text-gray-400 font-bold">Flood Score</h3>

                        {/* Number and Percentage on same row */}
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-9xl font-black text-cyan-400 drop-shadow-[0_0_30px_rgba(6,182,212,0.6)]">
                                {Math.round(floodScore)}
                            </span>
                            <span className="text-6xl font-bold text-cyan-400/70">%</span>
                        </div>

                        <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-lg shadow-cyan-500/50"></div>
                        <p className="text-sm text-red-400 uppercase tracking-wider font-semibold">flood risk level</p>
                    </div>
                </div>

                {/* Fire Risk Card */}
                <div className="group relative rounded-3xl bg-gradient-to-br from-[#3F3F3F] to-[#2a2a2a] border border-gray-500/50 px-8 py-12 hover:border-orange-500/50 transition-all duration-300 shadow-xl hover:shadow-orange-500/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex flex-col items-center justify-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-2">
                            <span className="text-4xl">🔥</span>
                        </div>
                        <h3 className="text-sm uppercase tracking-widest text-gray-400 font-bold">Fire Risk</h3>

                        {/* Number and Percentage on same row */}
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-9xl font-black text-orange-400 drop-shadow-[0_0_30px_rgba(251,146,60,0.6)]">
                                {Math.round(fireRisk)}
                            </span>
                            <span className="text-6xl font-bold text-orange-400/70">%</span>
                        </div>

                        <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-orange-600 to-orange-400 shadow-lg shadow-orange-500/50"></div>
                        <p className="text-sm text-red-400 uppercase tracking-wider font-semibold">fire risk level</p>
                    </div>
                </div>
            </div>

            {/* Bottom Row - Radar Chart + AI Notification */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Radar Chart Card */}
                <div className="rounded-3xl bg-gradient-to-br from-[#3F3F3F] to-[#2a2a2a] border border-gray-500/50 px-8 py-8 shadow-xl">
                    <h3 className="text-2xl font-bold text-white mb-6 text-center tracking-tight">Flood – Fire – Risk</h3>
                    <div className="h-[500px]"> {/* Increased height from h-96 */}
                        <Radar data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* AI Notification Card */}
                <div className={`rounded-3xl bg-gradient-to-br from-[#3F3F3F] to-[#2a2a2a] border-2 ${getSeverityBorder(severity)} px-8 py-8 shadow-2xl`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <span className="text-2xl">🤖</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">AI Notification</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold uppercase bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-white shadow-lg">
                            <span className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse"></span>
                            {severity}
                        </div>
                        <div className="bg-black/20 rounded-2xl p-6 border border-white/10">
                            <p className="text-gray-100 text-lg leading-relaxed">
                                {aiNotification}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
