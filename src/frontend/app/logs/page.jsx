'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

// Mock API for logs since it's not in the global api.js yet
const mockLogsApi = {
    getAll: async () => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return [
            {
                id: '1',
                type: 'system',
                message: 'System initialized successfully',
                timestamp: new Date().toISOString()
            },
            {
                id: '2',
                type: 'action',
                message: 'Water Pump activated manually',
                timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 mins ago
            },
            {
                id: '3',
                type: 'warn',
                message: 'High temperature detected in Tunnel Section A',
                timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45 mins ago
            },
            {
                id: '4',
                type: 'email',
                message: 'Alert notification sent to admin@floodsense.com',
                timestamp: new Date(Date.now() - 1000 * 60 * 46).toISOString() // 46 mins ago
            },
            {
                id: '5',
                type: 'action',
                message: 'Ventilation Fan turned ON',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
            },
            {
                id: '6',
                type: 'system',
                message: 'Scheduled maintenance check completed',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
            },
            {
                id: '7',
                type: 'warn',
                message: 'Water level approaching critical threshold (85%)',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() // 12 hours ago
            },
            {
                id: '8',
                type: 'system',
                message: 'Firmware updated to v2.1.0',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
            }
        ];
    }
};

export default function LogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                // In a real scenario, this would be: const data = await api.logs.getAll();
                const data = await mockLogsApi.getAll();
                setLogs(data);
            } catch (error) {
                console.error('Error fetching logs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const getBadgeStyle = (type) => {
        switch (type) {
            case 'action':
                return 'bg-emerald-500 text-white';
            case 'warn':
                return 'bg-amber-500 text-white';
            case 'email':
                return 'bg-yellow-500 text-white';
            case 'system':
                return 'bg-purple-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const formatTimestamp = (isoString) => {
        try {
            return format(new Date(isoString), 'HH:mm | dd/MM/yyyy');
        } catch (e) {
            return isoString;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500/20 border-t-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-1">Logs</h1>
                <p className="text-sm text-gray-400">Recent system and device events</p>
            </div>

            {/* Logs Container */}
            <div className="max-w-4xl mx-auto">
                <div className="rounded-3xl bg-[#3F3F3F] border border-gray-500/50 px-6 py-6 space-y-3">
                    {logs.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            No logs yet for today
                        </div>
                    ) : (
                        logs.map((log) => (
                            <div
                                key={log.id}
                                className="flex items-center justify-between rounded-full bg-[#353535] px-4 py-3 gap-4 hover:bg-[#2f2f2f] transition-colors"
                            >
                                {/* Left side: Badge + Message */}
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold capitalize whitespace-nowrap ${getBadgeStyle(log.type)}`}>
                                        {log.type}
                                    </span>
                                    <span className="text-sm text-gray-100 truncate">
                                        {log.message}
                                    </span>
                                </div>

                                {/* Right side: Timestamp */}
                                <span className="text-xs text-gray-300 whitespace-nowrap font-mono">
                                    {formatTimestamp(log.timestamp)}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
