import { motion } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';
import { useDeleteUrl } from '../../hooks/useUrls.js';
import Modal from '../common/Modal.jsx';
import Spinner from '../common/Spinner.jsx';

const DeleteConfirmModal = ({ isOpen, onClose, url }) => {
  const deleteUrl = useDeleteUrl();

  const handleDelete = async () => {
    await deleteUrl.mutateAsync(url._id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete URL" size="sm">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
          <FiAlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <p className="text-slate-600 dark:text-slate-400 mb-1">
          Are you sure you want to delete this URL?
        </p>
        <p className="text-sm text-slate-400 dark:text-slate-500 font-mono truncate mb-6">
          {url?.shortUrl}
        </p>
        <p className="text-xs text-red-500 mb-6">This action cannot be undone.</p>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteUrl.isPending}
            className="btn-danger flex-1"
            id="confirm-delete-btn"
          >
            {deleteUrl.isPending && <Spinner size="sm" />}
            {deleteUrl.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
