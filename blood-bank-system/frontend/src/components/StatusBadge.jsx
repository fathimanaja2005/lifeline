import React from 'react';

const StatusBadge = ({ type = 'status', value }) => {
  if (!value) return null;

  // Request / Donation status styles
  const statusStyles = {
    Pending: 'bg-amber-100 text-amber-800 border-amber-300',
    Approved: 'bg-blue-100 text-blue-800 border-blue-300',
    Dispatched: 'bg-purple-100 text-purple-800 border-purple-300',
    Completed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Rejected: 'bg-rose-100 text-rose-800 border-rose-300',
    Scheduled: 'bg-sky-100 text-sky-800 border-sky-300',
    Cancelled: 'bg-slate-100 text-slate-700 border-slate-300',
    Upcoming: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  };

  // Urgency styles
  const urgencyStyles = {
    Normal: 'bg-slate-100 text-slate-700 border-slate-300',
    Urgent: 'bg-amber-100 text-amber-800 border-amber-400 font-semibold',
    Critical: 'bg-rose-100 text-rose-800 border-rose-400 font-bold animate-pulse',
  };

  const styleClass =
    type === 'urgency'
      ? urgencyStyles[value] || 'bg-slate-100 text-slate-700'
      : statusStyles[value] || 'bg-slate-100 text-slate-700 border-slate-300';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styleClass}`}
    >
      {type === 'urgency' && value === 'Critical' && (
        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-rose-600 animate-ping"></span>
      )}
      {value}
    </span>
  );
};

export default StatusBadge;
