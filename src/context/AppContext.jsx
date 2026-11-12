import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { api, API_BASE_URL } from '../services/api.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const VALID_VIEWS = [
    'dashboard',
    'cases',
    'case-detail',
    'investigations',
    'support',
    'support-faq',
    'support-ask',
    'support-complaint',
    'support-my-cases',
    'intelligence',
    'patterns',
    'prevention',
    'settings'
  ];

  const getInitialView = () => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const h = window.location.hash.replace('#', '').toLowerCase();
      if (VALID_VIEWS.includes(h)) {
        return h;
      }
    }
    return 'dashboard';
  };

  const [currentView, setCurrentViewState] = useState(getInitialView);

  const setCurrentView = useCallback((view) => {
    setCurrentViewState(view);
    if (typeof window !== 'undefined' && window.location.hash !== `#${view}`) {
      window.location.hash = view;
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const h = window.location.hash.replace('#', '').toLowerCase();
      if (h && VALID_VIEWS.includes(h)) {
        setCurrentViewState(h);
        if (h === 'support-faq') setSupportMode('faq');
        else if (h === 'support-ask') setSupportMode('ask');
        else if (h === 'support-complaint') setSupportMode('complaint');
        else if (h === 'support-my-cases') setSupportMode('my-cases');
        else if (h === 'support') setSupportMode('overview');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  const [selectedCaseId, setSelectedCaseId] = useState('ARG-1042');
  const [currentCase, setCurrentCase] = useState(null);
  const [isCaseLoading, setIsCaseLoading] = useState(false);
  const [caseLoadError, setCaseLoadError] = useState(null);
  
  // Backend connectivity state
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking' | 'connected' | 'offline'
  const [backendInfo, setBackendInfo] = useState(null);

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
  const [caseSearchQuery, setCaseSearchQuery] = useState('');

  // Shell & Navigation state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  // Request race-condition guard & toast timers map
  const activeFetchIdRef = useRef(0);
  const toastTimersRef = useRef(new Map());

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  // Toast removal helper with timer cancellation
  const removeToast = useCallback((id) => {
    if (toastTimersRef.current.has(id)) {
      clearTimeout(toastTimersRef.current.get(id));
      toastTimersRef.current.delete(id);
    }
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Toast helper: deduplicates identical alerts, supports custom duration/persistent, cleans up timers
  const addToast = useCallback((toast) => {
    if (!toast) return;

    setToasts(prev => {
      // Prevent duplicate notifications if one with the same title & message is already active
      const existing = prev.find(
        t => t.title === toast.title && t.message === toast.message
      );
      if (existing) {
        // Reset timer if temporary
        if (toastTimersRef.current.has(existing.id)) {
          clearTimeout(toastTimersRef.current.get(existing.id));
          const duration = toast.duration !== undefined ? toast.duration : 3800;
          if (duration > 0 && !toast.persistent) {
            const timer = setTimeout(() => {
              removeToast(existing.id);
            }, duration);
            toastTimersRef.current.set(existing.id, timer);
          }
        }
        return prev;
      }

      const id = toast.id || (Date.now() + Math.random().toString(36).substring(2, 6));
      const duration = toast.duration !== undefined ? toast.duration : 3800;
      const newToast = { id, type: 'info', ...toast };

      if (duration > 0 && !toast.persistent) {
        const timer = setTimeout(() => {
          removeToast(id);
        }, duration);
        toastTimersRef.current.set(id, timer);
      }

      const updated = [...prev, newToast];
      // Keep maximum 4 toasts visible so they never overflow screen height
      if (updated.length > 4) {
        const oldest = updated[0];
        if (toastTimersRef.current.has(oldest.id)) {
          clearTimeout(toastTimersRef.current.get(oldest.id));
          toastTimersRef.current.delete(oldest.id);
        }
        return updated.slice(1);
      }
      return updated;
    });
  }, [removeToast]);

  // Clear stale querying or loading notifications when navigating between views
  const clearTransientToasts = useCallback(() => {
    setToasts(prev => {
      return prev.filter(t => {
        if (t.type === 'error' || t.persistent) return true;
        const title = (t.title || '').toLowerCase();
        if (title.includes('querying') || title.includes('filtering') || title.includes('navigat') || t.type === 'loading') {
          if (toastTimersRef.current.has(t.id)) {
            clearTimeout(toastTimersRef.current.get(t.id));
            toastTimersRef.current.delete(t.id);
          }
          return false;
        }
        return true;
      });
    });
  }, []);

  // Auto-clear transient notifications on view navigation
  useEffect(() => {
    clearTransientToasts();
  }, [currentView, clearTransientToasts]);

  const triggerRefresh = useCallback(() => {
    setRefreshCounter(prev => prev + 1);
  }, []);

  // Check Backend Health on mount & refresh
  const checkBackendHealth = useCallback(async () => {
    try {
      const health = await api.checkHealth();
      if (health.online) {
        setBackendStatus('connected');
        setBackendInfo(health);
      } else {
        setBackendStatus('offline');
        setBackendInfo(health);
      }
      return health;
    } catch {
      setBackendStatus('offline');
      setBackendInfo(null);
      return { online: false };
    }
  }, []);

  useEffect(() => {
    checkBackendHealth();
  }, [checkBackendHealth, refreshCounter]);

  // Fetch current case whenever selectedCaseId or refreshCounter changes
  useEffect(() => {
    if (!selectedCaseId) return;
    const fetchId = ++activeFetchIdRef.current;
    setIsCaseLoading(true);
    setCaseLoadError(null);

    api.getCaseById(selectedCaseId)
      .then(caseData => {
        if (fetchId === activeFetchIdRef.current) {
          setCurrentCase(caseData);
          setIsCaseLoading(false);
        }
      })
      .catch(err => {
        if (fetchId === activeFetchIdRef.current) {
          console.error(err);
          setIsCaseLoading(false);
          setCaseLoadError(err.message);
          addToast({
            type: 'error',
            title: 'Failed to load case',
            message: `Case ${selectedCaseId} could not be retrieved: ${err.message}`
          });
        }
      });

    return () => {
      // Cleanup on unmount or id change
    };
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

  const navigateToSupport = useCallback((mode = 'overview') => {
    const validMode = (mode === 'customer' || mode === 'agent') ? 'complaint' : (mode || 'overview');
    setSupportMode(validMode);
    const viewMapping = {
      overview: 'support',
      faq: 'support-faq',
      ask: 'support-ask',
      complaint: 'support-complaint',
      'my-cases': 'support-my-cases'
    };
    const targetView = viewMapping[validMode] || 'support';
    setCurrentView(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setCurrentView]);

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
        message: api.isLiveBackend()
          ? 'Case registered in backend SQLite store. Diagnostic agents deployed.'
          : 'Case registered in local session store. Diagnostic agents deployed.'
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
        message: `Case ${caseId} transitioned to "${newStatus}".`
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
    caseLoadError,
    backendStatus,
    backendInfo,
    checkBackendHealth,
    apiBaseUrl: API_BASE_URL,
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
    clearTransientToasts,
    caseSearchQuery,
    setCaseSearchQuery,
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
