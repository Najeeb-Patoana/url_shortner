import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analytics.api.js';

export const useUrlAnalytics = (urlId) => {
  return useQuery({
    queryKey: ['analytics', 'url', urlId],
    queryFn: () => analyticsApi.getUrlAnalytics(urlId).then((r) => r.data.data),
    enabled: !!urlId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useDashboardAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => analyticsApi.getDashboard().then((r) => r.data.data),
    staleTime: 1000 * 60 * 5,
  });
};

export const useExportAnalytics = (urlId) => {
  return useQuery({
    queryKey: ['analytics', 'export', urlId],
    queryFn: () => analyticsApi.exportAnalytics(urlId).then((r) => r.data.data),
    enabled: false, // Only fetch when manually triggered
  });
};
