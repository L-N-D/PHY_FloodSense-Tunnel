'use client';
import { useState } from "react";
import api from "../lib/api.js";

export function useLogs() {
  const [data, setData] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getLogs = async (sensorName) => {
    if (!sensorName) return null;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await api(`/api/logs/${sensorName}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        setError('Get data fail');
        return null;
      }

      setData(res.payload ?? []);
      setSuccess(true);
      return res.logs ?? [];
    } catch (e) {
      setError('Fetch data fail');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, success, getLogs };
}
