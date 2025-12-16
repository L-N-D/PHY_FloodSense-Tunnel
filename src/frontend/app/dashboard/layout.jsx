'use client';
import SideBar from "@/components/layout/SideBar";
import NavBar from "@/components/layout/NavBar";
import ChatBubble from "@/components/ui/ChatBubble";

export default function HomeLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">

      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>

      <div className="fixed top-[60px] left-0 h-[calc(100vh-60px)] w-64 z-40">
        <SideBar />
      </div>

      <main className=" pl-60 min-w-screen flex-1 w-full justify-center items-center bg-[#060C11]">
        <ChatBubble />
        {children}
      </main>

    </div>
  );
}
