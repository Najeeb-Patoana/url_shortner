import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers, FiLink, FiBarChart2, FiToggleRight, FiToggleLeft,
  FiTrash2, FiSearch, FiGlobe, FiCheckCircle, FiXCircle, FiClock,
} from 'react-icons/fi';
import { useAdminStats, useAdminUrls, useAdminDeleteUrl, useAdminToggleStatus } from '../../hooks/useAdmin.js';
import { useAdminUsers } from '../../hooks/useAdmin.js';
import StatCard from '../../components/analytics/StatCard.jsx';
import { ClicksLineChart } from '../../components/analytics/Charts.jsx';
import { CardSkeleton, TableSkeleton } from '../../components/common/LoadingSkeleton.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import { formatNumber, formatDate, formatRelativeDate } from '../../utils/formatDate.js';
import { truncateUrl } from '../../utils/truncateUrl.js';
import { useDashboardAnalytics } from '../../hooks/useAnalytics.js';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [urlPage, setUrlPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [urlSearch, setUrlSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: analyticsData } = useDashboardAnalytics();
  const { data: urlsData, isLoading: urlsLoading } = useAdminUrls({ page: urlPage, limit: 10, search: urlSearch });
  const { data: usersData, isLoading: usersLoading } = useAdminUsers({ page: userPage, limit: 10, search: userSearch });
  const deleteUrl = useAdminDeleteUrl();
  const toggleStatus = useAdminToggleStatus();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart2 },
    { id: 'urls', label: 'All URLs', icon: FiLink },
    { id: 'users', label: 'Users', icon: FiUsers },
  ];

  const statCards = [
    { title: 'Total Users', value: formatNumber(stats?.totalUsers || 0), icon: FiUsers, color: 'primary' },
    { title: 'Total URLs', value: formatNumber(stats?.totalUrls || 0), icon: FiLink, color: 'purple' },
    { title: 'Active Links', value: formatNumber(stats?.activeUrls || 0), icon: FiCheckCircle, color: 'emerald' },
    { title: 'Disabled Links', value: formatNumber(stats?.disabledUrls || 0), icon: FiXCircle, color: 'red' },
    { title: 'Expired Links', value: formatNumber(stats?.expiredUrls || 0), icon: FiClock, color: 'amber' },
    { title: 'Total Clicks', value: formatNumber(stats?.totalClicks || 0), icon: FiBarChart2, color: 'cyan' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Platform-wide analytics and management
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-dark-800 rounded-xl w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === id
                ? 'bg-white dark:bg-dark-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            id={`admin-tab-${id}`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          {statsLoading ? (
            <CardSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {statCards.map((card) => (
                <StatCard key={card.title} {...card} />
              ))}
            </div>
          )}

          {/* Global Clicks Chart */}
          <div className="card-glass p-6">
            <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">
              Global Daily Clicks (Last 30 Days)
            </h2>
            {analyticsData?.globalDailyClicks?.length > 0 ? (
              <ClicksLineChart data={analyticsData.globalDailyClicks} />
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                No click data available
              </div>
            )}
          </div>

          {/* Top URLs */}
          {stats?.topUrls?.length > 0 && (
            <div className="card-glass overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-dark-700">
                <h2 className="font-semibold text-slate-800 dark:text-slate-200">Most Visited Links</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-dark-800/50">
                    <tr>
                      <th className="table-header text-left">URL</th>
                      <th className="table-header text-left">Short Code</th>
                      <th className="table-header text-right">Clicks</th>
                      <th className="table-header text-left">Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topUrls.map((url) => (
                      <tr key={url._id} className="table-row">
                        <td className="table-cell">
                          <span className="truncate-url block">{truncateUrl(url.originalUrl)}</span>
                        </td>
                        <td className="table-cell font-mono text-primary-600 dark:text-primary-400">
                          {url.shortCode}
                        </td>
                        <td className="table-cell text-right font-semibold">
                          {formatNumber(url.clicks)}
                        </td>
                        <td className="table-cell text-slate-500 dark:text-slate-400">
                          {url.owner?.name || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* URLs Tab */}
      {activeTab === 'urls' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              value={urlSearch}
              onChange={(e) => { setUrlSearch(e.target.value); setUrlPage(1); }}
              placeholder="Search URLs..."
              className="input-field pl-10"
              id="admin-url-search"
            />
          </div>

          <div className="card-glass overflow-hidden">
            {urlsLoading ? (
              <TableSkeleton rows={8} cols={6} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-dark-800/50">
                    <tr>
                      <th className="table-header text-left">URL</th>
                      <th className="table-header text-left">Short Code</th>
                      <th className="table-header text-left">Owner</th>
                      <th className="table-header text-right">Clicks</th>
                      <th className="table-header text-left">Status</th>
                      <th className="table-header text-left">Created</th>
                      <th className="table-header text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {urlsData?.urls?.map((url) => (
                      <tr key={url._id} className="table-row">
                        <td className="table-cell">
                          <span className="truncate-url block">{truncateUrl(url.originalUrl, 40)}</span>
                        </td>
                        <td className="table-cell font-mono text-primary-600 dark:text-primary-400 text-xs">
                          {url.customAlias || url.shortCode}
                        </td>
                        <td className="table-cell text-xs">{url.owner?.email || '—'}</td>
                        <td className="table-cell text-right font-semibold">{formatNumber(url.clicks)}</td>
                        <td className="table-cell">
                          {url.isActive ? (
                            <span className="badge-success">Active</span>
                          ) : (
                            <span className="badge-danger">Disabled</span>
                          )}
                        </td>
                        <td className="table-cell text-xs text-slate-400">{formatDate(url.createdAt)}</td>
                        <td className="table-cell">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => toggleStatus.mutate({ id: url._id, isActive: !url.isActive })}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                              title={url.isActive ? 'Disable' : 'Enable'}
                            >
                              {url.isActive ? <FiToggleLeft className="w-4 h-4" /> : <FiToggleRight className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => deleteUrl.mutate(url._id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <Pagination currentPage={urlPage} totalPages={urlsData?.totalPages || 1} onPageChange={setUrlPage} />
        </motion.div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              value={userSearch}
              onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
              placeholder="Search users..."
              className="input-field pl-10"
              id="admin-user-search"
            />
          </div>

          <div className="card-glass overflow-hidden">
            {usersLoading ? (
              <TableSkeleton rows={8} cols={5} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-dark-800/50">
                    <tr>
                      <th className="table-header text-left">Name</th>
                      <th className="table-header text-left">Email</th>
                      <th className="table-header text-left">Role</th>
                      <th className="table-header text-left">Joined</th>
                      <th className="table-header text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData?.users?.map((user) => (
                      <tr key={user._id} className="table-row">
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-800 dark:text-slate-200">{user.name}</span>
                          </div>
                        </td>
                        <td className="table-cell text-slate-500">{user.email}</td>
                        <td className="table-cell">
                          <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-info'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="table-cell text-xs text-slate-400">{formatDate(user.createdAt)}</td>
                        <td className="table-cell">
                          {user.isActive !== false ? (
                            <span className="badge-success">Active</span>
                          ) : (
                            <span className="badge-danger">Inactive</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <Pagination currentPage={userPage} totalPages={usersData?.totalPages || 1} onPageChange={setUserPage} />
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;
