import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'cases' | 'case-detail' | 'support' | 'intelligence' | 'settings'
  const [selectedCaseId, setSelectedCaseId] = useState('ARG-1042');
  const [currentCase, setCurrentCase] = useState(null);
  const [isCaseLoading, setIsCaseLoading] = useState(false);
  
  // Support state
  const [supportMode, setSupportMode] = useState('faq'); // 'faq' | 'agent'
  const [selectedFaq, setSelectedFaq] = useState(null);

  // Investigation drawer / modal state
  const [selectedAgentId, setSelectedAgentId] = useState(null); // 'billing' | 'order' | 'tech' | 'coordinator' | null
  const [activeModal, setActiveModal] = useState(null); // 'evidence' | 'escalate' | 'resolve' | null

  // System stats & toast notifications
  const [kpis, setKpis] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Toast helper
  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, type: 'info', ...toast };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshCounter(prev => prev + 1);
  }, []);

  // Fetch current case whenever selectedCaseId changes
  useEffect(() => {
    if (!selectedCaseId) return;
    let isMounted = true;
    setIsCaseLoading(true);

    api.getCaseById(selectedCaseId)
      .then(caseData => {
        if (isMounted) {
          setCurrentCase(caseData);
          setIsCaseLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error(err);
          setIsCaseLoading(false);
          addToast({
            type: 'error',
            title: 'Failed to load case',
            message: `Case ${selectedCaseId} could not be retrieved.`
          });
        }
      });

    return () => { isMounted = false; };
  }, [selectedCaseId, refreshCounter, addToast]);

  // Load KPIs
  useEffect(() => {
    let isMounted = true;
    api.getKpiStats()
      .then(stats => {
        if (isMounted) setKpis(stats);
      })
      .catch(console.error);

    return () => { isMounted = false; };
  }, [refreshCounter]);

  // Navigation helpers
  const navigateToCase = useCallback((caseId) => {
    setSelectedCaseId(caseId);
    setCurrentView('case-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateToSupport = useCallback((mode = 'faq') => {
    setSupportMode(mode);
    setCurrentView('support');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const startInvestigationFromSupport = useCallback(async (payload) => {
    try {
      addToast({
        type: 'info',
        title: 'Mobilizing ARGUS Agents',
        message: 'Classifying complaint and provisioning multi-agent investigation pipeline...'
      });

      const newCase = await api.createCaseFromSupport(payload);
      triggerRefresh();
      
      addToast({
        type: 'success',
        title: `Case Created: ${newCase.id}`,
        message: 'Billing, Order, and Technical agents deployed in parallel.'
      });

      setSelectedCaseId(newCase.id);
      setCurrentView('case-detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return newCase;
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Investigation Launch Error',
        message: err.message
      });
      throw err;
    }
  }, [addToast, triggerRefresh]);

  const value = {
    currentView,
    setCurrentView,
    selectedCaseId,
    setSelectedCaseId,
    currentCase,
    setCurrentCase,
    isCaseLoading,
    navigateToCase,
    navigateToSupport,
    supportMode,
    setSupportMode,
    selectedFaq,
    setSelectedFaq,
    selectedAgentId,
    setSelectedAgentId,
    activeModal,
    setActiveModal,
    kpis,
    toasts,
    addToast,
    removeToast,
    triggerRefresh,
    startInvestigationFromSupport
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
