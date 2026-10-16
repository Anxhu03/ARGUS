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

  // Shell & Navigation state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

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

  const updateCaseStatus = useCallback(async (caseId, newStatus, reason = '') => {
    try {
      const updated = await api.updateCaseStatus(caseId, newStatus, reason);
      if (selectedCaseId === caseId) {
        setCurrentCase(updated);
      }
      triggerRefresh();
      addToast({
        type: 'success',
        title: 'Status Updated',
        message: `Case ${caseId} status transitioned to "${newStatus}".`
      });
      return updated;
    } catch (err) {
      addToast({ type: 'error', title: 'Update Failed', message: err.message });
      throw err;
    }
  }, [selectedCaseId, triggerRefresh, addToast]);

  const updateCasePriority = useCallback(async (caseId, newPriority) => {
    try {
      const updated = await api.updateCasePriority(caseId, newPriority);
      if (selectedCaseId === caseId) {
        setCurrentCase(updated);
      }
      triggerRefresh();
      addToast({
        type: 'info',
        title: 'Priority Adjusted',
        message: `Case ${caseId} priority set to ${newPriority}.`
      });
      return updated;
    } catch (err) {
      addToast({ type: 'error', title: 'Update Failed', message: err.message });
      throw err;
    }
  }, [selectedCaseId, triggerRefresh, addToast]);

  const assignCaseTeam = useCallback(async (caseId, team, agent) => {
    try {
      const updated = await api.assignCaseTeam(caseId, team, agent);
      if (selectedCaseId === caseId) {
        setCurrentCase(updated);
      }
      triggerRefresh();
      addToast({
        type: 'info',
        title: 'Assignment Updated',
        message: `Case ${caseId} assigned to ${team} (${agent}).`
      });
      return updated;
    } catch (err) {
      addToast({ type: 'error', title: 'Assignment Failed', message: err.message });
      throw err;
    }
  }, [selectedCaseId, triggerRefresh, addToast]);

  const addCaseInternalNote = useCallback(async (caseId, note) => {
    try {
      const updated = await api.addCaseInternalNote(caseId, note);
      if (selectedCaseId === caseId) {
        setCurrentCase(updated);
      }
      triggerRefresh();
      addToast({
        type: 'success',
        title: 'Internal Note Added',
        message: `Note recorded to case ${caseId} audit log.`
      });
      return updated;
    } catch (err) {
      addToast({ type: 'error', title: 'Note Failed', message: err.message });
      throw err;
    }
  }, [selectedCaseId, triggerRefresh, addToast]);

  const recordProposedResolution = useCallback(async (caseId, resolution) => {
    try {
      const updated = await api.updateCaseResolution(caseId, resolution);
      if (selectedCaseId === caseId) {
        setCurrentCase(updated);
      }
      triggerRefresh();
      addToast({
        type: 'success',
        title: 'Resolution Formulated',
        message: `Proposed resolution recorded for case ${caseId}.`
      });
      return updated;
    } catch (err) {
      addToast({ type: 'error', title: 'Resolution Failed', message: err.message });
      throw err;
    }
  }, [selectedCaseId, triggerRefresh, addToast]);

  const escalateCase = useCallback(async (caseId, reason, riskLevel = 'High') => {
    try {
      const updated = await api.escalateCaseToHuman(caseId, reason, riskLevel);
      if (selectedCaseId === caseId) {
        setCurrentCase(updated);
      }
      triggerRefresh();
      addToast({
        type: 'warning',
        title: 'Case Escalated to Specialist',
        message: `Case ${caseId} marked for human review (${riskLevel} Risk).`
      });
      return updated;
    } catch (err) {
      addToast({ type: 'error', title: 'Escalation Failed', message: err.message });
      throw err;
    }
  }, [selectedCaseId, triggerRefresh, addToast]);

  const approveCaseResolution = useCallback(async (caseId) => {
    try {
      const updated = await api.approveResolution(caseId);
      if (selectedCaseId === caseId) {
        setCurrentCase(updated);
      }
      triggerRefresh();
      addToast({
        type: 'success',
        title: 'Resolution Approved',
        message: `Case ${caseId} marked as Resolved. Automated system actions authorized.`
      });
      return updated;
    } catch (err) {
      addToast({ type: 'error', title: 'Approval Failed', message: err.message });
      throw err;
    }
  }, [selectedCaseId, triggerRefresh, addToast]);

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
    startInvestigationFromSupport,
    updateCaseStatus,
    updateCasePriority,
    assignCaseTeam,
    addCaseInternalNote,
    recordProposedResolution,
    escalateCase,
    approveCaseResolution,
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebar,
    globalSearchOpen,
    setGlobalSearchOpen,
    unreadNotifications,
    setUnreadNotifications
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
