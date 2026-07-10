import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { useClipboard } from '../../hooks/useClipboard.js';

const CopyButton = ({ text, label = 'Link', className = '' }) => {
  const { copy } = useClipboard();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copy(text, label);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleCopy}
      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        copied
          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
          : 'bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-dark-600'
      } ${className}`}
      title={`Copy ${label}`}
      aria-label={`Copy ${label} to clipboard`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={copied ? 'check' : 'copy'}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {copied ? (
            <FiCheck className="w-3.5 h-3.5" />
          ) : (
            <FiCopy className="w-3.5 h-3.5" />
          )}
        </motion.span>
      </AnimatePresence>
      {copied ? 'Copied!' : 'Copy'}
    </motion.button>
  );
};

export default CopyButton;
