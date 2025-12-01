'use client';

import Card from './Card';

export default function DeviceControlCard({ device, onToggle }) {
    const isOn = device?.status === 'on';

    const deviceIcons = {
        fan: '🌀',
        motor: '⚙️',
        door: '🚪',
        light: '💡',
        buzzer: '🔔'
    };

    return (
        <Card className="hover:border-blue-600 transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="text-3xl">{deviceIcons[device?.name] || '📦'}</div>
                    <div>
                        <h4 className="font-semibold text-white capitalize">{device?.name}</h4>
                        <p className="text-sm text-gray-400">{device?.description}</p>
                    </div>
                </div>

                <button
                    onClick={() => onToggle(device?.name, isOn ? 'off' : 'on')}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${isOn ? 'bg-green-600' : 'bg-gray-700'
                        }`}
                >
                    <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isOn ? 'translate-x-7' : 'translate-x-1'
                            }`}
                    />
                </button>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-800">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Status:</span>
                    <span className={`font-semibold ${isOn ? 'text-green-400' : 'text-gray-400'}`}>
                        {isOn ? 'ON' : 'OFF'}
                    </span>
                </div>
            </div>
        </Card>
    );
}
