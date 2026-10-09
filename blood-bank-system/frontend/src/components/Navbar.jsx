import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Droplet,
  HeartHandshake,
  LayoutDashboard,
  Shield,
  LogOut,
  User,
  Menu,
  X,
  AlertCircle,
  Calendar,
  Layers,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isDonor, isPatient, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 text-white flex items-center justify-center shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
              <Droplet className="w-5 h-5 fill-current animate-blood-pulse" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1">
                LIFELINE <span className="text-red-600 font-extrabold text-sm">BANK</span>
              </span>
              <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1">
                Blood & Life Network
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/') ? 'text-red-600 bg-red-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>
            <Link
              to="/inventory"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/inventory')
                  ? 'text-red-600 bg-red-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Live Stock
            </Link>
            <Link
              to="/camps"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/camps') ? 'text-red-600 bg-red-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Donation Camps
            </Link>

            {/* Authenticated Dashboard Quick-links */}
            {isDonor && (
              <Link
                to="/donor"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/donor') ? 'text-red-600 bg-red-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Donor Portal
              </Link>
            )}
            {isPatient && (
              <Link
                to="/patient"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/patient')
                    ? 'text-red-600 bg-red-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Patient Portal
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/admin') ? 'text-red-600 bg-red-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Admin Hub
              </Link>
            )}
          </nav>

          {/* Action Buttons & Profile */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Emergency Request CTA */}
            <Link
              to={isAuthenticated ? (isPatient ? '/patient' : '/inventory') : '/login'}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl text-white bg-red-600 hover:bg-red-700 shadow-sm shadow-red-500/20 transition-all hover:scale-102"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Emergency Request
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {user?.name}
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {user?.role}
                    </span>
                    {user?.bloodGroup && (
                      <span className="text-[10px] font-black text-red-600">
                        ({user?.bloodGroup})
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to="/inventory"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-100"
          >
            Live Stock
          </Link>
          <Link
            to="/camps"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-100"
          >
            Donation Camps
          </Link>

          {isDonor && (
            <Link
              to="/donor"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-red-600 bg-red-50"
            >
              Donor Portal
            </Link>
          )}
          {isPatient && (
            <Link
              to="/patient"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-red-600 bg-red-50"
            >
              Patient Portal
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-red-600 bg-red-50"
            >
              Admin Hub
            </Link>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{user?.name}</div>
                  <div className="text-xs text-slate-500 capitalize">{user?.role} - {user?.bloodGroup}</div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-bold text-slate-700 border border-slate-300 rounded-xl"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-bold text-white bg-red-600 rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
