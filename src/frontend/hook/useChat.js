"use client";

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuthContext } from "@/lib/context/authContext.js";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function useChatSocket({ onMessage, onError }) {
  const socketRef = useRef(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user?.username) return;

    socketRef.current = io(baseURL);
    console.log(user.username);

    socketRef.current.emit("Sign_chatbot", user.username);

    socketRef.current.on("chatbot:reply", onMessage);
    socketRef.current.on("chatbot:error", onError);

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [user, onMessage, onError]);

  const sendMessage = (message) => {
    if (!socketRef.current) return;

    socketRef.current.emit("chatbot:send", { message });
  };

  return { sendMessage };
}
