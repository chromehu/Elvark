'use client';

import { RoleProvider } from './RoleProvider';
import { ToastProvider } from './ToastProvider';
import { AuthProvider } from './AuthProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RoleProvider>
        <ToastProvider>{children}</ToastProvider>
      </RoleProvider>
    </AuthProvider>
  );
}
