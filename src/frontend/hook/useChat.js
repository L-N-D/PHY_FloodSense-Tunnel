"use client";

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
const baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function useChatSocket({ onMessage, onError }) {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(baseURL);

    socketRef.current.on("system:response", onMessage);
    socketRef.current.on("system:error", onError);

    return () => socketRef.current?.disconnect();
  }, []);

  /**
   * Gửi message + history
   */
  const sendMessage = (message, history) => {
    socketRef.current?.emit("system:query", {
      message,
      history
    });
  };

  return { sendMessage };
}
