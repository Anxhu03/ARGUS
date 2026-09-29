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
  ShieldAlert,
  PlusCircle,
  Cpu
} from 'lucide-react';

export default function Sidebar({ isOpen, onCloseMobile }) {
  const { currentView, setCurrentView, navigateToSupport, kpis } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'cases', label: 'Cases', icon: FolderGit2, badge: kpis?.activeCases || '18' },
    { id: 'case-detail', label: 'Investigation', icon: GitBranch, badge: 'Live' },
    { id: 'support', label: 'Support & FAQ', icon: HelpCircle, badge: 'Dual' },
    { id: 'intelligence', label: 'Case Memory', icon: BrainCircuit, badge: null },
    { id: 'patterns', label: 'Patterns & Prevention', icon: Network, badge: kpis?.patternsDetected || '4' },
    { id: 'settings', label: 'System Settings', icon: Settings, badge: null }
  ];

  const handleNavClick = (id) => {
    setCurrentView(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      className={`sidebar-container ${isOpen ? 'sidebar-open' : ''}`}
      style={{
        width: 'var(--sidebar-width)',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        background: 'rgba(10, 15, 26, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 900,
        transition: 'transform var(--transition-smooth)',
        userSelect: 'none'
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '24px 20px',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#050a14',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)',
            flexShrink: 0
          }}
        >
          <Cpu size={22} strokeWidth={2.4} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                background: 'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              ARGUS
            </span>
            <span
              style={{
                fontSize: '9px',
                fontWeight: 700,
                padding: '2px 5px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(0, 242, 254, 0.12)',
                color: 'var(--accent-cyan)',
                border: '1px solid rgba(0, 242, 254, 0.25)',
                letterSpacing: '0.05em'
              }}
            >
              CORE AI
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
            Support & Investigation Platform
          </div>
        </div>
      </div>

      {/* Quick Action CTA */}
      <div style={{ padding: '16px 16px 8px 16px' }}>
        <button
          className="btn btn-primary"
          style={{ width: '100%', fontSize: '12px', padding: '9px 12px' }}
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
      <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
        <div
          style={{
            fontSize: '10px',
            fontWeight: 600,
            textTransform: 'uppercase',
            color: 'var(--text-faint)',
            padding: '4px 12px 8px 12px',
            letterSpacing: '0.08em'
          }}
        >
          Navigation
        </div>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

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
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid',
                    borderColor: isActive ? 'rgba(0, 242, 254, 0.25)' : 'transparent',
                    background: isActive ? 'rgba(0, 242, 254, 0.08)' : 'transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    textAlign: 'left',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        left: '0px',
                        top: '8px',
                        bottom: '8px',
                        width: '3px',
                        borderRadius: '0 4px 4px 0',
                        background: 'var(--accent-cyan)',
                        boxShadow: '0 0 10px var(--accent-cyan)'
                      }}
                    />
                  )}

                  <Icon
                    size={18}
                    style={{
                      color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      flexShrink: 0
                    }}
                  />
                  <span style={{ flex: 1 }}>{item.label}</span>

                  {item.badge && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-full)',
                        background: isActive ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.08)',
                        color: isActive ? '#050a14' : 'var(--text-secondary)',
                        lineHeight: 1.4
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

      {/* User / Workspace Footer */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--glass-border)',
          background: 'rgba(7, 10, 18, 0.6)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '12px',
              color: 'var(--accent-cyan)',
              flexShrink: 0
            }}
          >
            A1
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Anxhu
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--status-emerald)',
                  boxShadow: '0 0 6px var(--status-emerald)'
                }}
              />
              <span>Frontend 1 Workspace</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
