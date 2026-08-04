'use client';

import Link from 'next/link';
import { ShieldOff, ArrowRight } from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { Logo } from '@/components/shared/Logo';
import { useAuth } from '@/components/providers/AuthProvider';

export default function SuspendedAccountPage() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <PageContainer>
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <ShieldOff className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-xl font-bold text-navy-900">Fiók felfüggesztve</h1>
          <p className="text-gray-500 mt-3">
            A fiókod jelenleg nem elérhető. Ha úgy gondolod, hogy ez tévedés, kérjük, vedd fel a kapcsolatotot az ügyfélszolgálattal.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/kapcsolat"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cobalt-600 text-white font-medium hover:bg-cobalt-700 transition-colors"
            >
              Kapcsolatfelvétel <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-navy-700 font-medium border border-gray-200 hover:bg-navy-50 transition-colors"
            >
              Kijelentkezés
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
