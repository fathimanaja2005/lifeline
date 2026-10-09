import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplet, Lock, Mail, AlertCircle, ArrowRight, Shield, User, Heart } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'donor') navigate('/donor');
      else if (user.role === 'patient') navigate('/patient');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-red-600 text-white items-center justify-center shadow-lg shadow-red-500/20">
            <Droplet className="w-6 h-6 fill-current animate-blood-pulse" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Sign In to Lifeline
          </h2>
          <p className="text-xs text-slate-500">
            Access your donor appointments, patient requests, or inventory management
          </p>
        </div>

        {/* Demo Fast-Fill Badges */}
        <div className="bg-slate-100/80 border border-slate-200/80 rounded-2xl p-3.5 space-y-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
            ⚡ 1-Click Demo Accounts
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => fillDemo('admin@lifeline.org', 'admin123')}
              className="py-1.5 px-2 bg-white hover:bg-red-50 text-slate-800 hover:text-red-700 font-bold rounded-lg border border-slate-200 shadow-2xs transition-all text-center flex flex-col items-center gap-0.5"
            >
              <Shield className="w-3.5 h-3.5 text-red-600" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('donor@lifeline.org', 'donor123')}
              className="py-1.5 px-2 bg-white hover:bg-red-50 text-slate-800 hover:text-red-700 font-bold rounded-lg border border-slate-200 shadow-2xs transition-all text-center flex flex-col items-center gap-0.5"
            >
              <Heart className="w-3.5 h-3.5 text-red-600" />
              <span>Donor</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('patient@lifeline.org', 'patient123')}
              className="py-1.5 px-2 bg-white hover:bg-red-50 text-slate-800 hover:text-red-700 font-bold rounded-lg border border-slate-200 shadow-2xs transition-all text-center flex flex-col items-center gap-0.5"
            >
              <User className="w-3.5 h-3.5 text-red-600" />
              <span>Patient</span>
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 space-y-6">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-red-500/20 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-red-600 hover:underline">
              Create an account &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
