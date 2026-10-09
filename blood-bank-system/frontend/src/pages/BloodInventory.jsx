import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StockCard from '../components/StockCard';
import BloodCompatibilityMatrix from '../components/BloodCompatibilityMatrix';
import { Droplet, AlertTriangle, ShieldCheck, RefreshCw, Filter, ArrowRight } from 'lucide-react';

const BLOOD_GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const BloodInventory = () => {
  const { isAuthenticated, isPatient } = useAuth();
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchStock = async () => {
    setLoading(true);
    try {
      const res = await api.get('/inventory');
      setStocks(res.data.data || []);
    } catch (err) {
      console.error('Failed to load blood inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const filtered = stocks.filter(
    (s) => selectedFilter === 'All' || s.bloodGroup === selectedFilter
  );

  const totalUnits = stocks.reduce((acc, curr) => acc + curr.units, 0);
  const lowCount = stocks.filter((s) => s.units <= s.minThreshold).length;

  const handleRequestGroup = (stock) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (isPatient) {
      navigate('/patient');
    } else {
      navigate('/patient');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider">
            <Droplet className="w-4 h-4 fill-current" />
            <span>Central Blood Bank & Hospital Network</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
            Real-Time Blood Reserves
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Live public telemetry of whole blood and component reserves across our network.
            Updated every 5 minutes from refrigeration telemetry.
          </p>
        </div>

        <button
          onClick={fetchStock}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-bold text-xs shadow-2xs self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Reserves</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-black text-xl">
            <Droplet className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Units in Stock
            </div>
            <div className="text-3xl font-black text-slate-900">{totalUnits} Pints</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl ${
              lowCount > 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Shortage Alerts
            </div>
            <div
              className={`text-3xl font-black ${
                lowCount > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {lowCount} Groups
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Safety Verification
            </div>
            <div className="text-xl font-black text-slate-900">100% Tested</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>
        {BLOOD_GROUPS.map((grp) => (
          <button
            key={grp}
            onClick={() => setSelectedFilter(grp)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 ${
              selectedFilter === grp
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {grp}
          </button>
        ))}
      </div>

      {/* Stock Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-44 bg-slate-200 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((stock) => (
            <StockCard
              key={stock.bloodGroup}
              stock={stock}
              onAction={handleRequestGroup}
              actionLabel="Request Units"
            />
          ))}
        </div>
      )}

      {/* Embedded Compatibility Matrix */}
      <div className="pt-6">
        <BloodCompatibilityMatrix />
      </div>
    </div>
  );
};

export default BloodInventory;
