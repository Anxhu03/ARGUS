import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Toast from '../common/Toast';

export default function AppShell({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 flex flex-col lg:flex-row antialiased selection:bg-blue-600 selection:text-white">
      {/* Fixed/Sticky Left Sidebar (~224px wide) */}
      <Sidebar
        isOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* Main Content Area to the right of sidebar */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen bg-[#080b12]">
        {/* Top Header */}
        <Header onToggleMobile={() => setMobileNavOpen(true)} />

        {/* Dashboard / Active View Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Notifications/Toast */}
      <Toast />
    </div>
  );
}
