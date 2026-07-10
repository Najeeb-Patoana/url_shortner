import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiLink, FiBarChart2, FiShield, FiZap, FiCopy,
  FiArrowRight, FiStar, FiGlobe,
} from 'react-icons/fi';
import { useAuthContext } from '../context/AuthContext.jsx';

const features = [
  { icon: FiZap, title: 'Lightning Fast', desc: 'Sub-millisecond redirects with optimized MongoDB indexing.' },
  { icon: FiBarChart2, title: 'Deep Analytics', desc: 'Track clicks, devices, countries, referrers, and more in real-time.' },
  { icon: FiShield, title: 'Secure & Private', desc: 'JWT auth, rate limiting, Helmet security headers, and IP anonymization.' },
  { icon: FiStar, title: 'Custom Aliases', desc: 'Create branded short links like domain.com/launch-2024.' },
  { icon: FiCopy, title: 'QR Codes', desc: 'Auto-generate QR codes for every short link, downloadable as PNG.' },
  { icon: FiGlobe, title: 'Geo Tracking', desc: 'See exactly where your audience is clicking from around the world.' },
];

const Landing = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <div className="overflow-hidden">
      {/* ─── Hero Section ─────────────────────────────────────── */}
      <section className="relative py-24 px-4 text-center">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-200 dark:bg-primary-900/30 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent-200 dark:bg-accent-900/30 blur-3xl"
          />
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-medium mb-8"
          >
            <FiZap className="w-3.5 h-3.5" />
            Production-Ready URL Shortener
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold text-slate-900 dark:text-white mb-6 leading-tight"
          >
            Shorten Links.
            <br />
            <span className="gradient-text">Track Everything.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Create powerful short links with custom aliases, detailed analytics,
            QR codes, and team dashboards. Built for speed and scale.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary text-base px-8 py-4 gap-2">
                Go to Dashboard
                <FiArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-base px-8 py-4 gap-2" id="hero-cta">
                  Start for Free
                  <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className="btn-secondary text-base px-8 py-4">
                  Sign In
                </Link>
              </>
            )}
          </motion.div>

          {/* Social Proof */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-sm text-slate-400 dark:text-slate-500"
          >
            No credit card required · Instant setup · Full analytics
          </motion.p>
        </div>
      </section>

      {/* ─── Features Grid ───────────────────────────────────── */}
      <section className="py-20 px-4" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
              Everything you need to manage links
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              From creation to analytics, LinkSnip handles the full lifecycle of your short links.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-glass p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ───────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl p-12 text-center overflow-hidden"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, white 0%, transparent 70%)',
            }} />
            <h2 className="relative text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="relative text-white/80 mb-8 text-lg">
              Join thousands of users who trust LinkSnip for their link management.
            </p>
            <Link
              to="/register"
              className="relative inline-flex items-center gap-2 bg-white text-primary-600 font-bold px-8 py-4 rounded-xl hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              Create Free Account
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
