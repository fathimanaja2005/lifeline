import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Award,
  PlusCircle,
  FileText,
  Sparkles,
  Droplet,
} from 'lucide-react';

const DonorDashboard = () => {
  const { user, refreshProfile } = useAuth();
  const [donations, setDonations] = useState([]);
  const [eligibility, setEligibility] = useState(user?.eligibility || null);
  const [loading, setLoading] = useState(true);

  // Scheduling Form Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 11:00 AM');
  const [center, setCenter] = useState('Central Life Blood Bank & Research Institute');
  const [scheduleError, setScheduleError] = useState('');
  const [scheduleSuccess, setScheduleSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Certificate Modal State
  const [viewCertificate, setViewCertificate] = useState(null);

  const fetchDonorData = async () => {
    try {
      const res = await api.get('/donors/my');
      setDonations(res.data.data || []);
      if (res.data.eligibility) setEligibility(res.data.eligibility);
    } catch (err) {
      console.error('Failed to load donor data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonorData();
  }, []);

  const handleSchedule = async (e) => {
    e.preventDefault();
    setScheduleError('');
    setScheduleSuccess('');
    setSubmitting(true);

    try {
      await api.post('/donors/schedule', {
        appointmentDate,
        timeSlot,
        donationCenter: center,
      });
      setScheduleSuccess('Appointment booked successfully! Our medical staff will see you then.');
      setTimeout(() => {
        setShowScheduleModal(false);
        setScheduleSuccess('');
        setAppointmentDate('');
      }, 1500);
      fetchDonorData();
      refreshProfile();
    } catch (err) {
      setScheduleError(err.message || 'Failed to schedule appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  const isEligible = eligibility ? eligibility.eligible : true;
  const completedCount = donations.filter((d) => d.status === 'Completed').length;
  const estimatedLivesSaved = completedCount * 3;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Donor Profile Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 rounded-full bg-white/5 blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white text-red-600 font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
              {user?.bloodGroup || 'O+'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black">{user?.name}</h1>
                <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Verified Donor
                </span>
              </div>
              <p className="text-xs text-red-100 mt-1 flex items-center gap-3">
                <span>Phone: {user?.phone}</span>
                <span>•</span>
                <span>City: {user?.city}</span>
                <span>•</span>
                <span>Weight: {user?.weight || 65} kg</span>
              </p>
            </div>
          </div>

          {/* Quick Schedule Button */}
          <div>
            <button
              onClick={() => setShowScheduleModal(true)}
              disabled={!isEligible}
              className={`px-5 py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 ${
                isEligible
                  ? 'bg-white text-red-600 hover:bg-red-50 hover:scale-102'
                  : 'bg-white/40 text-white/70 cursor-not-allowed'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Schedule Blood Donation</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div>
            <div className="text-xs text-red-200 font-medium uppercase tracking-wider">
              Total Donations
            </div>
            <div className="text-2xl font-black mt-0.5">{completedCount} Times</div>
          </div>
          <div>
            <div className="text-xs text-red-200 font-medium uppercase tracking-wider">
              Lives Impacted
            </div>
            <div className="text-2xl font-black mt-0.5 flex items-center gap-1.5 text-emerald-300">
              <Sparkles className="w-5 h-5" />
              ~{estimatedLivesSaved} Lives
            </div>
          </div>
          <div>
            <div className="text-xs text-red-200 font-medium uppercase tracking-wider">
              Last Donation
            </div>
            <div className="text-sm font-bold mt-1">
              {user?.lastDonationDate
                ? new Date(user.lastDonationDate).toLocaleDateString()
                : 'Never'}
            </div>
          </div>
          <div>
            <div className="text-xs text-red-200 font-medium uppercase tracking-wider">
              Donor Status
            </div>
            <div className="text-sm font-bold mt-1">
              {isEligible ? (
                <span className="text-emerald-300 font-black">Eligible Now</span>
              ) : (
                <span className="text-amber-300">Waiting Window</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Eligibility Status Banner */}
      <div
        className={`rounded-2xl p-6 border transition-all ${
          isEligible
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            : 'bg-amber-50/70 border-amber-200 text-amber-950'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            {isEligible ? (
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
            )}
            <div>
              <h3 className="font-black text-lg">
                {isEligible
                  ? 'You are Eligible to Donate Blood Today!'
                  : 'Cooling-Off Period in Progress'}
              </h3>
              <p className="text-xs sm:text-sm mt-0.5 opacity-90">
                {eligibility?.reason ||
                  (isEligible
                    ? 'More than 56 days have passed since your last donation.'
                    : 'To ensure your red blood cells fully replenish, please wait before donating again.')}
              </p>
            </div>
          </div>

          {!isEligible && eligibility?.daysRemaining > 0 && (
            <div className="bg-amber-200/80 px-4 py-2 rounded-xl text-center font-bold text-amber-900 shrink-0">
              <span className="text-xl">{eligibility.daysRemaining}</span> Days Left
            </div>
          )}
        </div>
      </div>

      {/* Donation History / Appointments */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900">Your Donation History</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Appointments, verified blood collections, and downloadable hero certificates
            </p>
          </div>
          <button
            onClick={() => setShowScheduleModal(true)}
            disabled={!isEligible}
            className="text-xs font-bold text-red-600 hover:text-red-700 disabled:opacity-40"
          >
            + New Appointment
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
            <Heart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700 text-sm">No donations recorded yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Click the button above to schedule your first life-saving appointment!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Center / Camp</th>
                  <th className="py-3 px-4">Group</th>
                  <th className="py-3 px-4">Units</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {donations.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{new Date(d.appointmentDate).toLocaleDateString()}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{d.timeSlot}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {d.camp ? d.camp.name : d.donationCenter}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-black text-red-600 bg-red-50 px-2 py-0.5 rounded">
                        {d.bloodGroup}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold">{d.units || 1} Unit</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge value={d.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      {d.certificateId ? (
                        <button
                          onClick={() => setViewCertificate(d)}
                          className="inline-flex items-center gap-1 text-red-600 font-bold hover:underline"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>View Certificate</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">
                          {d.status === 'Completed' ? 'Processing' : 'Pending Completion'}
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

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-xl flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-600" />
                Schedule Blood Donation
              </h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            {scheduleError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                {scheduleError}
              </div>
            )}
            {scheduleSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold">
                {scheduleSuccess}
              </div>
            )}

            <form onSubmit={handleSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Appointment Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Preferred Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 font-medium text-sm"
                >
                  <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                  <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                  <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                  <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                  <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Donation Center
                </label>
                <select
                  value={center}
                  onChange={(e) => setCenter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 font-medium text-sm"
                >
                  <option value="Central Life Blood Bank & Research Institute">
                    Central Life Blood Bank & Research Institute (Metro Complex)
                  </option>
                  <option value="St. Jude Hospital Blood Bank Wing">
                    St. Jude Hospital Blood Bank Wing
                  </option>
                  <option value="City Red Cross Center">City Red Cross Center</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-red-500/20 disabled:opacity-60"
                >
                  {submitting ? 'Confirming...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {viewCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl relative border-8 border-red-50">
            <button
              onClick={() => setViewCertificate(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 font-bold text-xl"
            >
              &times;
            </button>

            <div className="text-center space-y-2 border-b border-slate-200 pb-4">
              <div className="inline-flex w-12 h-12 rounded-full bg-red-600 text-white items-center justify-center shadow-md mb-1">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-wide">
                Certificate of Appreciation
              </h3>
              <p className="text-xs font-semibold text-slate-400">
                PROUDLY PRESENTED BY LIFELINE BLOOD BANK NETWORK
              </p>
            </div>

            <div className="text-center space-y-4 py-2">
              <p className="text-xs text-slate-600 italic">
                This certificate is gratefully awarded to
              </p>
              <h2 className="text-2xl font-black text-slate-900 underline decoration-red-500 decoration-2 underline-offset-4">
                {user?.name}
              </h2>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                For the selfless act of voluntary blood donation (Group{' '}
                <strong className="text-red-600">{viewCertificate.bloodGroup}</strong>), helping
                sustain life and inspiring hope in patients in critical medical need.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-left text-xs">
                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">
                    Certificate ID
                  </span>
                  <span className="font-mono font-bold text-slate-800">
                    {viewCertificate.certificateId}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">
                    Donation Date
                  </span>
                  <span className="font-bold text-slate-800">
                    {new Date(viewCertificate.appointmentDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setViewCertificate(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;
