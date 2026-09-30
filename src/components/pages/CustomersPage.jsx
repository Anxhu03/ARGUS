import React from 'react';
import { Users, UserCheck, ShieldCheck, Mail } from 'lucide-react';

const mockCustomers = [
  { id: 'CUST-101', name: 'Sarah Jenkins', email: 'sarah.j@gmail.com', spent: '$1,420.00', orders: 8, trustScore: 98, status: 'Active' },
  { id: 'CUST-102', name: 'Michael Chang', email: 'm.chang@outlook.com', spent: '$890.00', orders: 5, trustScore: 92, status: 'Active' },
  { id: 'CUST-103', name: 'Emma Watson', email: 'emma.w@icloud.com', spent: '$2,140.00', orders: 12, trustScore: 99, status: 'VIP' },
  { id: 'CUST-104', name: 'David Miller', email: 'david.miller@work.com', spent: '$340.00', orders: 2, trustScore: 78, status: 'Review' },
  { id: 'CUST-105', name: 'Jessica Taylor', email: 'jtaylor@design.co', spent: '$520.00', orders: 3, trustScore: 84, status: 'Active' },
];

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase">Total Customers</span>
            <div className="metric-icon-wrap"><Users className="w-4 h-4 text-slate-400" /></div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">18,492</div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded mt-2 inline-block">+14.6% vs last month</span>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase">Active Buyers</span>
            <div className="metric-icon-wrap"><UserCheck className="w-4 h-4 text-slate-400" /></div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">12,485</div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded mt-2 inline-block">+8.4% vs last month</span>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase">Avg Trust Score</span>
            <div className="metric-icon-wrap"><ShieldCheck className="w-4 h-4 text-slate-400" /></div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">91.4%</div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded mt-2 inline-block">High Reliability</span>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h3 className="text-base font-semibold text-white">Customer Directory</h3>
          <p className="text-xs text-slate-400">Verified shoppers and ARGUS reliability metrics</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#202938] text-slate-400 font-medium bg-slate-900/30">
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Reliability Score</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202938]/60">
              {mockCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-blue-400">{c.id}</td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-white">{c.name}</p>
                    <p className="text-[11px] text-slate-400">{c.email}</p>
                  </td>
                  <td className="py-3 px-4 font-bold text-white">{c.spent}</td>
                  <td className="py-3 px-4 text-slate-300">{c.orders}</td>
                  <td className="py-3 px-4 font-semibold text-emerald-400">{c.trustScore}%</td>
                  <td className="py-3 px-4">
                    <span className="status-badge status-badge-completed">{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
