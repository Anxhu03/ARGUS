import React from 'react';
import { useApp } from '../../context/AppContext';
import SidebarNavItem from '../common/SidebarNavItem';
import {
  LayoutDashboard,
  HelpCircle,
  BookOpen,
  Sparkles,
  FilePlus,
  Inbox,
  FolderGit2,
  GitBranch,
  BrainCircuit,
  Network,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Cpu,
  X,
  PlusCircle
} from 'lucide-react';

export default function Sidebar({ isOpen, onCloseMobile, isMobile = false }) {
  const {
    currentView,
    setCurrentView,
    navigateToSupport,
    kpis,
    sidebarCollapsed,
    toggleSidebar
  } = useApp();

  const navigationSections = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'SUPPORT',
      items: [
        { id: 'support', label: 'Support Hub', icon: HelpCircle, badge: 'Dual' },
        { id: 'support-faq', label: 'FAQ Knowledge', icon: BookOpen },
        { id: 'support-ask', label: 'Ask ARGUS', icon: Sparkles },
        { id: 'support-complaint', label: 'Submit Complaint', icon: FilePlus },
        { id: 'support-my-cases', label: 'My Cases', icon: Inbox }
      ]
    },
    {
      title: 'INVESTIGATION',
      items: [
        { id: 'cases', label: 'All Cases', icon: FolderGit2, badge: kpis?.activeCases || '24' },
        { id: 'case-detail', label: 'Investigation Workspace', icon: GitBranch, badge: 'Live' }
      ]
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { id: 'intelligence', label: 'Case Intelligence', icon: BrainCircuit },
        { id: 'patterns', label: 'Patterns', icon: Network, badge: kpis?.patternsDetected || '5' },
        { id: 'prevention', label: 'Prevention Rules', icon: ShieldCheck }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  const handleNavClick = (id) => {
    // If routing to sub-support views, configure support mode
    if (id === 'support') {
      navigateToSupport('overview');
    } else if (id === 'support-faq') {
      navigateToSupport('faq');
    } else if (id === 'support-ask') {
      navigateToSupport('ask');
    } else if (id === 'support-complaint') {
      navigateToSupport('complaint');
    } else if (id === 'support-my-cases') {
      navigateToSupport('my-cases');
    } else {
      setCurrentView(id);
    }

    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mobile Drawer Overlay Mode
  if (isMobile) {
    if (!isOpen) return null;

    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 'var(--z-modal)',
          display: 'flex'
        }}
      >
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 7, 12, 0.75)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)'
          }}
          onClick={onCloseMobile}
        />

        <aside
          style={{
            width: '280px',
            height: '100%',
            background: 'var(--bg-secondary)',
            borderRight: '1px solid var(--glass-border)',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--glass-shadow-lg)'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '18px 20px',
              borderBottom: '1px solid var(--glass-border)',
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
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--glass-border-cyan)',
                  color: 'var(--accent-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Cpu size={18} />
              </div>
              <div>
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>ARGUS</span>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Investigation & Intel</p>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px'
              }}
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Launch CTA */}
          <div style={{ padding: '14px 16px' }}>
            <button
              className="btn btn-primary"
              style={{ width: '100%', height: '36px', fontSize: '12px', gap: '6px' }}
              onClick={() => {
                navigateToSupport('agent');
                onCloseMobile();
              }}
            >
              <PlusCircle size={15} />
              <span>Launch Investigation</span>
            </button>
          </div>

          {/* Nav Links */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '6px 12px 20px' }}>
            {navigationSections.map((section) => (
              <div key={section.title} style={{ marginBottom: '18px' }}>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: 'var(--text-faint)',
                    padding: '6px 12px',
                    textTransform: 'uppercase'
                  }}
                >
                  {section.title}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {section.items.map((item) => {
                    const isActive =
                      currentView === item.id ||
                      (item.id === 'case-detail' && currentView === 'investigations') ||
                      (item.id === 'support' && (currentView === 'support-faq' || currentView === 'support-ask'));

                    return (
                      <SidebarNavItem
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        badge={item.badge}
                        isActive={isActive}
                        isCollapsed={false}
                        onClick={() => handleNavClick(item.id)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    );
  }

  // Desktop Permanent Collapsible Sidebar
  const width = sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)';

  return (
    <aside
      style={{
        width,
        minWidth: width,
        height: '100vh',
        position: 'sticky',
        top: 0,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 'var(--z-sticky)',
        transition: 'width var(--transition-base), min-width var(--transition-base)'
      }}
      aria-label="Sidebar navigation"
    >
      {/* Brand Header */}
      <div
        style={{
          height: 'var(--topbar-height)',
          padding: sidebarCollapsed ? '0 16px' : '0 20px',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          gap: '10px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            overflow: 'hidden'
          }}
          onClick={() => setCurrentView('dashboard')}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--glass-border-cyan)',
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)'
            }}
          >
            <Cpu size={18} />
          </div>

          {!sidebarCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                ARGUS
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                Investigation & Intel
              </span>
            </div>
          )}
        </div>

        {/* Collapse Button */}
        {!sidebarCollapsed && (
          <button
            type="button"
            onClick={toggleSidebar}
            style={{
              background: 'transparent',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition-fast)'
            }}
            title="Collapse Sidebar"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.borderColor = 'var(--glass-border-light)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.borderColor = 'var(--glass-border)';
            }}
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: sidebarCollapsed ? '12px 8px' : '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        {navigationSections.map((section) => (
          <div key={section.title}>
            {!sidebarCollapsed && (
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: 'var(--text-faint)',
                  padding: '4px 10px 6px',
                  textTransform: 'uppercase'
                }}
              >
                {section.title}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {section.items.map((item) => {
                const isActive =
                  currentView === item.id ||
                  (item.id === 'case-detail' && currentView === 'investigations');

                return (
                  <SidebarNavItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    badge={item.badge}
                    isActive={isActive}
                    isCollapsed={sidebarCollapsed}
                    onClick={() => handleNavClick(item.id)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Expand Trigger if collapsed */}
      <div
        style={{
          padding: sidebarCollapsed ? '12px 8px' : '14px 16px',
          borderTop: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          background: 'var(--bg-tertiary)'
        }}
      >
        {sidebarCollapsed ? (
          <button
            type="button"
            onClick={toggleSidebar}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Expand Sidebar"
          >
            <ChevronRight size={16} />
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--accent-cyan)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '11px'
              }}
            >
              AV
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Alex Vance
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-faint)' }}>
                Lead Investigator
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
