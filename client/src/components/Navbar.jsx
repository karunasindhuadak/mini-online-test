import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <span className="text-2xl">📝</span>
            <span>MiniTest</span>
          </Link>

          {/* Navigation links */}
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/history"
                className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium"
              >
                History
              </Link>

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium"
                >
                  Admin
                </Link>
              )}

              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                <span className="text-sm text-gray-500">
                  {user.name}
                  {user.role === 'admin' && (
                    <span className="ml-1 text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
