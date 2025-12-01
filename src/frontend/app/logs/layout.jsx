'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const logTypes = [
    { name: 'Temperature', href: '/logs/temperature' },
    { name: 'Water Level', href: '/logs/water-level' },
    { name: 'Smoke Detector', href: '/logs/smoke' },
    { name: 'Water Leak', href: '/logs/water-leak' },
];

export default function LogsLayout({ children }) {
    const pathname = usePathname();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-white mb-2">Sensor Logs</h1>
                <p className="text-gray-400">Historical data and trends</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-3 border-b border-gray-800 pb-4">
                {logTypes.map((type) => {
                    const isActive = pathname === type.href;

                    return (
                        <Link
                            key={type.href}
                            href={type.href}
                            className={`px-4 py-2 rounded-lg transition-all ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <span className="font-medium">{type.name}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Content */}
            <div>{children}</div>
        </div>
    );
}
