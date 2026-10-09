import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import BloodCompatibilityMatrix from '../components/BloodCompatibilityMatrix';
import StockCard from '../components/StockCard';
import {
  Heart,
  Droplet,
  Search,
  ShieldCheck,
  Clock,
  Award,
  Users,
  AlertTriangle,
  ArrowRight,
  MapPin,
  CheckCircle,
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated, isDonor, isPatient } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchGroup, setSearchGroup] = useState('All');
  const [searchCity, setSearchCity] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stockRes, statsRes] = await Promise.all([
          api.get('/inventory'),
          api.get('/analytics'),
        ]);
        setStocks(stockRes.data.data || []);
        setStats(statsRes.data.data || null);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredStocks = stocks.filter((item) => {
    const matchGroup = searchGroup === 'All' || item.bloodGroup === searchGroup;
    return matchGroup;
  });

  const criticalShortages = stocks.filter((s) => s.units <= s.minThreshold);

  return (
    <div className="space-y-16 pb-12">
      {/* Critical Shortage Notification Bar */}
      {criticalShortages.length > 0 && (
        <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white px-4 py-2.5 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs md:text-sm">
            <div className="flex items-center gap-2 font-medium">
              <span className="p-1 rounded bg-white/20">
                <AlertTriangle className="w-4 h-4 text-amber-200" />
              </span>
              <span>
                <strong>Urgent Shortage Alert:</strong> Low blood supplies for{' '}
                <span className="underline font-bold">
                  {criticalShortages.map((s) => s.bloodGroup).join(', ')}
                </span>
                . Donors are urgently requested to step forward!
              </span>
            </div>
            <Link
              to="/inventory"
              className="bg-white text-red-700 hover:bg-red-50 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1"
            >
              View Stock &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
                <Droplet className="w-4 h-4 fill-current text-red-600 animate-blood-pulse" />
                <span>Centralized Blood Banking Network</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Connecting <span className="text-red-600">Blood Donors</span> with Patients in Need
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Lifeline provides real-time tracking of blood inventory across hospitals,
                streamlined donor eligibility screening, and rapid requisition dispatch.
                One donation can save up to three lives.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to={isAuthenticated ? (isDonor ? '/donor' : '/camps') : '/register'}
                  className="px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/25 transition-all hover:scale-102 flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Become a Blood Donor</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to={isAuthenticated ? (isPatient ? '/patient' : '/inventory') : '/login'}
                  className="px-6 py-3.5 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 shadow-xs transition-all flex items-center gap-2"
                >
                  <Droplet className="w-4 h-4 text-red-600" />
                  <span>Request Blood (Emergency)</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-xs font-semibold">100% Medically Screened</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                  <span className="text-xs font-semibold">24/7 Rapid Response</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500 shrink-0" />
                  <span className="text-xs font-semibold">Certified Blood Banks</span>
                </div>
              </div>
            </div>

            {/* Right Hero Stats & Search Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-8 space-y-6 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Search className="w-5 h-5 text-red-600" />
                    Instant Stock Locator
                  </h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Live Status
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Select Blood Group
                    </label>
                    <select
                      value={searchGroup}
                      onChange={(e) => setSearchGroup(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold text-slate-900"
                    >
                      <option value="All">All Blood Groups (Overview)</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((grp) => (
                        <option key={grp} value={grp}>
                          Blood Group: {grp}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Highlighted Group Stock Preview */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs text-slate-500 font-medium mb-1">
                      {searchGroup === 'All' ? 'Total Available Blood Units' : `Available ${searchGroup} Units`}
                    </div>
                    <div className="text-3xl font-black text-slate-900 flex items-baseline gap-2">
                      {searchGroup === 'All'
                        ? stats?.totalUnitsAvailable || stocks.reduce((a, b) => a + b.units, 0)
                        : stocks.find((s) => s.bloodGroup === searchGroup)?.units || 0}
                      <span className="text-sm font-semibold text-slate-500">Pints / Units</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      Central Life Blood Bank & Hospital Network
                    </div>
                  </div>

                  <Link
                    to="/inventory"
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Inspect Full Inventory</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Micro Counters */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                  <div className="p-2.5 rounded-xl bg-red-50/80">
                    <div className="text-lg font-black text-red-600">
                      {stats?.totalDonors || 140}+
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Donors</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50/80">
                    <div className="text-lg font-black text-blue-600">
                      {stats?.completedDonations || 85}+
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Donated</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50/80">
                    <div className="text-lg font-black text-emerald-600">
                      {stats?.totalPatients || 92}+
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Helped</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Blood Stock Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-red-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Droplet className="w-4 h-4 fill-current" />
              <span>Real-time Reserve Levels</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
              Current Blood Bank Reserves
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Monitored in real-time across central storage centers and regional blood repositories.
            </p>
          </div>

          <Link
            to="/inventory"
            className="text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            View Full Inventory Matrix &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-36 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredStocks.map((stock) => (
              <StockCard key={stock.bloodGroup} stock={stock} />
            ))}
          </div>
        )}
      </section>

      {/* Interactive Blood Compatibility Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BloodCompatibilityMatrix />
      </section>

      {/* 4-Step Donation Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
              Simple & Safe
            </span>
            <h2 className="text-3xl md:text-4xl font-black mt-2 tracking-tight">
              How Blood Donation Works
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              From registration to refreshments, donating blood takes less than 30 minutes and
              is completely safe, sterile, and monitored by licensed clinicians.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md">
                1
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Register Online</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Create your donor profile with your blood group, basic vitals, and pick a
                convenient time slot.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md">
                2
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Health Screening</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A nurse conducts a mini-checkup: hemoglobin count, temperature, pulse, and blood
                pressure.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md">
                3
              </div>
              <h3 className="font-bold text-lg text-white mb-2">The Donation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sterile single-use needles collect ~450ml of whole blood in about 8 to 10 relaxed
                minutes.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md">
                4
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Certificate & Refresh</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enjoy juice and snacks while your digital donor hero certificate is automatically
                generated.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 font-bold text-white rounded-xl text-sm transition-all shadow-md"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Schedule Your Donation Today</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
