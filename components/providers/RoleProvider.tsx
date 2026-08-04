'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

export type DemoRole = 'hallgato' | 'oktato' | 'admin';

export const roleLabels: Record<DemoRole, string> = {
  hallgato: 'Hallgatói nézet',
  oktato: 'Oktatói nézet',
  admin: 'Admin nézet',
};

interface RoleContextValue {
  role: DemoRole;
  setRole: (role: DemoRole) => void;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

const STORAGE_KEY = 'elvark-demo-role';

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<DemoRole>('hallgato');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as DemoRole | null;
      if (stored && ['hallgato', 'oktato', 'admin'].includes(stored)) {
        setRoleState(stored);
      }
    } catch {
      // localStorage not available
    }
  }, []);

  const setRole = useCallback((r: DemoRole) => {
    setRoleState(r);
    try {
      localStorage.setItem(STORAGE_KEY, r);
    } catch {
      // localStorage not available
    }
  }, []);

  const value = useMemo(() => ({ role, setRole }), [role, setRole]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}
