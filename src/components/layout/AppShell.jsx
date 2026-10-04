import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Toast from '../common/Toast';

export default function AppShell({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { sidebarCollapsed } = useApp();

  return (
    <div className="app-shell-root">
      {/* 1. Permanent Desktop Sidebar */}
      <div className="desktop-sidebar-wrapper" style={{ display: 'flex' }}>
        <Sidebar isMobile={false} />
      </div>

      {/* 2. Mobile Responsive Drawer */}
      <Sidebar
        isMobile={true}
        isOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* 3. Main Application Canvas */}
      <div className="app-main-canvas">
        {/* Main Header / TopBar */}
        <TopBar onToggleMobile={() => setMobileNavOpen(true)} />

        {/* Dynamic Content Body */}
        <main className="app-content-body animate-fade-in" role="main">
          {children}
        </main>

        {/* Minimal Operational Status Footer */}
        <footer className="app-footer">
          <div className="footer-left">
            <span className="footer-brand">ARGUS Platform</span>
            <span className="footer-separator">•</span>
            <span>Autonomous Customer Dispute Investigation & Telemetry Consensus</span>
          </div>

          <div className="footer-right">
            <span>Branch: <code>anxhu/argus-phase-2</code></span>
            <span className="footer-separator">•</span>
            <span className="footer-status-dot" title="Cluster Healthy" />
            <span>4 Agent Nodes Operational</span>
          </div>
        </footer>
      </div>

      {/* 4. Global Toast Notification Layer */}
      <Toast />
    </div>
  );
}
