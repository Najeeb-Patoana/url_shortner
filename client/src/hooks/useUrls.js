import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { urlApi } from '../api/url.api.js';
import toast from 'react-hot-toast';

const URL_KEYS = {
  all: ['urls'],
  list: (params) => ['urls', 'list', params],
  detail: (id) => ['urls', 'detail', id],
};

export const useUrls = (params = {}) => {
  return useQuery({
    queryKey: URL_KEYS.list(params),
    queryFn: () => urlApi.getAll(params).then((r) => r.data.data),
    keepPreviousData: true,
  });
};

export const useUrl = (id) => {
  return useQuery({
    queryKey: URL_KEYS.detail(id),
    queryFn: () => urlApi.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });
};

export const useCreateUrl = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => urlApi.create(data).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: URL_KEYS.all });
      toast.success('URL shortened successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create URL');
    },
  });
};

export const useUpdateUrl = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => urlApi.update(id, data).then((r) => r.data.data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: URL_KEYS.all });
      qc.invalidateQueries({ queryKey: URL_KEYS.detail(id) });
      toast.success('URL updated successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update URL');
    },
  });
};

export const useDeleteUrl = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => urlApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: URL_KEYS.all });
      toast.success('URL deleted');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete URL');
    },
  });
};

export const useToggleStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }) => urlApi.toggleStatus(id, isActive),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: URL_KEYS.all });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update status');
    },
  });
};

export const useToggleFavorite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => urlApi.toggleFavorite(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: URL_KEYS.all });
    },
  });
};

export const useBulkDelete = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids) => urlApi.bulkDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: URL_KEYS.all });
      toast.success('Selected URLs deleted');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Bulk delete failed');
    },
  });
};

export const useBulkUpdateStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, isActive }) => urlApi.bulkUpdateStatus(ids, isActive),
    onSuccess: (_, { isActive }) => {
      qc.invalidateQueries({ queryKey: URL_KEYS.all });
      toast.success(`Selected URLs ${isActive ? 'enabled' : 'disabled'}`);
    },
  });
};
