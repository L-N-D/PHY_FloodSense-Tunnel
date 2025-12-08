'use client';
import { useState } from "react";
import api from "../lib/api.js";
import { useAuthToken } from "./useToken.js";

export function useAuth() {

    const { accessToken, saveToken, clearToken, saveUser, clearUser } = useAuthToken();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // -------- REGISTER --------
    const register = async (email, username, password, confirmPassword) => {
        setLoading(true);
        setError('');

        try {
            const res = await api("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({ email, username, password }),
                credentials: "include"
            });

            if (res.error) setError(res.error);
            return res;

        } catch (e) {
            setError("Register failed");
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

            if (res.accessToken) {
                saveToken(res.accessToken);
            }

            // alert(res.message);

            // setUser(res.message || null);
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
        clearUser();

        await api("/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });
        clearToken();
    };


    return {
        user,
        loading,
        error,
        login,
        register,
        logout
    };
}
