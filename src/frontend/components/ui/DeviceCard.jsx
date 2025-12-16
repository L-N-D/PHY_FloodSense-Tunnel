// components/DeviceCard.jsx

const widgetStyle = "w-[300px] h-[150px] border border-white rounded rounded-lg flex justify-center items-center flex-col bg-white/5 backdrop-blur-md border border-white/40 rounded-xl shadow-[inset_0_1px_0px_rgba(255,255,255,0.7),0_0_10px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.15)] before:content-[''] before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/70 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none hover:bg-white/30 transition-all duration-300 after:content-[''] after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-tl after:from-white/40 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none";

export default function DeviceCard({title, status, onOnClick, onOffClick}) {

    return (
        <div className={widgetStyle}>
            <h3 className="text-white text-lg mb-2">{title}</h3>

            {/* STATUS */}
            <div className="mb-3">
                <span
                    className={
                        status === "on" || status === "active" || status === "open"
                            ? "text-green-400 font-semibold"
                            : "text-red-400 font-semibold"
                    }
                >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">

                <button
                    onClick={onOffClick}
                    className={`px-4 py-1 rounded text-white border 
                        ${status === "off" ? "bg-red-600" : "bg-red-500/40"}
                    `}
                >
                    Off
                </button>

                <button
                    onClick={onOnClick}
                    className={`px-4 py-1 rounded text-white border 
                        ${status === "on" || status === "active" || status === "open"
                            ? "bg-green-600"
                            : "bg-green-500/40"}
                    `}
                >
                    On
                </button>

            </div>
        </div>
    );
}
