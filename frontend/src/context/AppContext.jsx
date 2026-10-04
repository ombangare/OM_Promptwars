import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { API_BASE, request } from '../lib/api';
import { supabase } from '../lib/supabase';

const AppContext = createContext(null);

function normalizeUser(user) {
  if (!user) return null;
  const metadata = user.user_metadata || {};
  return {
    id: user.id,
    email: user.email || '',
    name: metadata.full_name || metadata.name || user.email?.split('@')[0] || 'MindXray User',
    picture: metadata.avatar_url || metadata.picture || null,
  };
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [decision, setDecision] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const applySession = useCallback((nextSession) => {
    setSession(nextSession || null);
    setUser(normalizeUser(nextSession?.user));
  }, []);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      applySession(data.session);
      setLoadingAuth(false);
    }).catch(() => {
      if (mounted) setLoadingAuth(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession);
      setLoadingAuth(false);
      if (!nextSession) {
        setDecision(null);
        setAnalysis(null);
        setHistory([]);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [applySession]);

  const refreshHistory = useCallback(async () => {
    if (!session?.access_token) return;
    setHistoryLoading(true);
    try {
      const rows = await request('/api/v1/analysis/history', {}, session.access_token);
      setHistory(rows.items || []);
    } finally {
      setHistoryLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    if (session?.access_token) refreshHistory().catch(() => {});
  }, [session?.access_token, refreshHistory]);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
  }, []);

  const signInWithPassword = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUpWithPassword = useCallback(async (email, password) => {
    const { error, data } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setDecision(null);
    setAnalysis(null);
    setHistory([]);
  }, []);

  const api = useCallback(async (path, options = {}) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error('Your session is missing or expired. Please sign in again.');
    try {
      return await request(path, options, token);
    } catch (error) {
      if (/expired|invalid|authentication required/i.test(error.message)) {
        await supabase.auth.signOut();
      }
      throw error;
    }
  }, []);

  const loadAnalysisItem = useCallback(async (analysisId) => {
    const data = await api(`/api/v1/analysis/history/${analysisId}`);
    setDecision(data.decision);
    setAnalysis(data.analysis);
    return data;
  }, [api]);

  const deleteHistoryItem = useCallback(async (decisionId) => {
    await api(`/api/v1/analysis/history/${decisionId}`, { method: 'DELETE' });
    setHistory((prev) => prev.filter((x) => x.decision_id !== decisionId));
    if (decision?.id === decisionId) {
      setDecision(null);
      setAnalysis(null);
    }
  }, [api, decision?.id]);

  const value = useMemo(() => ({
    user, session, token: session?.access_token || null, loadingAuth,
    decision, analysis, history, historyLoading,
    setDecision, setAnalysis,
    signInWithGoogle, signInWithPassword, signUpWithPassword, logout,
    api, refreshHistory, loadAnalysisItem, deleteHistoryItem, API_BASE,
  }), [user, session, loadingAuth, decision, analysis, history, historyLoading, signInWithGoogle, signInWithPassword, signUpWithPassword, logout, api, refreshHistory, loadAnalysisItem, deleteHistoryItem]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
