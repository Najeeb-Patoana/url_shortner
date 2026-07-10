import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiEdit2, FiTrash2, FiBarChart2, FiCopy, FiToggleLeft, FiToggleRight,
  FiStar, FiExternalLink, FiMoreVertical, FiGrid,
} from 'react-icons/fi';
import { formatDate, formatNumber } from '../../utils/formatDate.js';
import { truncateUrl } from '../../utils/truncateUrl.js';
import { useToggleStatus, useToggleFavorite } from '../../hooks/useUrls.js';
import { useClipboard } from '../../hooks/useClipboard.js';

const StatusBadge = ({ url }) => {
  if (!url.isActive) return <span className="badge-danger">Disabled</span>;
  if (url.expiresAt && new Date() > new Date(url.expiresAt)) return <span className="badge-warning">Expired</span>;
  return <span className="badge-success">Active</span>;
};

const UrlCard = ({ url, onEdit, onDelete, onAnalytics, onQrCode, selected, onSelect }) => {
  const { copy } = useClipboard();
  const toggleStatus = useToggleStatus();
  const toggleFavorite = useToggleFavorite();
  const [menuOpen, setMenuOpen] = useState(false);

  const shortUrl = url.shortUrl || `${window.location.origin}/${url.customAlias || url.shortCode}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`card-glass p-5 transition-all duration-200 ${
        selected ? 'ring-2 ring-primary-500' : ''
      }`}
    >
      {/* Header Row */}
      <div className="flex items-start gap-3 mb-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(url._id)}
          className="mt-1 w-4 h-4 rounded accent-primary-600"
          aria-label="Select URL"
        />

        {/* Favicon + URL info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <img
              src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(url.originalUrl)}&sz=16`}
              alt=""
              className="w-4 h-4 rounded-sm"
              onError={(e) => (e.target.style.display = 'none')}
            />
            <h3 className="font-medium text-slate-800 dark:text-slate-200 text-sm truncate">
              {url.title || truncateUrl(url.originalUrl, 60)}
            </h3>
            <StatusBadge url={url} />
          </div>

          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 dark:text-primary-400 text-sm font-mono hover:underline flex items-center gap-1 w-fit"
          >
            {shortUrl}
            <FiExternalLink className="w-3 h-3 flex-shrink-0" />
          </a>

          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">
            → {truncateUrl(url.originalUrl, 70)}
          </p>
        </div>

        {/* Favorite + Menu */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => toggleFavorite.mutate(url._id)}
            className={`p-1.5 rounded-lg transition-colors ${
              url.isFavorite
                ? 'text-amber-400 hover:text-amber-500'
                : 'text-slate-300 hover:text-amber-400'
            }`}
            aria-label="Toggle favorite"
          >
            <FiStar className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-700 transition-colors"
              aria-label="More options"
            >
              <FiMoreVertical className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  className="absolute right-0 mt-1 w-44 card-glass shadow-xl z-20 overflow-hidden"
                  onBlur={() => setMenuOpen(false)}
                >
                  {[
                    { icon: FiCopy, label: 'Copy Link', action: () => copy(shortUrl, 'Link') },
                    { icon: FiEdit2, label: 'Edit', action: () => onEdit(url) },
                    { icon: FiBarChart2, label: 'Analytics', action: () => onAnalytics(url) },
                    { icon: FiGrid, label: 'QR Code', action: () => onQrCode(url) },
                    {
                      icon: url.isActive ? FiToggleLeft : FiToggleRight,
                      label: url.isActive ? 'Disable' : 'Enable',
                      action: () => toggleStatus.mutate({ id: url._id, isActive: !url.isActive }),
                    },
                    { icon: FiTrash2, label: 'Delete', action: () => onDelete(url), danger: true },
                  ].map(({ icon: Icon, label, action, danger }) => (
                    <button
                      key={label}
                      onClick={() => { action(); setMenuOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                        danger
                          ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-dark-700">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <FiBarChart2 className="w-3.5 h-3.5" />
            <strong className="text-slate-800 dark:text-slate-200">{formatNumber(url.clicks)}</strong>
            clicks
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {formatDate(url.createdAt)}
          </span>
          {url.expiresAt && (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Expires {formatDate(url.expiresAt)}
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => copy(shortUrl, 'Link')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            aria-label="Copy short link"
          >
            <FiCopy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onAnalytics(url)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            aria-label="View analytics"
          >
            <FiBarChart2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(url)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            aria-label="Delete URL"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UrlCard;
