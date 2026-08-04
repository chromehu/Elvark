'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { Logo } from '@/components/shared/Logo';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setLoading(true);

    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/jelszo-visszaallitas`,
    });

    // Always show success message regardless of whether email exists
    setLoading(false);
    setSent(true);
  };

  return (
    <PageContainer>
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-navy-900">Elfelejtett jelszó</h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
          {sent ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="font-semibold text-navy-900">E-mail elküldve</p>
              <p className="text-sm text-gray-500 mt-2">
                Ha a megadott e-mail-cím regisztrálva van, elküldtük a jelszó visszaállítási linket.
                Kérjük, ellenőrizd a postaládádat.
              </p>
              <Link
                href="/belepes"
                className="inline-flex items-center gap-2 mt-6 text-sm text-cobalt-600 font-medium hover:text-cobalt-700"
              >
                Vissza a bejelentkezéshez <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6">
                Add meg az e-mail-címedet, és elküldjük a jelszó visszaállítási linket.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="forgot-email" className="text-sm font-medium text-navy-700 mb-1.5 block">E-mail-cím</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="pelda@email.hu"
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
                    <><Loader2 className="w-4 h-4 animate-spin" /> Küldés...</>
                  ) : (
                    <>Visszaállítási link küldése <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
              <Link
                href="/belepes"
                className="block text-sm text-cobalt-600 font-medium hover:text-cobalt-700 text-center mt-4"
              >
                Vissza a bejelentkezéshez
              </Link>
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
