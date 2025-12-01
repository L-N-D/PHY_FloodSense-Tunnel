// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1307/api';

// API client functions
export const api = {
    // Sensor APIs
    sensors: {
        getCurrent: async () => {
            const res = await fetch(`${API_URL}/sensors/current`);
            return res.json();
        },
        getHistory: async (type, params = {}) => {
            const query = new URLSearchParams(params).toString();
            const res = await fetch(`${API_URL}/sensors/${type}/history?${query}`);
            return res.json();
        },
        getLatest: async (type) => {
            const res = await fetch(`${API_URL}/sensors/${type}/latest`);
            return res.json();
        },
        getStats: async (type, hours = 24) => {
            const res = await fetch(`${API_URL}/sensors/${type}/stats?hours=${hours}`);
            return res.json();
        },
        add: async (data) => {
            const res = await fetch(`${API_URL}/sensors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.json();
        }
    },

    // Device APIs
    devices: {
        getAll: async () => {
            const res = await fetch(`${API_URL}/devices`);
            return res.json();
        },
        get: async (name) => {
            const res = await fetch(`${API_URL}/devices/${name}`);
            return res.json();
        },
        control: async (name, status) => {
            const res = await fetch(`${API_URL}/devices/${name}/control`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            return res.json();
        },
        initialize: async () => {
            const res = await fetch(`${API_URL}/devices/initialize`, {
                method: 'POST'
            });
            return res.json();
        }
    },

    // Analysis APIs
    analysis: {
        getFloodScore: async () => {
            const res = await fetch(`${API_URL}/analysis/flood-score`);
            return res.json();
        },
        getFireRisk: async () => {
            const res = await fetch(`${API_URL}/analysis/fire-risk`);
            return res.json();
        },
        getRadarData: async () => {
            const res = await fetch(`${API_URL}/analysis/radar-data`);
            return res.json();
        },
        getAINotification: async () => {
            const res = await fetch(`${API_URL}/analysis/ai-notification`);
            return res.json();
        }
    }
};
