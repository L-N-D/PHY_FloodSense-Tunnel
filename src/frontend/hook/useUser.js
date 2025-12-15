'use client';
import { useState } from "react";
import api from "../lib/api.js";
import { useAuthContext } from "@/lib/context/authContext.js";

export function useUser() {

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const changePassword = async (password) => {

        setLoading(true);
        setError('');

        try {
            const res = await api('/api/user/resetPassword', {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    password: password,
                }),
            });

            if (!res.ok) {
                setError(res.payload.message);
                return null;
            }

            setError('');
            setSuccess(true);
            return res;

        } catch (e) {
            setError('Change password Fail');
            return null;

        } finally {
            setLoading(false);
        }

    }

    return {
        loading,
        error,
        success,
        changePassword
    };

}