'use client';

import NavBar from "@/components/layout/NavBar";

export default function HomePage() {

    const widgetStyle =
        "relative w-[420px] h-[200px] border border-white/20 rounded-xl " +
        "flex flex-col items-center justify-center " +
        "bg-white/5 backdrop-blur-sm";

    return (
        <div className="flex flex-1 justify-center items-center min-h-screen bg-[#060C11] text-white">

            {/* NavBar cố định */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <NavBar />
            </div>

            <div className="pt-[100px] flex flex-col items-center text-center px-4">

                <h1 className="text-4xl font-bold mb-3">
                    IoT Monitoring Dashboard
                </h1>

                <p className="text-white/70 max-w-xl mb-12">
                    Chào mừng bạn đến với hệ thống giám sát IoT.
                    Vui lòng đăng nhập để truy cập dữ liệu cảm biến và bảng điều khiển.
                </p>

            </div>
        </div>
    );
}
