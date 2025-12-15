"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "../api.js";

const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const saveUser = (info) => setUser(info);
    const clearUser = () => setUser(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await api("/api/user/me", {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                });

                if (res.ok){
                    setUser(res.payload);
                }else{
                    setUser(null);
                }


            } catch (err) {
                // console.log("Error fetching user:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, saveUser, clearUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(AuthContext);
}
