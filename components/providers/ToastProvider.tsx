'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const iconMap = {
  success: CheckCircle2,
  info: Info,
  warning: AlertCircle,
};

const colorMap = {
  success: 'text-green-600',
  info: 'text-navy-600',
  warning: 'text-cobalt-600',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type];
          return (
            <div
              key={toast.id}
              className="flex items-start gap-3 bg-white rounded-xl shadow-soft-lg border border-gray-100 p-4 animate-slide-up pointer-events-auto"
              role="alert"
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${colorMap[toast.type]}`} />
              <p className="text-sm text-navy-900 flex-1">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Értesítés bezárása"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
