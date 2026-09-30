import React, { useState } from 'react';
import { Calendar, Menu } from 'lucide-react';
import Dropdown from '../common/Dropdown';
import NotificationPopover from '../common/NotificationPopover';
import UserMenu from '../common/UserMenu';
import { useApp } from '../../context/AppContext';

const dateRangeOptions = [
  'Today',
  'Last 7 days',
  'Last 30 days',
  'Last 90 days',
  'This year'
];

export default function Header({ onToggleMobile }) {
  const [selectedRange, setSelectedRange] = useState('Last 30 days');
  const { currentView } = useApp();

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'sales':
        return 'Sales Analytics';
      case 'orders':
        return 'Orders Management';
      case 'customers':
        return 'Customer Directory';
      case 'products':
        return 'Product Catalog';
      case 'reports':
        return 'Financial Reports';
      case 'settings':
        return 'Store Settings';
      case 'cases':
        return 'Case Management';
      case 'case-detail':
        return 'Investigation DAG';
      case 'support':
        return 'Customer Support & FAQ';
      case 'intelligence':
        return 'Neural Case Memory';
      default:
        return 'Dashboard';
    }
  };

  const getPageSubtitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Welcome back, here’s what’s happening with your store today.';
      case 'sales':
        return 'Detailed breakdown of gross revenue, conversion funnels, and margins.';
      case 'orders':
        return 'Manage and review real-time orders, fulfillment statuses, and refunds.';
      case 'customers':
        return 'Customer lifetime value, segments, and purchase reliability.';
      case 'products':
        return 'Catalog inventory, stock velocity, and top grossing SKUs.';
      case 'reports':
        return 'Audited financial statements, tax summaries, and executive exports.';
      case 'settings':
        return 'Configure consensus thresholds, payment gateways, and store credentials.';
      default:
        return 'Welcome back, here’s what’s happening with your store today.';
    }
  };

  return (
    <header className="dashboard-header">
      {/* Title & Subtitle + Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobile}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-lg bg-slate-900 border border-[#202938] text-slate-300 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {getPageTitle()}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {getPageSubtitle()}
          </p>
        </div>
      </div>

      {/* Header Actions: Date range selector, notification icon, user controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <Dropdown
          options={dateRangeOptions}
          value={selectedRange}
          onChange={setSelectedRange}
          icon={Calendar}
          buttonClassName="hidden sm:inline-flex"
        />

        <NotificationPopover />

        <div className="hidden sm:block h-6 w-px bg-[#202938]" />

        <UserMenu />
      </div>
    </header>
  );
}
