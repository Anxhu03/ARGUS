import React from 'react';
import { DollarSign, TrendingUp, CreditCard, ArrowUpRight } from 'lucide-react';
import RevenueChart from '../dashboard/RevenueChart';

export default function SalesPage() {
  return (
    <div className="space-y-6">
      {/* 3 Sales KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase">Gross Sales</span>
            <div className="metric-icon-wrap"><DollarSign className="w-4 h-4 text-slate-400" /></div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">$142,890.00</div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded mt-2 inline-block">+14.2% DoD</span>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase">Average Order Value</span>
            <div className="metric-icon-wrap"><TrendingUp className="w-4 h-4 text-slate-400" /></div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">$78.40</div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded mt-2 inline-block">+3.1% DoD</span>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase">Net Profit Margin</span>
            <div className="metric-icon-wrap"><CreditCard className="w-4 h-4 text-slate-400" /></div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">28.4%</div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded mt-2 inline-block">+1.8% WoW</span>
        </div>
      </div>

      {/* Revenue and Profit Analytics */}
      <RevenueChart />
    </div>
  );
}
