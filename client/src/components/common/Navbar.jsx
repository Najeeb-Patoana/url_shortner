import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLink, FiMenu, FiX, FiBarChart2, FiGrid } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle.jsx';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/analytics', label: 'Analytics', icon: FiBarChart2, disabled: true },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md bg-brand-600 flex items-center justify-center">
            <FiLink className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-surface-900 dark:text-white text-sm tracking-tight">
            LinkSnip
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              location.pathname === '/'
                ? 'bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-white'
                : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-50 dark:hover:bg-surface-800'
            }`}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              location.pathname.startsWith('/dashboard')
                ? 'bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-white'
                : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-50 dark:hover:bg-surface-800'
            }`}
          >
            Dashboard
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/dashboard" className="hidden sm:inline-flex btn-primary py-1.5 px-3 text-xs">
            Shorten URL
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX className="w-4 h-4" /> : <FiMenu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="md:hidden overflow-hidden border-t border-surface-100 dark:border-surface-800"
          >
            <div className="px-4 py-3 space-y-1">
              {[
                { to: '/', label: 'Home' },
                { to: '/dashboard', label: 'Dashboard' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
