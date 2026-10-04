import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AppShell from './components/layout/AppShell';
import DashboardView from './components/dashboard/DashboardView';
import CasesListView from './components/cases/CasesListView';
import CaseDetailView from './components/investigation/CaseDetailView';
import SupportView from './components/support/SupportView';
import IntelligenceView from './components/intelligence/IntelligenceView';
import SettingsView from './components/settings/SettingsView';
import EmptyState from './components/common/EmptyState';
import { Layers } from 'lucide-react';

function AppContent() {
  const { currentView, setCurrentView } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'cases':
      case 'support-my-cases':
        return <CasesListView />;
      case 'case-detail':
      case 'investigations':
        return <CaseDetailView />;
      case 'support':
      case 'support-faq':
      case 'support-ask':
      case 'support-complaint':
        return <SupportView />;
      case 'intelligence':
      case 'patterns':
      case 'prevention':
        return <IntelligenceView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <EmptyState
            icon={Layers}
            title="Module In Architectural Blueprint"
            description={`The requested module (${currentView}) is scheduled in the implementation roadmap.`}
            actionLabel="Return to Dashboard"
            onAction={() => setCurrentView('dashboard')}
          />
        );
    }
  };

  return <AppShell>{renderCurrentView()}</AppShell>;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
