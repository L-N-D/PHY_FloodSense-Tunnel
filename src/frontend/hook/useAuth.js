'use client';
import { useState } from "react";
import api from "../lib/api.js";
import { useAuthContext } from "@/lib/context/authContext.js";

export function useAuth() {

    const {saveUser, clearUser} = useAuthContext();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const register = async (email, username, password) => {
        setLoading(true);
        setError('');

        try {
            const res = await api("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({ email, username, password }),
                credentials: "include"
            });

            if (!res.ok){
                setError(res.data.message);
                return null;
            }
            setError('');
            return res;

        } catch (e) {
            setError(`Register failed: ${res.data.message}`);
            return null;

        } finally {
            setLoading(false);
        }
    };


    const login = async (username, password) => {
        setLoading(true);
        setError('');

        try {
            const res = await api("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ username, password }),
                credentials: "include"
            });

            if (res.error) {
                setError(res.error);
                return null;
            }


            saveUser(res.message || null);

            return res;

        } catch (e) {
            setError("Login failed");
            return null;

        } finally {
            setLoading(false);
        }
    };


    const logout = async () => {
        // setUser(null);
        setLoading(true);
        clearUser();

        const res = await api("/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });
        setLoading(false);
        return res;
    };


    return {
        loading,
        error,
        success,
        register,
        login,
        logout
    };
}
