'use client';

import Card from './Card';

export default function SensorCard({ title, value, unit, trend }) {
    return (
        <Card className="hover:border-blue-600 transition-colors">
            <div className="flex-1">
                <p className="text-sm text-gray-400 mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">{value}</span>
                    <span className="text-lg text-gray-500">{unit}</span>
                </div>
                {trend && (
                    <p className="text-xs text-gray-500 mt-2">{trend}</p>
                )}
            </div>
        </Card>
    );
}
