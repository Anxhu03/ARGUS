import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AppShell from './components/layout/AppShell';
import DashboardView from './components/dashboard/DashboardView';
import CasesListView from './components/cases/CasesListView';
import CaseDetailView from './components/investigation/CaseDetailView';
import SupportView from './components/support/SupportView';
import IntelligenceView from './components/intelligence/IntelligenceView';
import SettingsView from './components/settings/SettingsView';

function AppContent() {
  const { currentView } = useApp();

  return (
    <AppShell>
      {currentView === 'dashboard' && <DashboardView />}
      {currentView === 'cases' && <CasesListView />}
      {currentView === 'case-detail' && <CaseDetailView />}
      {currentView === 'support' && <SupportView />}
      {currentView === 'intelligence' && <IntelligenceView />}
      {currentView === 'patterns' && <IntelligenceView />}
      {currentView === 'settings' && <SettingsView />}
    </AppShell>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
