import { Link } from 'react-router-dom';
import { FiGithub, FiLink } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="border-t border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-brand-600 flex items-center justify-center">
              <FiLink className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
              LinkSnip
            </span>
          </div>

          {/* Credit */}
          <p className="text-xs text-surface-500 dark:text-surface-400 text-center">
            Built by{' '}
            <a
              href="https://github.com/Najeeb-Patoana/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 dark:text-brand-400 hover:underline font-medium"
            >
              Najeeb Patoana
            </a>
            {' '}· © {new Date().getFullYear()}
          </p>

          {/* Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Najeeb-Patoana/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-surface-500 hover:text-surface-800 dark:hover:text-surface-200 transition-colors"
              aria-label="GitHub profile"
            >
              <FiGithub className="w-3.5 h-3.5" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
