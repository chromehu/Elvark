'use client';

import { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';
import { DEMO_MODE } from '@/lib/config';

const STORAGE_KEY = 'elvark-demo-banner-dismissed';

export function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'true') setDismissed(true);
    } catch {
      // localStorage not available
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // localStorage not available
    }
  };

  if (!mounted || !DEMO_MODE || dismissed) return null;

  return (
    <div className="bg-cobalt-600 text-white text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <p className="truncate leading-tight">
            <span className="hidden sm:inline">Az ELVARK jelenleg bemutató verzió. A megjelenített adatok és tranzakciók mintaadatok.</span>
            <span className="sm:hidden">Bemutató verzió – mintaadatok.</span>
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 rounded hover:bg-cobalt-700 transition-colors flex-shrink-0"
          aria-label="Bemutató sáv bezárása"
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}
