'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    LayoutDashboard,
    Activity,
    FileText,
    Cpu,
    Bell,
    User,
    Info
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analysis', href: '/analysis', icon: Activity },
    { name: 'Logs', href: '/logs', icon: FileText },
    { name: 'Devices', href: '/devices', icon: Cpu },
    { name: 'Notification', href: '/notification', icon: Bell },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'About', href: '/about', icon: Info },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-[69px] h-[calc(100vh-69px)] transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 w-[237px] border-r border-white/10 bg-gradient-to-b from-[#020617] via-[#111827] to-[#020617]`}
            >
                <div className="flex flex-col h-full">
                    {/* Navigation */}
                    <nav className="flex-1 flex flex-col items-center pt-6 space-y-4">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.name}
                                    className="flex justify-center w-[207px]"
                                >
                                    <Link
                                        href={item.href}
                                        className={`flex items-center w-full px-4 py-3 gap-3 rounded-xl transition-all duration-300 group ${isActive
                                                ? 'bg-gradient-to-r from-cyan-500 to-sky-400 shadow-lg shadow-cyan-500/20'
                                                : 'hover:bg-white/5'
                                            }`}
                                        style={{
                                            textDecoration: 'none'
                                        }}
                                    >
                                        <Icon
                                            size={40}
                                            className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}
                                        />
                                        <span
                                            style={{
                                                fontFamily: 'Jersey 25',
                                                fontSize: '24px',
                                                lineHeight: '24px',
                                                paddingTop: '4px' // Optical alignment for Jersey 25 font
                                            }}
                                            className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}
                                        >
                                            {item.name}
                                        </span>
                                    </Link>
                                </div>
                            );
                        })}
                    </nav>
                </div>
            </aside>
        </>
    );
}
