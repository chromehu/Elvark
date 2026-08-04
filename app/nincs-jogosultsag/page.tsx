'use client';

import Link from 'next/link';
import { ShieldX, ArrowRight } from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { Logo } from '@/components/shared/Logo';

export default function AccessDeniedPage() {
  return (
    <PageContainer>
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <ShieldX className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-navy-900">Nincs jogosultság</h1>
          <p className="text-gray-500 mt-3">
            Nincs jogosultságod ennek a oldalnak a megtekintéséhez.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cobalt-600 text-white font-medium hover:bg-cobalt-700 transition-colors mt-6"
          >
            Vissza a főoldalra <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
