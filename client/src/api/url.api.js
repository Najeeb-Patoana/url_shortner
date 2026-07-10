import axiosInstance from './axios.config.js';

export const urlApi = {
  create: (data) => axiosInstance.post('/urls', data),
  getAll: (params) => axiosInstance.get('/urls', { params }),
  getById: (id) => axiosInstance.get(`/urls/${id}`),
  update: (id, data) => axiosInstance.put(`/urls/${id}`, data),
  delete: (id) => axiosInstance.delete(`/urls/${id}`),
  toggleStatus: (id, isActive) => axiosInstance.patch(`/urls/${id}/status`, { isActive }),
  toggleFavorite: (id) => axiosInstance.patch(`/urls/${id}/favorite`),
  bulkDelete: (ids) => axiosInstance.post('/urls/bulk/delete', { ids }),
  bulkUpdateStatus: (ids, isActive) => axiosInstance.patch('/urls/bulk/status', { ids, isActive }),
};
