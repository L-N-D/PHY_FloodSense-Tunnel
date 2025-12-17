'use client';

import { createContext, useEffect, useRef, useState } from "react";
import { useAuthContext } from "./authContext.js";
import { io } from "socket.io-client";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
export const sensorContext = createContext(null);

let commonSocket = null;

function initSocket () {

    if (!commonSocket){
        commonSocket = io(baseURL);
        return commonSocket;
    }

    return commonSocket;

}

export function SensorContextProvider ({children}) {

    const {user} = useAuthContext();
    const socketRef = useRef(null);

    const [sensor, setSensor] = useState({});

    useEffect ( () => {

        // console.log("SensorContext mounted");
        if (!user?.username){return;}

        const socket = initSocket();

        socketRef.current = socket;

        socket.emit('Sign_room', {type: 'dashboard', id: 'sensor'});

        const filter = (data) => {
            // console.log(data.sensorName);
            setSensor(prev => ({
                ...prev,
                [data.sensorName]: {
                    value: data.value
                },
            }));
        }

        socket.on('sensor:update', filter);
        socket.on('device:update', filter);

        return () => {
            console.log("SensorContext unmounted");
            socket.off('sensor:update', filter);
            socket.off('device:update', filter);
        };

    }, [user]);

    return (
        <sensorContext.Provider value={{ sensor }}>
            {children}
        </sensorContext.Provider>
    );

}