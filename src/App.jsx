import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AppShell from './components/layout/AppShell';
import DashboardView from './components/dashboard/DashboardView';
import SalesPage from './components/pages/SalesPage';
import OrdersPage from './components/pages/OrdersPage';
import CustomersPage from './components/pages/CustomersPage';
import ProductsPage from './components/pages/ProductsPage';
import ReportsPage from './components/pages/ReportsPage';
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
      {currentView === 'sales' && <SalesPage />}
      {currentView === 'orders' && <OrdersPage />}
      {currentView === 'customers' && <CustomersPage />}
      {currentView === 'products' && <ProductsPage />}
      {currentView === 'reports' && <ReportsPage />}
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
