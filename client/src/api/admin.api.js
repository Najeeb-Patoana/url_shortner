import axiosInstance from './axios.config.js';

export const adminApi = {
  getStats: () => axiosInstance.get('/admin/stats'),
  getAllUsers: (params) => axiosInstance.get('/admin/users', { params }),
  getAllUrls: (params) => axiosInstance.get('/admin/urls', { params }),
  deleteUrl: (id) => axiosInstance.delete(`/admin/urls/${id}`),
  toggleUrlStatus: (id, isActive) => axiosInstance.patch(`/admin/urls/${id}/status`, { isActive }),
};
