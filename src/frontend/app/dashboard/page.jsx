'use client'
import GaugeChart from "@/components/ui/GaugeChart";
import BulletChart from "@/components/ui/BulletChart";
import TextDisplay from "@/components/ui/TextDisplay";
import DeviceStatus from "@/components/ui/DeviceStatus";
import { useState, useEffect } from "react";

const widgetStyle = "w-[422px] h-[204px] border border-white rounded rounded-lg flex justify-center bg-white/5 backdrop-blur-md border border-white/40 rounded-xl shadow-[inset_0_1px_0px_rgba(255,255,255,0.7),0_0_10px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.15)] before:content-[''] before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/70 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none hover:bg-white/30 transition-all duration-300 after:content-[''] after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-tl after:from-white/40 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none";
const widgetDevice = "w-[150px] h-[150px] border border-white rounded rounded-lg flex justify-center bg-white/5 backdrop-blur-md border border-white/40 rounded-xl shadow-[inset_0_1px_0px_rgba(255,255,255,0.7),0_0_10px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.15)] before:content-[''] before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/70 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none hover:bg-white/30 transition-all duration-300 after:content-[''] after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-tl after:from-white/40 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none";

// Sửa lại chỗ này 1 chút vì API sẽ gọi ở đây thay vì truyền dữ liệu từ bên file components
export default function HomePage() {
  const [tempData, setTempData] = useState(0);
  const [waterLevelData, setWaterLevelData] = useState(0);
  const [smokeData, setSmokeData] = useState(0);
  const [warningCount, setWarningCount] = useState(0);

  // Device States
  const [fanStatus, setFanStatus] = useState(false);
  const [motorStatus, setMotorStatus] = useState(false);
  const [doorStatus, setDoorStatus] = useState(false);
  const [lightStatus, setLightStatus] = useState(false);

  useEffect(() => {
    // Simulate API call
    const interval = setInterval(() => {
      // random biến nhiệt độ
      const randomTemp = Math.floor(Math.random() * 50) + 20; // Random temp 20-70
      // random biến độ cao nước
      const randomWater = Math.floor(Math.random() * 101); // Random water 0-100
      // random biến khói
      const randomSmoke = Math.floor(Math.random() * 500); // Random smoke 0-500 ppm
      // random số lần cảnh báo
      const randomWarning = Math.floor(Math.random() * 10);

      // Random device status
      setFanStatus(Math.random() > 0.5);
      setMotorStatus(Math.random() > 0.5);
      setDoorStatus(Math.random() > 0.5);
      setLightStatus(Math.random() > 0.5);

      setTempData(randomTemp);
      setWaterLevelData(randomWater);
      setSmokeData(randomSmoke);
      setWarningCount(randomWarning);
    }, 1000);

    return () => clearInterval(interval);
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
          <GaugeChart value={waterLevelData} label="Water Level (mm)" />
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
          <DeviceStatus label="Motor" isOn={motorStatus} iconName="fa-faucet" />
        </div>
        <div className={widgetDevice}>
          <DeviceStatus label="Door" isOn={doorStatus} iconName="fa-door-open" />
        </div>
        <div className={widgetDevice}>
          <DeviceStatus label="Light" isOn={lightStatus} iconName="fa-lightbulb" />
        </div>
      </div>
    </div>
  );
}
