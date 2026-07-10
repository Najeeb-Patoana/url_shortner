import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext.jsx';
import Spinner from '../components/common/Spinner.jsx';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const Register = () => {
  const { register: registerUser } = useAuthContext();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password });
      toast.success('Account created! Welcome to LinkSnip 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Full Name', icon: FiUser, type: 'text', placeholder: 'John Doe', id: 'reg-name' },
    { name: 'email', label: 'Email Address', icon: FiMail, type: 'email', placeholder: 'you@example.com', id: 'reg-email' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-glass p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-1">
          Create your account
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Start shortening links for free today
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {fields.map(({ name, label, icon: Icon, type, placeholder, id }) => (
          <div key={name}>
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {label}
            </label>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register(name)}
                id={id}
                type={type}
                placeholder={placeholder}
                className={`input-field pl-10 ${errors[name] ? 'input-error' : ''}`}
              />
            </div>
            {errors[name] && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <FiAlertCircle className="w-3 h-3" /> {errors[name].message}
              </p>
            )}
          </div>
        ))}

        {/* Password */}
        <div>
          <label htmlFor="reg-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              {...register('password')}
              id="reg-password"
              type={showPw ? 'text' : 'password'}
              placeholder="Min 8 chars, upper, lower, number"
              className={`input-field pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {showPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <FiAlertCircle className="w-3 h-3" /> {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="reg-confirm-pw" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              {...register('confirmPassword')}
              id="reg-confirm-pw"
              type={showPw ? 'text' : 'password'}
              placeholder="Repeat your password"
              className={`input-field pl-10 ${errors.confirmPassword ? 'input-error' : ''}`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <FiAlertCircle className="w-3 h-3" /> {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button type="submit" disabled={isLoading} id="register-submit" className="btn-primary w-full text-base py-3 mt-2">
          {isLoading && <Spinner size="sm" />}
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
};

export default Register;
