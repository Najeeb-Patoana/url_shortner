import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext.jsx';

// Register Chart.js components globally
ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  ArcElement, Title, Tooltip, Legend, Filler
);

const PALETTE = [
  '#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f97316',
  '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#a855f7',
];

const baseOptions = (isDark) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: isDark ? '#94a3b8' : '#64748b', font: { family: 'Inter' } },
    },
    tooltip: {
      backgroundColor: isDark ? '#1e293b' : '#fff',
      titleColor: isDark ? '#e2e8f0' : '#1e293b',
      bodyColor: isDark ? '#94a3b8' : '#64748b',
      borderColor: isDark ? '#334155' : '#e2e8f0',
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: { color: isDark ? '#1e293b' : '#f1f5f9' },
      ticks: { color: isDark ? '#64748b' : '#94a3b8', font: { family: 'Inter', size: 11 } },
    },
    y: {
      grid: { color: isDark ? '#1e293b' : '#f1f5f9' },
      ticks: { color: isDark ? '#64748b' : '#94a3b8', font: { family: 'Inter', size: 11 } },
      beginAtZero: true,
    },
  },
});

/**
 * Daily clicks line chart.
 */
export const ClicksLineChart = ({ data = [] }) => {
  const { isDark } = useTheme();
  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: 'Clicks',
        data: data.map((d) => d.clicks),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.12)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6366f1',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };
  return (
    <div className="h-64">
      <Line data={chartData} options={{ ...baseOptions(isDark), plugins: { ...baseOptions(isDark).plugins, legend: { display: false } } }} />
    </div>
  );
};

/**
 * Horizontal bar chart for top items (browsers, countries, referrers).
 */
export const TopItemsBarChart = ({ data = [], label = 'Count', color = '#6366f1' }) => {
  const { isDark } = useTheme();
  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        label,
        data: data.map((d) => d.count),
        backgroundColor: data.map((_, i) => PALETTE[i % PALETTE.length] + 'cc'),
        borderRadius: 6,
      },
    ],
  };
  const opts = {
    ...baseOptions(isDark),
    indexAxis: 'y',
    plugins: { ...baseOptions(isDark).plugins, legend: { display: false } },
  };
  return (
    <div className="h-48">
      <Bar data={chartData} options={opts} />
    </div>
  );
};

/**
 * Doughnut chart for device/browser distribution.
 */
export const DoughnutChart = ({ data = [] }) => {
  const { isDark } = useTheme();
  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: PALETTE.slice(0, data.length),
        borderColor: isDark ? '#0f172a' : '#fff',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };
  const opts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { position: 'right', labels: { color: isDark ? '#94a3b8' : '#64748b', padding: 12, font: { family: 'Inter', size: 11 } } },
      tooltip: baseOptions(isDark).plugins.tooltip,
    },
  };
  return (
    <div className="h-48">
      <Doughnut data={chartData} options={opts} />
    </div>
  );
};
