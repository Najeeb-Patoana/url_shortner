import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus, FiSearch, FiLink, FiFilter, FiTrash2,
  FiToggleLeft, FiToggleRight, FiRefreshCw, FiStar,
} from 'react-icons/fi';
import { useUrls, useBulkDelete, useBulkUpdateStatus } from '../hooks/useUrls.js';
import { useUserStats } from '../hooks/useAuth.js';
import UrlCard from '../components/url/UrlCard.jsx';
import CreateUrlModal from '../components/url/CreateUrlModal.jsx';
import EditUrlModal from '../components/url/EditUrlModal.jsx';
import DeleteConfirmModal from '../components/url/DeleteConfirmModal.jsx';
import QrCodeModal from '../components/url/QrCodeModal.jsx';
import StatCard from '../components/analytics/StatCard.jsx';
import Pagination from '../components/common/Pagination.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { CardSkeleton, TableSkeleton } from '../components/common/LoadingSkeleton.jsx';
import { formatNumber } from '../utils/formatDate.js';
import { useNavigate } from 'react-router-dom';
import { FiBarChart2, FiGlobe, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: '-clicks', label: 'Most Clicks' },
  { value: 'clicks', label: 'Least Clicks' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [filter, setFilter] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editUrl, setEditUrl] = useState(null);
  const [deleteUrl, setDeleteUrl] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);

  const { data, isLoading, refetch } = useUrls({ page, limit, search, sort, ...filter });
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const bulkDelete = useBulkDelete();
  const bulkStatus = useBulkUpdateStatus();

  const urls = data?.urls || [];
  const totalPages = data?.totalPages || 1;

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === urls.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(urls.map((u) => u._id));
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const statCards = [
    { title: 'Total Links', value: formatNumber(stats?.totalUrls || 0), icon: FiLink, color: 'primary' },
    { title: 'Active Links', value: formatNumber(stats?.activeUrls || 0), icon: FiCheckCircle, color: 'emerald' },
    { title: 'Disabled Links', value: formatNumber(stats?.disabledUrls || 0), icon: FiXCircle, color: 'red' },
    { title: 'Expired Links', value: formatNumber(stats?.expiredUrls || 0), icon: FiBarChart2, color: 'amber' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title">My Links</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage and track all your shortened URLs
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="btn-primary"
          id="create-link-btn"
        >
          <FiPlus className="w-4 h-4" />
          Shorten URL
        </button>
      </div>

      {/* ─── Stats Cards ─────────────────────────────────────────── */}
      {statsLoading ? (
        <CardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>
      )}

      {/* ─── Filters Bar ─────────────────────────────────────────── */}
      <div className="card-glass p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={handleSearch}
            placeholder="Search by URL, alias, title..."
            className="input-field pl-10"
            id="url-search"
          />
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input-field w-full sm:w-44"
          id="url-sort"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          onChange={(e) => {
            const v = e.target.value;
            setFilter(v === '' ? {} : { isActive: v === 'active' });
            setPage(1);
          }}
          className="input-field w-full sm:w-36"
          id="url-filter"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Disabled</option>
        </select>

        <button onClick={() => refetch()} className="btn-ghost px-3" aria-label="Refresh">
          <FiRefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* ─── Bulk Actions Bar ─────────────────────────────────────── */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="card-glass p-3 flex items-center gap-3 border-l-4 border-primary-500"
          >
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {selectedIds.length} selected
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => bulkStatus.mutate({ ids: selectedIds, isActive: true })}
                className="btn-ghost text-xs px-3 py-1.5 text-emerald-600"
              >
                <FiToggleRight className="w-3.5 h-3.5" /> Enable
              </button>
              <button
                onClick={() => bulkStatus.mutate({ ids: selectedIds, isActive: false })}
                className="btn-ghost text-xs px-3 py-1.5 text-amber-600"
              >
                <FiToggleLeft className="w-3.5 h-3.5" /> Disable
              </button>
              <button
                onClick={() => { bulkDelete.mutate(selectedIds); setSelectedIds([]); }}
                className="btn-ghost text-xs px-3 py-1.5 text-red-600"
              >
                <FiTrash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── URL Grid ─────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card-glass p-5 space-y-3">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : urls.length === 0 ? (
        <EmptyState
          icon={FiLink}
          title="No links yet"
          description="Create your first short link to get started."
          action={
            <button onClick={() => setCreateOpen(true)} className="btn-primary">
              <FiPlus className="w-4 h-4" /> Create Link
            </button>
          }
        />
      ) : (
        <>
          {/* Select all checkbox */}
          <div className="flex items-center gap-2 px-1">
            <input
              type="checkbox"
              checked={selectedIds.length === urls.length && urls.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded accent-primary-600"
              id="select-all-urls"
              aria-label="Select all"
            />
            <label htmlFor="select-all-urls" className="text-xs text-slate-500 dark:text-slate-400">
              Select all
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AnimatePresence>
              {urls.map((url) => (
                <UrlCard
                  key={url._id}
                  url={url}
                  selected={selectedIds.includes(url._id)}
                  onSelect={handleSelect}
                  onEdit={(u) => setEditUrl(u)}
                  onDelete={(u) => setDeleteUrl(u)}
                  onAnalytics={(u) => navigate(`/analytics/${u._id}`)}
                  onQrCode={(u) => setQrUrl(u)}
                />
              ))}
            </AnimatePresence>
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* ─── Modals ──────────────────────────────────────────────── */}
      <CreateUrlModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
      <EditUrlModal isOpen={!!editUrl} onClose={() => setEditUrl(null)} url={editUrl} />
      <DeleteConfirmModal isOpen={!!deleteUrl} onClose={() => setDeleteUrl(null)} url={deleteUrl} />
      <QrCodeModal isOpen={!!qrUrl} onClose={() => setQrUrl(null)} url={qrUrl} />
    </div>
  );
};

export default Dashboard;
