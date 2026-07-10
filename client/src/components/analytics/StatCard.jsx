import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color = 'primary', change, description }) => {
  const colorMap = {
    primary: 'from-primary-500 to-primary-600',
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
    red: 'from-red-500 to-red-600',
    blue: 'from-blue-500 to-blue-600',
    cyan: 'from-cyan-500 to-cyan-600',
  };

  const bgMap = {
    primary: 'bg-primary-50 dark:bg-primary-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20',
    pink: 'bg-pink-50 dark:bg-pink-900/20',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20',
    amber: 'bg-amber-50 dark:bg-amber-900/20',
    red: 'bg-red-50 dark:bg-red-900/20',
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="stat-card"
    >
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl ${bgMap[color]} flex items-center justify-center`}>
          <div className={`w-6 h-6 bg-gradient-to-br ${colorMap[color]} rounded-lg flex items-center justify-center`}>
            <Icon className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        {change !== undefined && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              change >= 0
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            }`}
          >
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{title}</p>
        {description && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{description}</p>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
