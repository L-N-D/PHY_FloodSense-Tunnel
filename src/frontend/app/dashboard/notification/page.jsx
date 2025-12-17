'use client';
import { useAPI } from "@/hook/useApi";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Loading";

const data = [
    { type: "Email", isread: false, message: "Door closed", time: "15:00 | 20/11/2025" },
    { type: "Email", isread: true, message: "Door closed", time: "15:00 | 20/11/2025" },
    { type: "Phone", isread: true, message: "High water level", time: "14:35 | 20/11/2025" },
];

export default function LogPage() {

    const { getNotification, loading } = useAPI();
    const [listNoti, setListNoti] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const list = await getNotification();
                // console.log(count.payload.total);
                console.log("API notification response:", list);
                if (list.ok) {
                    setListNoti(list.payload);
                }
            } catch (err) {
                console.error("Failed to fetch warning count:", err);
            }
        };

        fetchData();
    }, []);

    const iconMap = {
        Email: (isread) => isread ? "fa-envelope-open text-green-400 scale-125" : "fa-envelope text-orange-400 scale-125",
        Phone: () => "fa-solid fa-phone text-blue-400 scale-125"
    };

    return (
        <div className="mt-[60px] flex flex-col flex-1 h-screen bg-[#060C11] justify-center items-center text-white px-4">
            {loading && <Spinner />}

            {!loading && listNoti.map((item, index) => (
                <div
                    key={index}
                    className="w-[1400px] border border-white/30 rounded-2xl m-2 px-6 py-3"
                >
                    <div className="flex justify-between items-center">

                        <div className="flex items-center gap-3">

                            <div className="w-[70px] flex justify-center">
                                <i className={`fa-solid ${iconMap['Email'](item.isread)} text-lg`}></i>
                            </div>

                            <span className="text-white text-sm font-medium">
                                {item.message}
                            </span>
                        </div>

                        <span className="text-gray-300 text-sm">
                            {item.createdAt
                                ? new Date(item.createdAt).toLocaleString('vi-VN', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })
                                : ''}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}