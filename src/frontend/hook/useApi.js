'use client';
import { useEffect, useState } from "react";
import api from "@/lib/api";

export function useAPI() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getWarning = async () => {

        setError('');
        setLoading(true);

        try{
            const res = await api('/api/warning/countTotal', {
                method: 'GET',
                credentials: 'include'
            });

            if (!res.ok){
                setError('Process fetch fail');
                return 0;
            }

            setError('');
            return res;
        }catch (e) {
            setError(`Register failed: ${res.payload.message}`);
            return null;

        } finally {
            setLoading(false);
        }

    };

    const getNotification = async () => {

        setError('');
        setLoading(true);

        try{
            const res = await api('/api/warning/notification', {
                method: 'GET',
                credentials: 'include'
            });

            if (!res.ok){
                setError('Process fetch fail');
                return 0;
            }

            setError('');
            return res;
        }catch (e) {
            setError(`Register failed: ${res.payload.message}`);
            return null;

        } finally {
            setLoading(false);
        }

    };

    const getSystemLogs = async () => {

        setError('');
        setLoading(true);

        try{

            const res = await api('/api/system/systemLogs', {
                method: 'GET',
                credentials: 'include'
            });

            if (!res.ok){
                setError('Proccessing fetch fail');
                return [];
            }

            setError('');
            return res.payload;

        }catch (e) {
            setError(`Register failed: ${res.payload.message}`);
            return null;

        } finally {
            setLoading(false);
        }

    }

    return {
        loading,
        error,
        getWarning,
        getNotification,
        getSystemLogs
    }

}