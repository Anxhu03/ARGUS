import React from 'react';
import { DollarSign, ShoppingCart, Users, Activity, TrendingUp, TrendingDown } from 'lucide-react';

const iconMap = {
  DollarSign: DollarSign,
  ShoppingCart: ShoppingCart,
  Users: Users,
  Activity: Activity,
  TrendingUp: TrendingUp
};

export default function MetricCard({
  label,
  value,
  change,
  changeType = 'positive',
  comparison = 'vs last month',
  icon = 'DollarSign'
}) {
  const IconComponent = iconMap[icon] || Activity;
  const isPositive = changeType === 'positive' || change.startsWith('+');

  return (
    <div className="metric-card">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <div className="metric-icon-wrap">
          <IconComponent className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold text-white tracking-tight">
          {value}
        </div>

        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded ${
              isPositive
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-red-400 bg-red-500/10'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3 inline" />
            ) : (
              <TrendingDown className="w-3 h-3 inline" />
            )}
            {change}
          </span>
          <span className="text-xs text-slate-400 font-normal">
            {comparison}
          </span>
        </div>
      </div>
    </div>
  );
}
