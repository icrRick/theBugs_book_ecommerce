import axios from 'axios';
import { getToken } from './cookie'; // chỗ bạn lưu token

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để tự động thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken(); // từ cookie.js
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
