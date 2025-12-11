"use client";

const widgetStyle =
  "relative w-[900px] min-h-[500px] border border-white/40 rounded-xl flex flex-col items-start px-16 py-10 bg-white/5 backdrop-blur-md shadow-[inset_0_1px_0px_rgba(255,255,255,0.7),0_0_10px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.15)] \
  before:content-[''] before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent before:opacity-60 before:pointer-events-none \
  after:content-[''] after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-tl after:from-white/10 after:via-transparent after:to-transparent after:opacity-40 after:pointer-events-none";

export default function AboutPage() {
  return (
    <div className=" mt-[60px] flex flex-col flex-1 h-screen bg-[#060C11] justify-center items-center text-white px-4">

      {/* MAIN WIDGET */}
      <div className={widgetStyle}>

        {/* GROUP TITLE */}
        <h1 className="text-2xl font-bold w-full text-center mb-6">
          23CLC09 – PHY00007 – Group 03
        </h1>

        {/* MEMBER BOX */}
        <div className="w-full border border-white/40 rounded-lg px-10 py-6 mb-10">
          <h2 className="text-xl font-semibold text-center mb-4">Members</h2>

          <div className="flex flex-col gap-2 text-lg">
            <div className="flex justify-between">
              <span>Lê Nhật Duy</span>
              <span>23127177</span>
            </div>

            <div className="flex justify-between">
              <span>Đoàn Quang Minh Triết</span>
              <span>23127131</span>
            </div>

            <div className="flex justify-between">
              <span>Lưu Vĩnh Phát</span>
              <span>23127448</span>
            </div>
          </div>
        </div>

        {/* SECTIONS */}
        <div className="flex flex-col gap-8 w-full text-[17px] leading-relaxed">

          {/* ABOUT PROJECT */}
          <section>
            <h3 className="text-orange-400 font-bold text-lg mb-1">About our project</h3>
            <p className="text-gray-200">
              This website is part of our IoT project called Safe Parking Basement System,
              designed to monitor and prevent flooding, overheating, and unexpected intrusions
              inside underground parking spaces.
            </p>
          </section>

          {/* VISION */}
          <section>
            <h3 className="text-orange-400 font-bold text-lg mb-1">Our Vision</h3>
            <p className="text-gray-200">
              We aim to create a smart, reliable, and user-friendly system that helps building
              owners protect their assets and ensure safety through real-time monitoring and
              automated control.
            </p>
          </section>

          {/* WHAT WE BUILT */}
          <section>
            <h3 className="text-orange-400 font-bold text-lg mb-1">What We Built</h3>
            <p className="text-gray-200 mb-2">
              Our system integrates multiple IoT sensors and devices, including:
            </p>

            <ul className="list-disc ml-6 text-gray-300">
              <li>Water level sensor</li>
              <li>Temperature sensor</li>
              <li>Motion detection sensor</li>
              <li>Water leak sensor</li>
            </ul>

            <p className="text-gray-200 mt-2">
              Automated pump, fan, lighting system, and anti-flood door.  
              Data is collected continuously and displayed on this website.  
              Users can monitor status, control devices remotely, and receive alerts instantly when the system detects a risk.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
