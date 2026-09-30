import React, { useState } from 'react';
import { recentOrdersData } from '../../mock/ecommerceData';
import { ArrowUpRight, Search, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function OrdersTable() {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { setCurrentView } = useApp();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="status-badge status-badge-completed">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Completed
          </span>
        );
      case 'Processing':
        return (
          <span className="status-badge status-badge-processing">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Processing
          </span>
        );
      case 'Pending':
        return (
          <span className="status-badge status-badge-pending">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Pending
          </span>
        );
      case 'Cancelled':
        return (
          <span className="status-badge status-badge-cancelled">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="status-badge">
            {status}
          </span>
        );
    }
  };

  const filteredOrders = recentOrdersData.filter((order) => {
    const matchesFilter = filter === 'All' || order.status === filter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="dashboard-card flex flex-col h-full">
      {/* Header */}
      <div className="dashboard-card-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            Recent Orders
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time customer transactions & fulfillment status
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Filter Tabs */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-[#202938]">
            {['All', 'Completed', 'Processing', 'Pending'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  filter === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('orders')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center gap-0.5 ml-2"
          >
            <span>All orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#202938] text-slate-400 font-medium bg-slate-900/30">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Product / Item</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#202938]/60">
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-slate-800/30 transition-colors group cursor-default"
              >
                {/* Order ID */}
                <td className="py-3.5 px-4 font-mono font-medium text-blue-400">
                  {order.id}
                </td>

                {/* Customer */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-[#202938] text-slate-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {order.customer.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate leading-tight">
                        {order.customer.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate leading-tight">
                        {order.customer.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Product */}
                <td className="py-3.5 px-4 text-slate-300 max-w-[200px] truncate">
                  {order.product}
                </td>

                {/* Date */}
                <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                  {order.date}
                </td>

                {/* Amount */}
                <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                  {order.amount}
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {getStatusBadge(order.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
