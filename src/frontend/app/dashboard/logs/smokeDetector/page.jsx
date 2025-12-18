'use client';
import TimeSeriesChart from "@/components/ui/TimeSeriesChart";
import { useEffect } from "react";
import { useLogs } from "@/hook/useLogs";
import Spinner from "@/components/ui/Loading";
import useDashboard from "@/hook/useDashboard";
const widgetPanel = `
  relative w-[700px] min-h-[180px] 
  border border-white/40 rounded-xl 
  flex flex-col items-center 
  bg-white/5 backdrop-blur-md
  shadow-[inset_0_1px_0px_rgba(255,255,255,0.6),0_0_8px_rgba(0,0,0,0.2),0_6px_18px_rgba(0,0,0,0.3)]
  overflow-hidden
  before:content-[''] before:absolute before:inset-0 before:rounded-xl
  before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-transparent 
  before:opacity-60 before:pointer-events-none
  hover:bg-white/10 transition-all duration-300
`;

export default function SmokeDetectorPage() {

    const { data, loading, error, getLogs } = useLogs();
    const smokeData = useDashboard('smoke');

    useEffect(() => {
        getLogs("smoke");
    }, []);

    // console.log(data);
    return (
        <div className="mt-[60px] flex flex-col gap-10 flex-1 h-screen bg-[#060C11] 
                        justify-center items-center text-white px-4">

            <div className={widgetPanel}>

                <h2 className="text-2xl font-semibold mt-4">Smoke Detector</h2>

                <div className="w-full px-8 mt-6 flex justify-between items-center">

                    {/* LEFT: Temperature */}
                    <div className="flex items-center gap-3">
                        <i className="fa-solid fa-smoking text-red-400 text-2xl"></i>

                        <div>
                            <div className="text-gray-300 text-xl">Smoke</div>
                            <div className="text-white text-2xl font-semibold">{smokeData} ppm</div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-gray-400 text-sm">Updated at</div>
                        <div className="text-green-700 text-sm font-bold">Real Time</div>
                    </div>

                </div>

            </div>

            <div className="w-[150px] h-[50px] border border-white rounded-4xl flex left-0 justify-center items-center">
                <h2 className="text-2xl">Logs</h2>
            </div>
            <div className="w-[1200px] h-[600px]">
                {loading? (<Spinner />) : (<TimeSeriesChart data={data} />)}
            </div>

        </div>
    );
}
