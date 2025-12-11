'use client'
import React, { useState } from "react";

const SideBar = () => {

    const [sensorToggle, setSensorToggle] = useState(false)

    const liquidGlassClasses = "relative w-[90%] h-12 mt-4 flex items-center bg-white/5 backdrop-blur-md border border-white/40 rounded-xl shadow-[inset_0_1px_0px_rgba(255,255,255,0.7),0_0_10px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.15)] before:content-[''] before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/70 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none hover:bg-white/30 transition-all duration-300 after:content-[''] after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-tl after:from-white/40 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none";

    return (
        <div className="w-60 min-h-screen flex flex-col items-center bg-[#060C11] text-white border-r border-white">

            <div className={liquidGlassClasses}>
                <a href="/dashboard" className="no-underline flex ml-6 gap-2 items-center w-full h-full">
                    <i className="fa-solid fa-house"></i>
                    Dashboard
                </a>
            </div>

            <div className={liquidGlassClasses}>
                <a href="/analysis" className="no-underline flex ml-6 gap-2 items-center w-full h-full">
                    <i className="fa-solid fa-magnifying-glass-chart"></i>
                    Analysis
                </a>
            </div>

            <div className="w-full flex flex-col items-center">

                <div className={`${liquidGlassClasses} mx-auto mt-0 w-[90%]`}>
                    <a href="/logs" className="no-underline flex ml-6 gap-2 items-center w-full h-full">
                        <i className="fa-solid fa-book"></i>
                        Logs
                    </a>
                    <i
                        className={`fa-solid fa-angle-down absolute right-3 transition-transform duration-300 cursor-pointer hover:border hover:border-white hover:rounded-sm hover:bg-white/50 z-20 ${sensorToggle ? "rotate-180" : ""}`}
                        onClick={() => setSensorToggle(!sensorToggle)}
                    ></i>
                </div>

                {sensorToggle && (
                    <ul className="relative w-[90%] mx-auto mt-1 flex flex-col items-end">
                        <a href="/dashboard" className={liquidGlassClasses.replace("mt-4", "mt-0")}> Temperature sensor</a>
                        <a href="/dashboard" className={liquidGlassClasses}>Water level sensor</a>
                        <a href="/dashboard" className={liquidGlassClasses}>Smoke detector</a>
                        <a href="/dashboard" className={liquidGlassClasses}>Water leak detector</a>
                    </ul>
                )}
            </div>

            <div className={liquidGlassClasses}>
                <a href="/notification" className="no-underline flex ml-6 gap-2 items-center w-full h-full">
                    <i className="fa-solid fa-envelope"></i>
                    Notification
                </a>
            </div>

            <div className={liquidGlassClasses}>
                <a href="/dashboard/devices" className="no-underline flex ml-6 gap-2 items-center w-full h-full">
                    <i className="fa-solid fa-hard-drive"></i>
                    Devices
                </a>
            </div>

            <div className={liquidGlassClasses}>
                <a href="/dashboard/profile" className="no-underline flex ml-6 gap-2 items-center w-full h-full">
                    <i className="fa-solid fa-address-card"></i>
                    Profile
                </a>
            </div>

            <div className={liquidGlassClasses}>
                <a href="/dashboard/abouts" className="no-underline flex ml-6 gap-2 items-center w-full h-full">
                    <i className="fa-solid fa-circle-info"></i>
                    Abouts
                </a>
            </div>

        </div>
    );
}

export default SideBar;