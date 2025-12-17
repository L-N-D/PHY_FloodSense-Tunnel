'use client';

import { useContext } from "react";
import { sensorContext } from "@/lib/context/sensorContext";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function useDashboard (sensorName) {

    const context = useContext(sensorContext);

    if (!context){
        return 0;
    }

    return context.sensor[sensorName]?.value ?? 0;

}