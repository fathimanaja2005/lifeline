import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Phone,
  CheckCircle2,
  HeartHandshake,
  Sparkles,
} from 'lucide-react';

const DonationCamps = () => {
  const { user, isAuthenticated, isDonor } = useAuth();
  const navigate = useNavigate();
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchCamps = async () => {
    try {
      const res = await api.get('/camps');
      setCamps(res.data.data || []);
    } catch (err) {
      console.error('Failed to load donation camps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCamps();
  }, []);

  const handleRegister = async (campId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isDonor) {
      setErrorMsg('Only registered donors can sign up for donation drives.');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }

    setRegisteringId(campId);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await api.post(`/camps/${campId}/register`);
      setSuccessMsg('You have successfully registered for this blood donation camp!');
      setTimeout(() => setSuccessMsg(''), 4000);
      fetchCamps();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to register for camp.');
      setTimeout(() => setErrorMsg(''), 4000);
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider">
          <HeartHandshake className="w-4 h-4" />
          <span>Community Blood Drives</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Upcoming Blood Donation Camps
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Find public blood donation camps near you organized by Red Cross, universities, and
          civic partners. Every pint makes an indelible difference.
        </p>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl text-center max-w-md mx-auto">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl text-center max-w-md mx-auto">
          {errorMsg}
        </div>
      )}

      {/* Camps List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : camps.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="font-bold text-slate-700">No upcoming camps scheduled</p>
          <p className="text-xs text-slate-400 mt-1">Please check back soon for updates!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {camps.map((camp) => {
            const isRegistered =
              user && camp.registeredDonors?.some((d) => d === user._id || d._id === user._id);

            return (
              <div
                key={camp._id}
                className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                      {camp.organization}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 leading-snug">
                      {camp.name}
                    </h3>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
                    {camp.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="font-bold text-slate-800">
                      {new Date(camp.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{camp.startTime} - {camp.endTime}</span>
                  </div>

                  <div className="flex items-start gap-2 col-span-1 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{camp.venue}, {camp.city}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Target: <strong>{camp.targetUnits} Pints</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{camp.contactPerson} ({camp.contactPhone})</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500 font-semibold">
                    {camp.registeredDonors?.length || 0} Donors Signed Up
                  </div>

                  {isRegistered ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl font-bold text-xs border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                      Registered
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRegister(camp._id)}
                      disabled={registeringId === camp._id}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs disabled:opacity-60"
                    >
                      {registeringId === camp._id ? 'Registering...' : 'Register as Donor'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DonationCamps;
