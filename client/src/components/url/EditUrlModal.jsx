import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiLink, FiAlertCircle, FiCalendar } from 'react-icons/fi';
import { useUpdateUrl } from '../../hooks/useUrls.js';
import Modal from '../common/Modal.jsx';
import Spinner from '../common/Spinner.jsx';

const schema = z.object({
  originalUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  customAlias: z
    .string()
    .regex(/^[a-zA-Z0-9-_]*$/, 'Only letters, numbers, hyphens, underscores')
    .optional()
    .or(z.literal('')),
  expiresAt: z.string().optional(),
  title: z.string().max(200).optional(),
});

const EditUrlModal = ({ isOpen, onClose, url }) => {
  const updateUrl = useUpdateUrl();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (url) {
      reset({
        originalUrl: url.originalUrl || '',
        customAlias: url.customAlias || '',
        title: url.title || '',
        expiresAt: url.expiresAt ? new Date(url.expiresAt).toISOString().slice(0, 16) : '',
      });
    }
  }, [url, reset]);

  const onSubmit = async (data) => {
    await updateUrl.mutateAsync({
      id: url._id,
      data: {
        originalUrl: data.originalUrl || undefined,
        customAlias: data.customAlias || undefined,
        expiresAt: data.expiresAt || undefined,
        title: data.title || undefined,
      },
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit URL">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Destination URL
          </label>
          <div className="relative">
            <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              {...register('originalUrl')}
              type="url"
              className={`input-field pl-10 ${errors.originalUrl ? 'input-error' : ''}`}
            />
          </div>
          {errors.originalUrl && (
            <p className="mt-1 text-xs text-red-500">{errors.originalUrl.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Custom Alias
          </label>
          <input {...register('customAlias')} type="text" className="input-field" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Title</label>
          <input {...register('title')} type="text" className="input-field" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Expiration Date
          </label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input {...register('expiresAt')} type="datetime-local" className="input-field pl-10" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" disabled={updateUrl.isPending} className="btn-primary flex-1">
            {updateUrl.isPending && <Spinner size="sm" />}
            {updateUrl.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUrlModal;
