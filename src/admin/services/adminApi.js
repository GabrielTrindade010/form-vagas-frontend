import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const adminApi = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminAccessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

adminApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/api/admin/auth/login')
        ) {
            originalRequest._retry = true;
            try {
                const res = await axios.post(
                    `${API_BASE_URL}/api/admin/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                const { accessToken } = res.data;
                localStorage.setItem('adminAccessToken', accessToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return adminApi(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('adminAccessToken');
                localStorage.removeItem('adminUser');
                window.location.href = '/admin/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default adminApi;

