import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { revenueOverviewData } from '../../mock/ecommerceData';
import Dropdown from '../common/Dropdown';
import { Calendar } from 'lucide-react';

const timeRanges = [
  'Today',
  'Last 7 days',
  'Last 30 days',
  'Last 90 days',
  'This year'
];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="text-xs font-semibold text-slate-300 mb-1.5">{label} 2026</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}:
              </span>
              <span className="font-semibold text-white">
                ${entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export default function RevenueChart() {
  const [selectedRange, setSelectedRange] = useState('Last 30 days');

  return (
    <div className="dashboard-card flex flex-col h-full">
      {/* Panel Header */}
      <div className="dashboard-card-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            Revenue Overview
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Monthly gross revenue, orders, and profit distribution
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Dropdown
            options={timeRanges}
            value={selectedRange}
            onChange={setSelectedRange}
            icon={Calendar}
          />
        </div>
      </div>

      {/* Summary Row with Legend */}
      <div className="px-5 pt-3 pb-2 flex flex-wrap items-center justify-between gap-4 border-b border-[#202938]/60">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold text-white">$128,430.00</span>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
            +12.5% YoY
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Gross Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
            <span>Net Profit</span>
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="p-5 flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart
            data={revenueOverviewData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#202938' }}
              dy={6}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v / 1000}k`}
              dx={-6}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Gross Revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Area
              type="monotone"
              dataKey="profit"
              name="Net Profit"
              stroke="#818cf8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorProfit)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
