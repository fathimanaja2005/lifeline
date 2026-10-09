import React from 'react';
import { AlertTriangle, CheckCircle2, Droplet } from 'lucide-react';

const StockCard = ({ stock, onAction, actionLabel = 'Request' }) => {
  const isLow = stock.units <= stock.minThreshold;
  const isCritical = stock.units <= Math.floor(stock.minThreshold / 2);

  // Approximate percentage based on healthy target of 40 units
  const fillPercent = Math.min(100, Math.round((stock.units / 40) * 100));

  return (
    <div
      className={`relative bg-white rounded-2xl border transition-all p-5 hover:shadow-md ${
        isCritical
          ? 'border-rose-400 bg-rose-50/20 shadow-rose-100'
          : isLow
          ? 'border-amber-300 bg-amber-50/20'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-xs ${
              isCritical
                ? 'bg-rose-600 text-white'
                : isLow
                ? 'bg-amber-500 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {stock.bloodGroup}
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 leading-tight">
              {stock.units}{' '}
              <span className="text-xs font-semibold text-slate-500">Units</span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Min Threshold: {stock.minThreshold}
            </div>
          </div>
        </div>

        {/* Status pill */}
        {isCritical ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Critical
          </span>
        ) : isLow ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Low Stock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Adequate
          </span>
        )}
      </div>

      {/* Visual Stock Bar */}
      <div className="mt-4">
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCritical
                ? 'bg-rose-600'
                : isLow
                ? 'bg-amber-500'
                : 'bg-red-600'
            }`}
            style={{ width: `${Math.max(5, fillPercent)}%` }}
          ></div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400 truncate max-w-[160px]">
          {stock.bloodBankName || 'Central Bank'}
        </span>
        {onAction && (
          <button
            onClick={() => onAction(stock)}
            className="font-bold text-red-600 hover:text-red-700 hover:underline"
          >
            {actionLabel} &rarr;
          </button>
        )}
      </div>
    </div>
  );
};

export default StockCard;
