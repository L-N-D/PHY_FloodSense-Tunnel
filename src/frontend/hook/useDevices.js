'use client';
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

let commonSocket = null;

function initSocket () {

    if (!commonSocket){
        commonSocket = io(baseURL);
        return commonSocket;
    }

    return commonSocket;

}

export function useDevices() {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const socket = initSocket();

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("connect_error", (err) => {
      setError("Không thể kết nối tới hệ thống điều khiển");
      console.error(err);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, []);

  const toggleDevice = (payload) => {
    if (!commonSocket || !connected) return;

    console.log('send cmd');

    commonSocket.emit("device:cmd", {
      deviceName: payload.deviceName,
      state: payload.status ? 1 : 0,
    });
  };

  return {
    toggleDevice,
    connected,
    error,
  };
}
