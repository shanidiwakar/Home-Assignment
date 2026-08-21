import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AnalyticsContext = createContext(null);
export function AnalyticsProvider({ children }) {
  const [events, setEvents] = useState([]);
  const log = useCallback((name, metadata = {}) => {
    const event = { name, timestamp: new Date().toISOString(), ...metadata };
    console.log('[analytics]', event);
    setEvents((current) => [...current.slice(-49), event]);
  }, []);
  const value = useMemo(() => ({ events, log }), [events, log]);
  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}
export function useAnalytics() { const context = useContext(AnalyticsContext); if (!context) throw new Error('useAnalytics must be used inside AnalyticsProvider'); return context; }
