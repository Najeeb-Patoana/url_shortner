import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiLink, FiAlertCircle, FiCalendar, FiTag } from 'react-icons/fi';
import { useCreateUrl } from '../../hooks/useUrls.js';
import Modal from '../common/Modal.jsx';
import Spinner from '../common/Spinner.jsx';

const schema = z.object({
  originalUrl: z
    .string()
    .min(1, 'URL is required')
    .url('Please enter a valid URL (include https://)'),
  customAlias: z
    .string()
    .regex(/^[a-zA-Z0-9-_]*$/, 'Only letters, numbers, hyphens, underscores')
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .optional()
    .or(z.literal('')),
  expiresAt: z.string().optional(),
  title: z.string().max(200).optional(),
});

const CreateUrlModal = ({ isOpen, onClose }) => {
  const createUrl = useCreateUrl();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    const payload = {
      originalUrl: data.originalUrl,
      customAlias: data.customAlias || undefined,
      expiresAt: data.expiresAt || undefined,
      title: data.title || undefined,
    };
    await createUrl.mutateAsync(payload);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Shorten a URL">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Original URL */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Destination URL <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              {...register('originalUrl')}
              type="url"
              placeholder="https://example.com/very-long-url"
              className={`input-field pl-10 ${errors.originalUrl ? 'input-error' : ''}`}
              id="create-url-input"
            />
          </div>
          {errors.originalUrl && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <FiAlertCircle className="w-3 h-3" />
              {errors.originalUrl.message}
            </p>
          )}
        </div>

        {/* Custom Alias */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Custom Alias <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <div className="flex items-center gap-0 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent transition-all">
            <span className="px-3 py-3 bg-slate-50 dark:bg-dark-700 text-slate-500 dark:text-slate-400 text-sm border-r border-slate-200 dark:border-slate-700 whitespace-nowrap">
              {window.location.origin}/
            </span>
            <input
              {...register('customAlias')}
              type="text"
              placeholder="my-link"
              className="flex-1 px-3 py-3 bg-white dark:bg-dark-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
            />
          </div>
          {errors.customAlias && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <FiAlertCircle className="w-3 h-3" />
              {errors.customAlias.message}
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Title <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            {...register('title')}
            type="text"
            placeholder="e.g., Marketing Campaign Link"
            className="input-field"
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Expiration Date <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              {...register('expiresAt')}
              type="datetime-local"
              min={new Date().toISOString().slice(0, 16)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            type="submit"
            disabled={createUrl.isPending}
            className="btn-primary flex-1"
            id="create-url-submit"
          >
            {createUrl.isPending ? <Spinner size="sm" /> : ''}
            {createUrl.isPending ? 'Creating...' : 'Create Short Link'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateUrlModal;
