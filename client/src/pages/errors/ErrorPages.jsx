import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLink, FiArrowLeft, FiHome } from 'react-icons/fi';

const NotFound = () => (
  <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-md"
    >
      <div className="text-8xl font-display font-bold gradient-text mb-4">404</div>
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
        Link Not Found
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        The short link you're looking for doesn't exist or may have been deleted.
      </p>
      <div className="flex gap-3 justify-center">
        <Link to="/" className="btn-primary gap-2">
          <FiHome className="w-4 h-4" /> Go Home
        </Link>
      </div>
    </motion.div>
  </div>
);

export const ExpiredLink = () => (
  <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-md"
    >
      <div className="w-20 h-20 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-6">
        <FiLink className="w-10 h-10 text-amber-500" />
      </div>
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
        Link Expired
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        This short link has passed its expiration date and is no longer accessible.
      </p>
      <Link to="/" className="btn-primary gap-2">
        <FiHome className="w-4 h-4" /> Create a New Link
      </Link>
    </motion.div>
  </div>
);

export const DisabledLink = () => (
  <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-md"
    >
      <div className="w-20 h-20 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
        <FiLink className="w-10 h-10 text-red-500" />
      </div>
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
        Link Disabled
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        This short link has been disabled by its owner and is currently unavailable.
      </p>
      <Link to="/" className="btn-primary gap-2">
        <FiHome className="w-4 h-4" /> Go to LinkSnip
      </Link>
    </motion.div>
  </div>
);

export default NotFound;
