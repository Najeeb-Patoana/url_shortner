import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiSave, FiAlertCircle } from 'react-icons/fi';
import { useAuth, useUpdateProfile, useChangePassword } from '../hooks/useAuth.js';
import Spinner from '../components/common/Spinner.jsx';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include uppercase')
    .regex(/[a-z]/, 'Must include lowercase')
    .regex(/[0-9]/, 'Must include a number'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const Profile = () => {
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const [pwSuccess, setPwSuccess] = useState(false);

  const { register: regProfile, handleSubmit: submitProfile, formState: { errors: profileErrors } } =
    useForm({ resolver: zodResolver(profileSchema), defaultValues: { name: user?.name || '' } });

  const { register: regPw, handleSubmit: submitPw, reset: resetPw, formState: { errors: pwErrors } } =
    useForm({ resolver: zodResolver(passwordSchema) });

  const onProfileSubmit = async (data) => {
    await updateProfile.mutateAsync(data);
  };

  const onPasswordSubmit = async (data) => {
    await changePassword.mutateAsync(data);
    resetPw();
    setPwSuccess(true);
    setTimeout(() => setPwSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="section-title">Profile Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage your account information
        </p>
      </div>

      {/* Profile Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-glass p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">{user?.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
            <span className={`badge mt-1 ${user?.role === 'admin' ? 'badge-primary' : 'badge-info'}`}>
              {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={submitProfile(onProfileSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...regProfile('name')}
                type="text"
                className={`input-field pl-10 ${profileErrors.name ? 'input-error' : ''}`}
                id="profile-name"
              />
            </div>
            {profileErrors.name && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <FiAlertCircle className="w-3 h-3" /> {profileErrors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input-field pl-10 opacity-60 cursor-not-allowed"
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">Email cannot be changed</p>
          </div>

          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="btn-primary"
            id="save-profile-btn"
          >
            {updateProfile.isPending && <Spinner size="sm" />}
            <FiSave className="w-4 h-4" />
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-glass p-6"
      >
        <h2 className="font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
          <FiLock className="w-4 h-4 text-primary-500" />
          Change Password
        </h2>

        <form onSubmit={submitPw(onPasswordSubmit)} className="space-y-4">
          {[
            { name: 'currentPassword', label: 'Current Password', id: 'current-pw' },
            { name: 'newPassword', label: 'New Password', id: 'new-pw' },
            { name: 'confirmPassword', label: 'Confirm New Password', id: 'confirm-new-pw' },
          ].map(({ name, label, id }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {label}
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...regPw(name)}
                  id={id}
                  type="password"
                  placeholder="••••••••"
                  className={`input-field pl-10 ${pwErrors[name] ? 'input-error' : ''}`}
                />
              </div>
              {pwErrors[name] && (
                <p className="mt-1 text-xs text-red-500">{pwErrors[name].message}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={changePassword.isPending}
            className="btn-primary"
            id="change-password-btn"
          >
            {changePassword.isPending && <Spinner size="sm" />}
            {changePassword.isPending ? 'Updating...' : 'Update Password'}
          </button>

          {pwSuccess && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-emerald-600 dark:text-emerald-400"
            >
              ✓ Password updated successfully
            </motion.p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
