import React, { useState } from 'react';
import { Droplet, Info, Check, X } from 'lucide-react';

const compatibilityData = {
  'O-': {
    give: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    receive: ['O-'],
    note: 'Universal Red Blood Cell Donor. Critical in emergencies!',
  },
  'O+': {
    give: ['O+', 'A+', 'B+', 'AB+'],
    receive: ['O+', 'O-'],
    note: 'Most common blood type. In high demand worldwide.',
  },
  'A-': {
    give: ['A-', 'A+', 'AB-', 'AB+'],
    receive: ['A-', 'O-'],
    note: 'Can help A and AB patients of either Rh factor.',
  },
  'A+': {
    give: ['A+', 'AB+'],
    receive: ['A+', 'A-', 'O+', 'O-'],
    note: 'Second most common blood group.',
  },
  'B-': {
    give: ['B-', 'B+', 'AB-', 'AB+'],
    receive: ['B-', 'O-'],
    note: 'Rare blood type. Very important for regular donations.',
  },
  'B+': {
    give: ['B+', 'AB+'],
    receive: ['B+', 'B-', 'O+', 'O-'],
    note: 'Compatible with B+ and AB+ recipients.',
  },
  'AB-': {
    give: ['AB-', 'AB+'],
    receive: ['AB-', 'A-', 'B-', 'O-'],
    note: 'Rarest blood group on Earth (<1% of population).',
  },
  'AB+': {
    give: ['AB+'],
    receive: ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
    note: 'Universal Red Blood Cell Recipient.',
  },
};

const allGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

const BloodCompatibilityMatrix = () => {
  const [selectedGroup, setSelectedGroup] = useState('O-');

  const current = compatibilityData[selectedGroup];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-semibold text-sm uppercase tracking-wider">
            <Droplet className="w-4 h-4 fill-current" />
            <span>Blood Group Compatibility Guide</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            Who Can You Give To & Receive From?
          </h3>
          <p className="text-slate-600 text-sm mt-0.5">
            Select your blood group to see life-saving transfusion compatibility.
          </p>
        </div>

        {/* Group Selector Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
          {allGroups.map((group) => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                selectedGroup === group
                  ? 'bg-red-600 text-white shadow-sm shadow-red-200'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Group Details Card */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 rounded-xl p-4 mb-6 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-extrabold text-lg shrink-0 shadow-sm">
          {selectedGroup}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-red-950 text-base">
              Blood Type {selectedGroup} Profile
            </span>
            <span className="bg-red-200/70 text-red-900 text-xs px-2 py-0.5 rounded-full font-medium">
              Verified Matrix
            </span>
          </div>
          <p className="text-red-900/80 text-sm mt-0.5">{current.note}</p>
        </div>
      </div>

      {/* Grid: Can Give vs Can Receive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Can Give */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Can Donate Blood To:
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {current.give.length} of 8 types
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {allGroups.map((grp) => {
              const isCompatible = current.give.includes(grp);
              return (
                <div
                  key={`give-${grp}`}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    isCompatible
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold shadow-xs'
                      : 'bg-white/40 border-slate-200 text-slate-300'
                  }`}
                >
                  <div className="text-base">{grp}</div>
                  <div className="text-[10px] flex items-center justify-center mt-1">
                    {isCompatible ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-slate-300" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Can Receive */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Can Receive Blood From:
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {current.receive.length} of 8 types
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {allGroups.map((grp) => {
              const isCompatible = current.receive.includes(grp);
              return (
                <div
                  key={`rec-${grp}`}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    isCompatible
                      ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold shadow-xs'
                      : 'bg-white/40 border-slate-200 text-slate-300'
                  }`}
                >
                  <div className="text-base">{grp}</div>
                  <div className="text-[10px] flex items-center justify-center mt-1">
                    {isCompatible ? (
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-slate-300" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodCompatibilityMatrix;
