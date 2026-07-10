import { Link } from 'react-router-dom';
import { FiLink, FiGithub, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-dark-800 bg-white/50 dark:bg-dark-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-primary flex items-center justify-center">
              <FiLink className="w-3 h-3 text-white" />
            </div>
            <span className="font-display font-bold gradient-text">LinkSnip</span>
          </Link>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} LinkSnip. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="GitHub"
            >
              <FiGithub className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
