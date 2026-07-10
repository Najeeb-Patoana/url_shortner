import { motion } from 'framer-motion';

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
  xl: 'w-16 h-16 border-4',
};

const Spinner = ({ size = 'md', className = '' }) => {
  return (
    <motion.div
      className={`${sizeMap[size]} rounded-full border-primary-200 dark:border-primary-900 border-t-primary-600 animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;
