import axiosInstance from './axios.config.js';

export const userApi = {
  getProfile: () => axiosInstance.get('/users/profile'),
  updateProfile: (data) => axiosInstance.put('/users/profile', data),
  changePassword: (data) => axiosInstance.put('/users/profile/password', data),
  getStats: () => axiosInstance.get('/users/stats'),
};
