import axiosInstance from './axios.config.js';

export const authApi = {
  register: (data) => axiosInstance.post('/auth/register', data),
  login: (data) => axiosInstance.post('/auth/login', data),
  logout: () => axiosInstance.post('/auth/logout'),
  refresh: () => axiosInstance.post('/auth/refresh'),
};
