'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/layout/SideBar";
import NavBar from "@/components/layout/NavBar";
import ChatBubble from "@/components/ui/ChatBubble";
import { useAuthContext } from "@/lib/context/authContext";

function Spinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#060C11]">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-white" />
    </div>
  );
}

export default function HomeLayout({ children }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/home');
    }
  }, [loading, user, router]);

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>

      <div className="fixed top-[60px] left-0 h-[calc(100vh-60px)] w-64 z-40">
        <SideBar />
      </div>

      <main className="pl-60 min-w-screen flex-1 w-full bg-[#060C11]">
        <ChatBubble />
        {children}
      </main>
    </div>
  );
}
