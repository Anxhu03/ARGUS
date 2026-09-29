import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Toast from '../common/Toast';

export default function AppShell({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        position: 'relative'
      }}
    >
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          marginLeft: 'var(--sidebar-width)',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          position: 'relative',
          zIndex: 1
        }}
      >
        <TopBar onToggleMobile={() => setMobileNavOpen(!mobileNavOpen)} />

        <main
          style={{
            flex: 1,
            padding: '28px',
            overflowY: 'auto'
          }}
        >
          <div className="container-argus animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      {/* Global Toast Overlay */}
      <Toast />
    </div>
  );
}
