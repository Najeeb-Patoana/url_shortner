import { motion } from 'framer-motion';
import { FiDownload, FiExternalLink } from 'react-icons/fi';
import Modal from '../common/Modal.jsx';
import CopyButton from '../common/CopyButton.jsx';

const QrCodeModal = ({ isOpen, onClose, url }) => {
  const handleDownload = () => {
    if (!url?.qrCode) return;
    const link = document.createElement('a');
    link.href = url.qrCode;
    link.download = `qr-${url.shortCode || 'link'}.png`;
    link.click();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="QR Code" size="sm">
      <div className="text-center space-y-5">
        {url?.qrCode ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block p-4 bg-white rounded-2xl shadow-lg"
          >
            <img
              src={url.qrCode}
              alt="QR Code"
              className="w-48 h-48 mx-auto"
            />
          </motion.div>
        ) : (
          <div className="w-48 h-48 mx-auto bg-slate-100 dark:bg-dark-700 rounded-2xl flex items-center justify-center">
            <p className="text-slate-400 text-sm">No QR Code</p>
          </div>
        )}

        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Short URL</p>
          <p className="font-mono text-sm text-primary-600 dark:text-primary-400 font-medium">
            {url?.shortUrl}
          </p>
        </div>

        <div className="flex gap-3">
          <CopyButton text={url?.shortUrl || ''} label="Short URL" className="flex-1 justify-center" />
          <button
            onClick={handleDownload}
            disabled={!url?.qrCode}
            className="btn-primary flex-1"
            id="qr-download-btn"
          >
            <FiDownload className="w-4 h-4" />
            Download PNG
          </button>
        </div>

        <a
          href={url?.shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-primary-500 transition-colors"
        >
          <FiExternalLink className="w-3 h-3" />
          Open link
        </a>
      </div>
    </Modal>
  );
};

export default QrCodeModal;
