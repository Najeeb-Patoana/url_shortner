import { motion } from 'framer-motion';
import { FiLink, FiSearch } from 'react-icons/fi';

const EmptyState = ({
  icon: Icon = FiLink,
  title = 'Nothing here yet',
  description = '',
  action = null,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-5">
        <Icon className="w-10 h-10 text-primary-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>
      )}
      {action}
    </motion.div>
  );
};

export default EmptyState;
