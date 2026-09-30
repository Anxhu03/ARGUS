import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Toast from '../common/Toast';

export default function AppShell({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="app-shell-root">
      {/* Mobile Drawer (Only visible when toggled on smaller screens) */}
      <Sidebar
        isOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* Main Application Container matching reference max-w-[1400px] */}
      <div className="app-main-canvas">
        {/* Reference Top Header with centered pill navigation */}
        <TopBar onToggleMobile={() => setMobileNavOpen(!mobileNavOpen)} />

        {/* Content Area */}
        <main className="app-content-body animate-fade-in">
          {children}
        </main>

        {/* Subtle Footer */}
        <footer className="app-footer">
          <div className="footer-left">
            <span className="footer-brand">ARGUS Intelligence</span>
            <span className="footer-separator">•</span>
            <span>Deterministic Multi-Agent Investigation Architecture</span>
          </div>
          <div className="footer-right">
            <span>Branch: <code>anxhu/frontend-1</code></span>
            <span className="footer-separator">•</span>
            <span className="footer-status-dot"></span>
            <span>All Neural Agent Nodes Online</span>
          </div>
        </footer>
      </div>

      {/* Global Toast Overlay */}
      <Toast />
    </div>
  );
}
