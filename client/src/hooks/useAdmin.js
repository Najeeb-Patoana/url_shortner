import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/admin.api.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminApi.getStats().then((r) => r.data.data),
    staleTime: 1000 * 60 * 2,
  });
};

export const useAdminUsers = (params = {}) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminApi.getAllUsers(params).then((r) => r.data.data),
    keepPreviousData: true,
  });
};

export const useAdminUrls = (params = {}) => {
  return useQuery({
    queryKey: ['admin', 'urls', params],
    queryFn: () => adminApi.getAllUrls(params).then((r) => r.data.data),
    keepPreviousData: true,
  });
};

export const useAdminDeleteUrl = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => adminApi.deleteUrl(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'urls'] });
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] });
      toast.success('URL deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed'),
  });
};

export const useAdminToggleStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }) => adminApi.toggleUrlStatus(id, isActive),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'urls'] });
    },
  });
};
