import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  FileBarChart2,
  Settings,
  FolderGit2,
  GitBranch,
  HelpCircle,
  BrainCircuit,
  MoreVertical,
  X
} from 'lucide-react';
import UserMenu from '../common/UserMenu';

export default function Sidebar({ isOpen, onCloseMobile }) {
  const { currentView, setCurrentView } = useApp();

  const primaryNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sales', label: 'Sales', icon: TrendingUp },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'reports', label: 'Reports', icon: FileBarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const intelligenceNavItems = [
    { id: 'cases', label: 'Cases', icon: FolderGit2, badge: '18' },
    { id: 'case-detail', label: 'Investigations', icon: GitBranch, badge: 'Live' },
    { id: 'support', label: 'Support & FAQ', icon: HelpCircle, badge: null },
    { id: 'intelligence', label: 'Case Memory', icon: BrainCircuit, badge: null }
  ];

  const handleNavClick = (id) => {
    setCurrentView(id);
    if (onCloseMobile) onCloseMobile();
  };

  const renderNavContent = () => (
    <div className="flex flex-col h-full bg-[#080b12] text-slate-300 select-none">
      {/* Brand Header: Abstract blue mark and product name "Analytics" */}
      <div className="sidebar-brand-header">
        <div className="flex items-center gap-2.5">
          {/* Abstract Blue Mark Logo */}
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-tight">Analytics</span>
            <span className="ml-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              ARGUS
            </span>
          </div>
        </div>

        {/* Close button for mobile */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Section 1: Main Menu */}
        <div>
          <div className="sidebar-section-title">
            OVERVIEW
          </div>
          <ul className="space-y-1">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Section 2: ARGUS Intelligence */}
        <div>
          <div className="sidebar-section-title">
            ARGUS INTELLIGENCE
          </div>
          <ul className="space-y-1">
            {intelligenceNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentView === item.id ||
                (item.id === 'case-detail' && currentView === 'investigations');

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span className="truncate flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-slate-800 text-slate-300">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* User Profile Footer: Circular male avatar, name, role/email, menu button */}
      <div className="sidebar-profile-footer">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-[#202938] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow">
              MC
            </div>
            <div className="min-w-0 text-left">
              <p className="text-xs font-semibold text-white truncate">Marcus Chen</p>
              <p className="text-[11px] text-slate-400 truncate">alex@argus.io</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleNavClick('settings')}
            aria-label="User settings"
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar: 224px wide, full viewport height */}
      <aside className="sidebar-desktop">
        {renderNavContent()}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <aside className="relative w-64 max-w-[80vw] h-full z-10 animate-slide-right">
            {renderNavContent()}
          </aside>
        </div>
      )}
    </>
  );
}
