"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuthContext } from "@/lib/context/authContext.js";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function useChatSocket({ onMessage, onError }) {
  const socketRef = useRef(null);
  const { user } = useAuthContext();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user?.username) return;

    socketRef.current = io(baseURL);
    // console.log(user.username);
    // setIsConnected(true);
    // socketRef.current.emit("Sign_chatbot", user.username);
    socketRef.current.on("connect", () => {
      setIsConnected(true);
      socketRef.current.emit("Sign_chatbot", user.username);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    socketRef.current.on("connect_error", () => {
      setIsConnected(false);
    });

    socketRef.current.on("chatbot:reply", onMessage);
    socketRef.current.on("chatbot:error", onError);

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [user, onMessage, onError]);

  const sendMessage = (message) => {
    if (!socketRef.current || !isConnected) return;

    socketRef.current.emit("chatbot:send", { message });
  };

  // const isChatOn = () => {
  //   return socketRef.current === null ? false : true;
  // }

  return { sendMessage, isConnected,};
}
