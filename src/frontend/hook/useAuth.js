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
                setError(res.payload.message);
                return null;
            }
            setError('');
            setSuccess(true);
            return res;

        } catch (e) {
            setError(`Register failed: ${res.payload.message}`);
            return null;

        } finally {
            setLoading(false);
        }
    };


    const login = async (username, password) => {
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const res = await api("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ username, password }),
                credentials: "include"
            });

            if (!res.ok) {
                setError(res.payload.message);
                return null;
            }


            saveUser(res.payload || null);

            setSuccess(true);
            return res;

        } catch (e) {
            setError("Login failed");
            setSuccess(false);
            return null;

        } finally {
            setLoading(false);
        }
    };


    const logout = async () => {
        setLoading(true);
        clearUser();

        const res = await api("/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });
        setLoading(false);
        setSuccess(true);
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
