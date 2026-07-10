import axiosInstance from './axios.config.js';

export const analyticsApi = {
  getUrlAnalytics: (id) => axiosInstance.get(`/analytics/urls/${id}/analytics`),
  getDashboard: () => axiosInstance.get('/analytics/dashboard'),
  exportAnalytics: (id) => axiosInstance.get(`/analytics/urls/${id}/analytics/export`),
};
