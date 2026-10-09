import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  Droplet,
  PlusCircle,
  Clock,
  Building2,
  AlertTriangle,
  User,
  Phone,
  FileCheck,
  Send,
} from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const PatientDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Requisition Modal State
  const [showModal, setShowModal] = useState(false);
  const [patientName, setPatientName] = useState(user?.name || '');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || 'B+');
  const [units, setUnits] = useState(1);
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [reason, setReason] = useState('');
  const [urgency, setUrgency] = useState('Urgent');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests/my');
      setRequests(res.data.data || []);
    } catch (err) {
      console.error('Failed to load blood requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);

    try {
      await api.post('/requests', {
        patientName,
        bloodGroup,
        units: Number(units),
        hospitalName,
        hospitalAddress,
        doctorName,
        reason,
        urgency,
        contactPhone,
      });

      setFormSuccess('Blood requisition submitted! Blood Bank operations team notified.');
      setTimeout(() => {
        setShowModal(false);
        setFormSuccess('');
        setReason('');
        setUnits(1);
      }, 1500);
      fetchRequests();
    } catch (err) {
      setFormError(err.message || 'Failed to submit blood request.');
    } finally {
      setSubmitting(false);
    }
  };

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const approvedCount = requests.filter((r) => r.status === 'Approved' || r.status === 'Dispatched').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Patient Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-red-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
              {user?.bloodGroup || 'B+'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black">{user?.name}</h1>
                <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Patient / Recipient Portal
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-3">
                <span>Phone: {user?.phone}</span>
                <span>•</span>
                <span>City: {user?.city}</span>
              </p>
            </div>
          </div>

          <div>
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-3.5 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-all hover:scale-102 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Blood Requisition</span>
            </button>
          </div>
        </div>

        {/* Status Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
          <div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Total Requisitions
            </div>
            <div className="text-2xl font-black mt-0.5">{requests.length} Requests</div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Awaiting Approval
            </div>
            <div className="text-2xl font-black mt-0.5 text-amber-400">
              {pendingCount} Pending
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Active / Dispatched
            </div>
            <div className="text-2xl font-black mt-0.5 text-blue-400">
              {approvedCount} In Progress
            </div>
          </div>
        </div>
      </div>

      {/* Requests History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900">Your Blood Requisitions</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Track real-time approval, dispatch, and hospital fulfillment status
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs font-bold text-red-600 hover:text-red-700"
          >
            + Request More Units
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
            <Droplet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700 text-sm">No blood requests made yet</p>
            <p className="text-xs text-slate-400 mt-1">
              If you or your hospital require blood, click the button above to create a requisition.
            </p>
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
                  <th className="py-3 px-4">Admin Remarks</th>
                  <th className="py-3 px-4">Submitted Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{req.patientName}</div>
                      <span className="inline-block mt-0.5 font-black text-red-600 bg-red-50 px-2 py-0.2 rounded text-[11px]">
                        Group: {req.bloodGroup}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{req.hospitalName}</div>
                      <div className="text-[11px] text-slate-500">
                        {req.doctorName ? `Dr. ${req.doctorName}` : req.reason}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-black text-sm">{req.units} Units</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge type="urgency" value={req.urgency} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge value={req.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 italic max-w-xs truncate">
                      {req.adminRemarks || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Requisition Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-5 shadow-2xl relative my-8">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-xl flex items-center gap-2">
                <Droplet className="w-5 h-5 text-red-600" />
                Submit Blood Requisition
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-red-600"
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Units Needed (Pints)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    required
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold"
                  >
                    <option value="Normal">Normal (Scheduled)</option>
                    <option value="Urgent">Urgent (Within 24h)</option>
                    <option value="Critical">Critical (Emergency Trauma)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Hospital / Clinic Name
                </label>
                <input
                  type="text"
                  required
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  placeholder="e.g. St. Jude Memorial Hospital, ICU Ward 3"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Attending Physician
                  </label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="Dr. Gregory House"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Medical Diagnosis / Reason
                </label>
                <textarea
                  rows={2}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Scheduled open heart surgery; severe acute hemorrhage"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-red-500/20 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Transmit Emergency Requisition'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
