import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Minus,
  Truck,
  Heart,
  Users,
  Calendar,
  FileCheck,
  RefreshCw,
  Search,
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'requests' | 'donations' | 'camps'
  const [stocks, setStocks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [camps, setCamps] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  // New Camp Modal
  const [showCampModal, setShowCampModal] = useState(false);
  const [campForm, setCampForm] = useState({
    name: '',
    organization: 'Red Cross & Lifeline Blood Bank',
    date: '',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    venue: '',
    city: 'Metro City',
    contactPerson: '',
    contactPhone: '',
    targetUnits: 100,
  });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [stockRes, reqRes, donRes, campRes, statRes] = await Promise.all([
        api.get('/inventory'),
        api.get('/requests'),
        api.get('/donors/all'),
        api.get('/camps'),
        api.get('/analytics'),
      ]);
      setStocks(stockRes.data.data || []);
      setRequests(reqRes.data.data || []);
      setDonations(donRes.data.data || []);
      setCamps(campRes.data.data || []);
      setStats(statRes.data.data || null);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      showNotification('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showNotification = (type, text) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage({ type: '', text: '' }), 4000);
  };

  // 1. Stock Adjustment
  const handleStockChange = async (bloodGroup, action, units = 1) => {
    try {
      const res = await api.put(`/inventory/${bloodGroup}`, { action, units });
      showNotification('success', `Stock for ${bloodGroup} updated successfully!`);
      loadAllData();
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  // 2. Request Status Update (Approve / Reject / Dispatch / Complete)
  const handleRequestStatus = async (requestId, status) => {
    try {
      const res = await api.put(`/requests/${requestId}/status`, {
        status,
        adminRemarks:
          status === 'Approved'
            ? 'Approved by Medical Director, units allocated from bank storage'
            : status === 'Dispatched'
            ? 'Dispatched via emergency cold-chain courier'
            : status === 'Completed'
            ? 'Received and transfused at hospital facility'
            : 'Rejected due to criteria or stock constraints',
      });
      showNotification('success', `Request marked as ${status}!`);
      loadAllData();
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  // 3. Donation Status Update (Record completed collection)
  const handleDonationStatus = async (donationId, status) => {
    try {
      await api.put(`/donors/${donationId}/status`, {
        status,
        hemoglobin: 13.8,
        bloodPressure: '120/80',
        pulse: 72,
        units: 1,
        remarks: 'Screening passed, standard whole blood collection complete',
      });
      showNotification('success', `Donation marked as ${status}. Stock increased automatically!`);
      loadAllData();
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  // 4. Create Donation Camp
  const handleCreateCamp = async (e) => {
    e.preventDefault();
    try {
      await api.post('/camps', campForm);
      showNotification('success', 'Donation camp drive scheduled and published!');
      setShowCampModal(false);
      loadAllData();
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  const pendingRequestsCount = requests.filter((r) => r.status === 'Pending').length;
  const criticalShortageCount = stocks.filter((s) => s.units <= s.minThreshold).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {actionMessage.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold shadow-lg border transition-all flex items-center justify-between ${
            actionMessage.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <span>{actionMessage.text}</span>
          <button
            onClick={() => setActionMessage({ type: '', text: '' })}
            className="font-bold text-sm px-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Master Operations Hub</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Blood Bank Administration
          </h1>
          <p className="text-xs text-slate-500">
            Real-time control over blood reserve stocks, donor intake verification, and hospital requisitions
          </p>
        </div>

        <button
          onClick={loadAllData}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-bold text-xs shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Reserve
          </div>
          <div className="text-3xl font-black text-slate-900 mt-1">
            {stats?.totalUnitsAvailable || 0}{' '}
            <span className="text-xs font-semibold text-slate-400">Pints</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across 8 blood groups</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Pending Orders
          </div>
          <div className="text-3xl font-black text-amber-600 mt-1">
            {pendingRequestsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Requires immediate review</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Critical Shortages
          </div>
          <div
            className={`text-3xl font-black mt-1 ${
              criticalShortageCount > 0 ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {criticalShortageCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Below minimum threshold</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Donors Registered
          </div>
          <div className="text-3xl font-black text-slate-900 mt-1">
            {stats?.totalDonors || 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Active voluntary pool</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'inventory'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Stock Inventory ({stocks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'requests'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Patient Requests ({requests.length})</span>
          {pendingRequestsCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('donations')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'donations'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Donor Collections ({donations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('camps')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'camps'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Donation Camps ({camps.length})</span>
        </button>
      </div>

      {/* TAB 1: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900">Live Blood Reserves</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust stock units, configure alert thresholds, and monitor reserve capacity
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stocks.map((s) => {
              const isLow = s.units <= s.minThreshold;
              return (
                <div
                  key={s.bloodGroup}
                  className={`p-4 rounded-2xl border transition-all ${
                    isLow ? 'bg-rose-50/50 border-rose-300' : 'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-xl bg-red-600 text-white font-black text-lg flex items-center justify-center shadow-xs">
                      {s.bloodGroup}
                    </span>
                    {isLow && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                        Low Stock Alert
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="text-3xl font-black text-slate-900">{s.units} Units</div>
                    <div className="text-xs text-slate-500">Min Alert: {s.minThreshold} Units</div>
                  </div>

                  {/* Stock adjust buttons */}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200/60">
                    <button
                      onClick={() => handleStockChange(s.bloodGroup, 'remove', 1)}
                      disabled={s.units <= 0}
                      className="flex-1 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 flex items-center justify-center gap-1 disabled:opacity-40"
                    >
                      <Minus className="w-3.5 h-3.5" />
                      <span>1 Unit</span>
                    </button>
                    <button
                      onClick={() => handleStockChange(s.bloodGroup, 'add', 1)}
                      className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>1 Unit</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PATIENT REQUISITIONS */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 md:p-8 space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-900">Hospital & Patient Requisitions</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review medical requisitions, allocate units, and coordinate emergency dispatch
            </p>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs font-bold">
              No patient requests found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Patient / Group</th>
                    <th className="py-3 px-4">Hospital & Doctor</th>
                    <th className="py-3 px-4">Units</th>
                    <th className="py-3 px-4">Urgency</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {requests.map((req) => (
                    <tr key={req._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{req.patientName}</div>
                        <div className="text-[11px] text-slate-500">Phone: {req.contactPhone}</div>
                        <span className="font-black text-red-600 bg-red-50 px-2 py-0.2 rounded text-[11px] mt-0.5 inline-block">
                          {req.bloodGroup}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{req.hospitalName}</div>
                        <div className="text-[11px] text-slate-500">
                          {req.doctorName ? `Dr. ${req.doctorName} • ` : ''}
                          {req.reason}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-black text-sm">{req.units} Pints</td>
                      <td className="py-3.5 px-4">
                        <StatusBadge type="urgency" value={req.urgency} />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge value={req.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        {req.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleRequestStatus(req._id, 'Approved')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                            >
                              Approve & Debit Stock
                            </button>
                            <button
                              onClick={() => handleRequestStatus(req._id, 'Rejected')}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {req.status === 'Approved' && (
                          <button
                            onClick={() => handleRequestStatus(req._id, 'Dispatched')}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 ml-auto"
                          >
                            <Truck className="w-3 h-3" />
                            <span>Dispatch Courier</span>
                          </button>
                        )}
                        {req.status === 'Dispatched' && (
                          <button
                            onClick={() => handleRequestStatus(req._id, 'Completed')}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs ml-auto"
                          >
                            Confirm Hospital Receipt
                          </button>
                        )}
                        {req.status === 'Completed' && (
                          <span className="text-emerald-600 font-bold text-[11px]">
                            Fulfilled Successfully
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DONOR COLLECTIONS */}
      {activeTab === 'donations' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 md:p-8 space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-900">Donor Appointments & Intake</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirm donor screening, process collections into stock, and verify vitals
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Donor Details</th>
                  <th className="py-3 px-4">Blood Type</th>
                  <th className="py-3 px-4">Appointment Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Certificate ID</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {donations.map((don) => (
                  <tr key={don._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{don.donor?.name || 'Walk-in Donor'}</div>
                      <div className="text-[11px] text-slate-500">{don.donor?.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-black text-red-600 bg-red-50 px-2 py-0.5 rounded">
                        {don.bloodGroup}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{new Date(don.appointmentDate).toLocaleDateString()}</div>
                      <div className="text-[11px] text-slate-400">{don.timeSlot}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge value={don.status} />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {don.certificateId || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {don.status === 'Scheduled' ? (
                        <button
                          onClick={() => handleDonationStatus(don._id, 'Completed')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                        >
                          Complete & Add to Stock
                        </button>
                      ) : (
                        <span className="text-slate-400 italic">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CAMPS MANAGEMENT */}
      {activeTab === 'camps' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900">Donation Drives & Camps</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Organize public blood donation camps at universities, corporations, and community centers
              </p>
            </div>
            <button
              onClick={() => setShowCampModal(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule New Camp</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {camps.map((camp) => (
              <div
                key={camp._id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-black text-slate-900 text-base">{camp.name}</h4>
                    <p className="text-xs text-slate-500 font-semibold">{camp.organization}</p>
                  </div>
                  <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {camp.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Date & Hours
                    </span>
                    <span className="font-bold text-slate-800">
                      {new Date(camp.date).toLocaleDateString()}
                    </span>{' '}
                    ({camp.startTime} - {camp.endTime})
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Target Units
                    </span>
                    <span className="font-bold text-red-600">{camp.targetUnits} Pints</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Venue Location
                    </span>
                    <span className="font-medium text-slate-800">{camp.venue}, {camp.city}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Coordinator: {camp.contactPerson} ({camp.contactPhone})
                  </span>
                  <span className="font-bold text-slate-700">
                    {camp.registeredDonors?.length || 0} Registered Donors
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Camp Modal */}
      {showCampModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-xl">Schedule Blood Drive</h3>
              <button
                onClick={() => setShowCampModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateCamp} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Camp Title / Event Name
                </label>
                <input
                  type="text"
                  required
                  value={campForm.name}
                  onChange={(e) => setCampForm({ ...campForm, name: e.target.value })}
                  placeholder="e.g. City Plaza Public Blood Drive"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    required
                    value={campForm.date}
                    onChange={(e) => setCampForm({ ...campForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target Units
                  </label>
                  <input
                    type="number"
                    value={campForm.targetUnits}
                    onChange={(e) =>
                      setCampForm({ ...campForm, targetUnits: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Venue & Address
                </label>
                <input
                  type="text"
                  required
                  value={campForm.venue}
                  onChange={(e) => setCampForm({ ...campForm, venue: e.target.value })}
                  placeholder="e.g. City Hall Atrium"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Coordinator Name
                  </label>
                  <input
                    type="text"
                    required
                    value={campForm.contactPerson}
                    onChange={(e) =>
                      setCampForm({ ...campForm, contactPerson: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={campForm.contactPhone}
                    onChange={(e) =>
                      setCampForm({ ...campForm, contactPhone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all"
                >
                  Publish Camp Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
