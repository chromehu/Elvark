'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { Logo } from '@/components/shared/Logo';
import { useToast } from '@/components/providers/ToastProvider';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(true);
  const [validCode, setValidCode] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setValidCode(true);
      } else {
        setValidCode(false);
      }
      setVerifying(false);
    };
    verifySession();
  }, []);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('A jelszó legalább 8 karakter hosszú legyen.');
      return;
    }
    if (password !== confirmPassword) {
      setError('A jelszavak nem egyeznek.');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setLoading(false);
      setError('A jelszó frissítése sikertelen. Lehet, hogy a link lejárt. Kérjük, kérj új linket.');
      return;
    }

    setLoading(false);
    showToast('Jelszavad sikeresen frissítve.', 'success');
    router.push('/fiokom');
  };

  if (verifying) {
    return (
      <PageContainer>
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <Loader2 className="w-8 h-8 text-cobalt-600 animate-spin mx-auto" />
          <p className="text-sm text-gray-500 mt-4">Link ellenőrzése...</p>
        </div>
      </PageContainer>
    );
  }

  if (!validCode) {
    return (
      <PageContainer>
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <h1 className="text-2xl font-bold text-navy-900">Jelszó visszaállítás</h1>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="font-semibold text-navy-900">A link érvénytelen vagy lejárt</p>
            <p className="text-sm text-gray-500 mt-2">
              A jelszó visszaállítási link érvénytelen vagy már lejárt. Kérjük, kérj új linket.
            </p>
            <Link
              href="/elfelejtett-jelszo"
              className="inline-flex items-center gap-2 mt-6 text-sm text-cobalt-600 font-medium hover:text-cobalt-700"
            >
              Új link kérése <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-navy-900">Új jelszó beállítása</h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="new-password" className="text-sm font-medium text-navy-700 mb-1.5 block">Új jelszó</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="new-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div>
              <label htmlFor="confirm-password" className="text-sm font-medium text-navy-700 mb-1.5 block">Jelszó megerősítése</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cobalt-600 text-white font-medium hover:bg-cobalt-700 transition-colors shadow-soft disabled:opacity-60 min-h-[44px]"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Mentés...</>
              ) : (
                <>Jelszó mentése <CheckCircle2 className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </PageContainer>
  );
}
