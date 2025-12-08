'use client';
import { createContext, useContext, useState } from "react";

const AuthTokenContext = createContext(null);

export function AuthTokenProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);

    const saveToken = (token) => setAccessToken(token);
    const saveUser = (info) => setUser(info);
    const clearUser = () => setUser(null);
    const clearToken = () => setAccessToken(null);

    return (
        <AuthTokenContext.Provider value={{ accessToken, saveToken, clearToken, saveUser, clearUser, user }}>
            {children}
        </AuthTokenContext.Provider>
    );
}

export function useAuthToken() {
    return useContext(AuthTokenContext);
}
