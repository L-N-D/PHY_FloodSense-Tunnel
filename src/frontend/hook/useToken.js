'use client';

import { useState } from "react";


export function authToken () {
    const [accesToken, setAccessToken] = useState(null);

    const saveToken = (token) => {
        setAccessToken(token);
    }

    const clearToken = () => {
        setAccessToken(null);
    }

    return {accesToken, saveToken, clearToken};
}