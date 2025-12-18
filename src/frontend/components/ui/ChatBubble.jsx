"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@/lib/context/chatContext.js";

const glassChatStyle = `
overflow-hidden
rounded-2xl
cursor-pointer
bg-white/10
backdrop-blur-xl
shadow-[0_12px_30px_rgba(0,0,0,0.18)]
ring-1 ring-white/30

before:content-['']
before:absolute
before:inset-0
before:rounded-2xl
before:pointer-events-none
before:bg-gradient-to-br
before:from-white/45
before:via-white/10
before:to-transparent
before:opacity-80

after:content-['']
after:absolute
after:inset-[1px]
after:rounded-[14px]
after:pointer-events-none
after:shadow-[inset_0_-1px_2px_rgba(0,0,0,0.25)]
after:bg-gradient-to-tl
after:from-black/10
after:via-transparent
after:to-transparent

transition-all
duration-300
ease-out
`;

const glassButtonStyle = `
relative
cursor-pointer
overflow-hidden
rounded-lg
bg-white/20
backdrop-blur-md
ring-1 ring-white/30
shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_10px_rgba(0,0,0,0.15)]
transition-all
duration-200
ease-out
hover:bg-white/30
hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_6px_14px_rgba(0,0,0,0.2)]
active:scale-[0.97]
`;

const glassInputStyle = `
cursor-pointer
rounded-lg
bg-white/30
backdrop-blur-md
ring-1 ring-white/30
shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)]
text-white
placeholder:text-gray-500
outline-none
focus:ring-2
focus:ring-blue-400/60
transition-all
duration-200
`;

const glassFloatingButtonStyle = `
overflow-hidden
rounded-full
cursor-pointer

bg-white/20
backdrop-blur-xl

ring-1 ring-white/40

shadow-[0_8px_20px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.6)]

transition-all
duration-300
ease-out

hover:bg-white/30
hover:shadow-[0_12px_26px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.8)]

active:scale-[0.92]
`;

const glassFloatingButtonReflect = `
before:content-['']
before:absolute
before:inset-0
before:rounded-full
before:pointer-events-none
before:bg-gradient-to-br
before:from-white/60
before:via-white/10
before:to-transparent
before:opacity-70
`;

const glassHeaderStyle = `
relative
overflow-hidden
px-4 py-3
flex items-center justify-between

bg-white/15
backdrop-blur-xl

border-b border-white/25

before:content-['']
before:absolute
before:inset-0
before:pointer-events-none
before:bg-gradient-to-br
before:from-white/40
before:via-white/10
before:to-transparent
before:opacity-80

shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]
`;



export default function ChatBubble() {
    const { messages, addUserMessage, clearChat, isConnected } = useChat();
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const send = () => {
        if (!input.trim()) return;
        addUserMessage(input);
        setInput("");
    };

    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center text-white text-2xl ${glassFloatingButtonStyle} ${glassFloatingButtonReflect}`}
            >
                <i className="fa-solid fa-comment relative z-10"></i>
            </button>


            {open && (
                <div
                    className={`
                        fixed bottom-24 right-6 z-50
                        w-80 h-[420px]
                        flex flex-col
                        ${glassChatStyle}
                    `}
                >
                    <div className={`relative z-10 rounded-t-2xl ${glassHeaderStyle}`}>
                        <div className="flex flex-col leading-tight">
                            <span className="text-sm font-bold text-white">
                                System Chatbot
                            </span>
                            <span
                                className={`text-xs font-bold ${isConnected ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                {isConnected ? "Online" : "Offline"}
                            </span>
                        </div>
                        <button
                            onClick={clearChat}
                            title="Clear chat"
                            className={`px-2 py-1 ${glassButtonStyle}`}
                        >
                            <i className="fa-solid fa-trash text-white"></i>
                        </button>
                    </div>

                    <div className="relative z-10 flex-1 p-3 overflow-y-auto space-y-2 text-sm">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`max-w-[80%] p-2 rounded-lg backdrop-blur-md ${m.sender === "user"
                                    ? "bg-blue-500/70 text-white ml-auto shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
                                    : "bg-white/60 text-gray-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
                                    }`}
                            >
                                {m.text}
                            </div>
                        ))}
                        <div ref={endRef} />
                    </div>

                    <div className="relative z-10 p-2 border-t border-white/30 flex gap-2">
                        <input
                            className={`flex-1 px-3 py-2 text-sm ${glassInputStyle}`}
                            value={input}
                            placeholder="Nhập câu hỏi..."
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && send()}
                        />
                        <button
                            onClick={send}
                            className={`px-3 ${glassButtonStyle}`}
                        >
                            Gửi
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
