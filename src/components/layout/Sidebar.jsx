import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FolderGit2,
  GitBranch,
  HelpCircle,
  BrainCircuit,
  Network,
  Settings,
  PlusCircle,
  Cpu,
  X
} from 'lucide-react';

export default function Sidebar({ isOpen, onCloseMobile }) {
  const { currentView, setCurrentView, navigateToSupport, kpis } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'cases', label: 'Cases', icon: FolderGit2, badge: kpis?.activeCases || '18' },
    { id: 'case-detail', label: 'Investigations', icon: GitBranch, badge: 'Live' },
    { id: 'support', label: 'Support & FAQ', icon: HelpCircle, badge: 'Dual' },
    { id: 'intelligence', label: 'Case Memory', icon: BrainCircuit, badge: null },
    { id: 'patterns', label: 'Patterns & Prevention', icon: Network, badge: kpis?.patternsDetected || '4' },
    { id: 'settings', label: 'System Settings', icon: Settings, badge: null }
  ];

  const handleNavClick = (id) => {
    setCurrentView(id);
    if (onCloseMobile) onCloseMobile();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="mobile-drawer-backdrop"
        onClick={onCloseMobile}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 1200
        }}
      />

      {/* Drawer */}
      <aside
        className="mobile-drawer"
        style={{
          width: '280px',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          background: '#ffffff',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1300,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          animation: 'slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <Cpu size={18} />
            </div>
            <div>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>ARGUS</span>
              <span
                style={{
                  marginLeft: '6px',
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '2px 5px',
                  borderRadius: '4px',
                  background: '#e0f2fe',
                  color: '#0284c7'
                }}
              >
                AI Platform
              </span>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            style={{
              padding: '6px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Button */}
        <div style={{ padding: '16px' }}>
          <button
            className="btn btn-primary"
            style={{ width: '100%', fontSize: '13px' }}
            onClick={() => {
              navigateToSupport('agent');
              if (onCloseMobile) onCloseMobile();
            }}
          >
            <PlusCircle size={15} />
            <span>Launch Investigation</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '8px 12px', overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || (item.id === 'case-detail' && currentView === 'investigations');

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      background: isActive ? '#0f172a' : 'transparent',
                      color: isActive ? '#ffffff' : '#334155',
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 500,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <Icon size={18} color={isActive ? '#ffffff' : '#64748b'} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          padding: '1px 6px',
                          borderRadius: '9999px',
                          background: isActive ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                          color: isActive ? '#ffffff' : '#64748b'
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Footer */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid var(--border)',
            background: '#f8fafc'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#0f172a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '12px'
              }}
            >
              AV
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Alex Vance</p>
              <p style={{ fontSize: '11px', color: '#64748b' }}>Lead Investigator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
