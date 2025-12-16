
const data = [
    { type: "Action", message: "Door closed", time: "15:00 | 20/11/2025" },
    { type: "Warn", message: "High water level", time: "14:35 | 20/11/2025" },
    { type: "Email", message: "Smoke detected", time: "14:10 | 20/11/2025" },
    { type: "System", message: "Door opened", time: "13:00 | 20/11/2025" },
    { type: "Action", message: "Fan activate", time: "12:50 | 20/11/2025" },
    { type: "Action", message: "Fan deactivate", time: "12:00 | 20/11/2025" },
];

export default function LogPage() {
    const typeStyles = {
        Action: "bg-green-700 text-green-200",
        Warn: "bg-yellow-600 text-yellow-200",
        Email: "bg-orange-600 text-orange-200",
        System: "bg-purple-700 text-purple-300",
    };

    let historyData = data;

    return (
        <div className="mt-[60px] flex flex-col flex-1 h-screen bg-[#060C11] justify-center items-center text-white px-4">
            {historyData.map((item, index) => (
                <div
                    key={index}
                    className="w-[1400px] border border-white/30 rounded-2xl m-2 px-6 py-3"
                >
                    <div className="flex justify-between items-center">

                        <div className="flex items-center gap-3">

                            <div className="w-[70px]">
                                <span
                                    className={`px-3 py-1 rounded-md text-sm font-semibold ${typeStyles[item.type]}`}
                                >
                                    {item.type}
                                </span>
                            </div>

                            <span className="text-white text-sm font-medium">
                                {item.message}
                            </span>
                        </div>

                        {/* RIGHT: time */}
                        <span className="text-gray-300 text-sm">
                            {item.time}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}