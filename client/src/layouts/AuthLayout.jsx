import { Outlet, Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FiLink } from 'react-icons/fi';
import ThemeToggle from '../components/common/ThemeToggle.jsx';
import { useAuthContext } from '../context/AuthContext.jsx';

const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <FiLink className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl gradient-text">LinkSnip</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Centered form area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
