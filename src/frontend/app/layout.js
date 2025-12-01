import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "FloodSense - Tunnel Monitoring System",
  description: "IoT monitoring and control system for flood and fire prevention",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-50`}>
        <div className="flex min-h-screen bg-gradient-to-br from-[#020617] via-[#111827] to-[#020617]">
          <Sidebar />
          <main className="flex-1 md:ml-64 p-8 bg-black/20 backdrop-blur-xl border-l border-white/5 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
