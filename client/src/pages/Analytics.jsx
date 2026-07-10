import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiDownload, FiBarChart2, FiGlobe, FiMonitor, FiLink } from 'react-icons/fi';
import { useUrlAnalytics } from '../hooks/useAnalytics.js';
import { useUrl } from '../hooks/useUrls.js';
import { ClicksLineChart, TopItemsBarChart, DoughnutChart } from '../components/analytics/Charts.jsx';
import StatCard from '../components/analytics/StatCard.jsx';
import { CardSkeleton } from '../components/common/LoadingSkeleton.jsx';
import { formatNumber, formatDate } from '../utils/formatDate.js';
import { exportToCsv } from '../utils/exportCsv.js';
import { analyticsApi } from '../api/analytics.api.js';
import toast from 'react-hot-toast';

const Analytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: urlData, isLoading: urlLoading } = useUrl(id);
  const { data, isLoading } = useUrlAnalytics(id);

  const url = urlData;
  const analytics = data?.analytics;

  const handleExport = async () => {
    try {
      const res = await analyticsApi.exportAnalytics(id);
      exportToCsv(res.data.data, `analytics-${url?.shortCode || id}`);
      toast.success('Analytics exported as CSV');
    } catch {
      toast.error('Export failed');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="btn-ghost p-2">
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="section-title">Analytics</h1>
          {url && (
            <a
              href={url.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-500 hover:underline font-mono truncate block"
            >
              {url.shortUrl}
            </a>
          )}
        </div>
        <button onClick={handleExport} className="btn-secondary gap-2">
          <FiDownload className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {isLoading || urlLoading ? (
        <CardSkeleton count={4} />
      ) : (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Clicks" value={formatNumber(url?.clicks || 0)} icon={FiBarChart2} color="primary" />
            <StatCard title="Unique Clicks" value={formatNumber(url?.uniqueClicks || 0)} icon={FiLink} color="purple" />
            <StatCard title="Created" value={formatDate(url?.createdAt)} icon={FiGlobe} color="emerald" />
            <StatCard
              title="Last Click"
              value={url?.lastClickedAt ? formatDate(url.lastClickedAt) : 'Never'}
              icon={FiMonitor}
              color="cyan"
            />
          </div>

          {/* Daily Clicks Chart */}
          <div className="card-glass p-6">
            <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <FiBarChart2 className="w-4 h-4 text-primary-500" />
              Daily Clicks (Last 30 Days)
            </h2>
            {analytics?.dailyClicks?.length > 0 ? (
              <ClicksLineChart data={analytics.dailyClicks} />
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                No click data yet
              </div>
            )}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Countries */}
            <div className="card-glass p-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <FiGlobe className="w-4 h-4 text-primary-500" />
                Top Countries
              </h3>
              {analytics?.topCountries?.length > 0 ? (
                <TopItemsBarChart data={analytics.topCountries} label="Clicks" />
              ) : (
                <p className="text-slate-400 text-sm">No data</p>
              )}
            </div>

            {/* Top Browsers */}
            <div className="card-glass p-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <FiMonitor className="w-4 h-4 text-primary-500" />
                Top Browsers
              </h3>
              {analytics?.topBrowsers?.length > 0 ? (
                <DoughnutChart data={analytics.topBrowsers} />
              ) : (
                <p className="text-slate-400 text-sm">No data</p>
              )}
            </div>

            {/* Devices */}
            <div className="card-glass p-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <FiMonitor className="w-4 h-4 text-primary-500" />
                Device Types
              </h3>
              {analytics?.topDevices?.length > 0 ? (
                <DoughnutChart data={analytics.topDevices} />
              ) : (
                <p className="text-slate-400 text-sm">No data</p>
              )}
            </div>
          </div>

          {/* Top Referrers */}
          <div className="card-glass p-6">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Top Referrers</h3>
            {analytics?.topReferrers?.length > 0 ? (
              <TopItemsBarChart data={analytics.topReferrers} label="Clicks" />
            ) : (
              <p className="text-slate-400 text-sm">No referrer data</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
