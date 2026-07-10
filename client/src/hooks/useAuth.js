import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '../context/AuthContext.jsx';
import { userApi } from '../api/user.api.js';
import toast from 'react-hot-toast';

export const useAuth = () => {
  return useAuthContext();
};

export const useUserStats = () => {
  const { isAuthenticated } = useAuthContext();
  return useQuery({
    queryKey: ['user', 'stats'],
    queryFn: () => userApi.getStats().then((r) => r.data.data),
    enabled: isAuthenticated,
  });
};

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  const { updateUser } = useAuthContext();
  return useMutation({
    mutationFn: (data) => userApi.updateProfile(data).then((r) => r.data.data),
    onSuccess: (user) => {
      qc.invalidateQueries({ queryKey: ['user'] });
      updateUser(user);
      toast.success('Profile updated successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data) => userApi.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to change password');
    },
  });
};
