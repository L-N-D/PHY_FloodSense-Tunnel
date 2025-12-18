'use client'
import GaugeChart from "@/components/ui/GaugeChart";
import BulletChart from "@/components/ui/BulletChart";
import TextDisplay from "@/components/ui/TextDisplay";
import DeviceStatus from "@/components/ui/DeviceStatus";
import { useState, useEffect } from "react";
import useDashboard from "@/hook/useDashboard";
import { useAPI } from "@/hook/useApi";

const widgetStyle = "w-[422px] h-[204px] border border-white rounded rounded-lg flex justify-center bg-white/5 backdrop-blur-md border border-white/40 rounded-xl shadow-[inset_0_1px_0px_rgba(255,255,255,0.7),0_0_10px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.15)] before:content-[''] before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/70 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none hover:bg-white/30 transition-all duration-300 after:content-[''] after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-tl after:from-white/40 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none";
const widgetDevice = "w-[150px] h-[150px] border border-white rounded rounded-lg flex justify-center bg-white/5 backdrop-blur-md border border-white/40 rounded-xl shadow-[inset_0_1px_0px_rgba(255,255,255,0.7),0_0_10px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.15)] before:content-[''] before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/70 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none hover:bg-white/30 transition-all duration-300 after:content-[''] after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-tl after:from-white/40 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none";

// Sửa lại chỗ này 1 chút vì API sẽ gọi ở đây thay vì truyền dữ liệu từ bên file components
export default function HomePage() {

  const [warningCount, setWarningCount] = useState(0);

  const { getWarning, loading } = useAPI();

  const tempData = useDashboard('temperature');
  const waterLevelData = useDashboard('water');
  const smokeData = useDashboard('smoke');

  const doorStatus = Boolean(Number(useDashboard('gate')));
  const motorStatus = Boolean(Number(useDashboard('pump')));
  const rainSatus = Boolean(Number(useDashboard('rain')));
  const fanStatus = Boolean(Number(useDashboard('fan')));
  // console.log();
  // console.log(useDashboard('gate'), typeof useDashboard('gate'));

  useEffect(() => {
    const fetchWarning = async () => {
      try {
        const count = await getWarning();
        // console.log(count.payload.total);
        setWarningCount(count.payload.total)
      } catch (err) {
        console.error("Failed to fetch warning count:", err);
      }
    };

    fetchWarning();
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-[#060C11] justify-center items-center border border-white gap-20">
      <div className="w-[988px] h-[210px] flex justify-between items-center">
        <div className={widgetStyle}>
          {/* gán data nhiệt độ */}
          <GaugeChart value={tempData} label="Temperature (°C)" />
        </div>
        <div className={widgetStyle}>
          {/* gán data nước */}
          <GaugeChart value={waterLevelData} label="Water Level (cm)" />
        </div>
      </div>

      <div className="w-[988px] h-[210px] flex justify-between items-center">
        <div className={widgetStyle}>
          <BulletChart value={smokeData} label="Smoke Sensor (ppm)" />
        </div>
        <div className={widgetStyle}>
          <TextDisplay value={warningCount} label="Warnings" />
        </div>
      </div>

      <div className="w-[988px] h-[210px] flex justify-between items-center">
        <div className={widgetDevice}>
          <DeviceStatus label="Fan" isOn={fanStatus} iconName="fa-fan" />
        </div>
        <div className={widgetDevice}>
          <DeviceStatus label="Pump" isOn={motorStatus} iconName="fa-faucet" />
        </div>
        <div className={widgetDevice}>
          <DeviceStatus label="Gate" isOn={doorStatus} iconName="fa-door-open" />
        </div>
        <div className={widgetDevice}>
          <DeviceStatus label="Rain" isOn={rainSatus} iconName="fa-droplet" />
        </div>
      </div>
    </div>
  );
}
