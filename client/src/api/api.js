import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://crickgate.onrender.com"
});

// Automatically inject JWT Bearer token into request headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("Token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;