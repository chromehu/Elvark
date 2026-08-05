'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { Logo } from '@/components/shared/Logo';
import { useToast } from '@/components/providers/ToastProvider';
import { createClient } from '@/lib/supabase/client';
import { validateSafeRedirect } from '@/lib/redirect';

function mapAuthError(message: string): string {
  if (message.includes('Invalid login credentials')) {
    return 'Hibás e-mail-cím vagy jelszó.';
  }
  if (message.includes('Email not confirmed')) {
    return 'Az e-mail-cím még nincs megerősítve. Kérjük, ellenőrizd a postaládádat.';
  }
  if (message.includes('rate limit') || message.includes('RateLimit')) {
    return 'Túl sok próbálkozás. Kérjük, próbáld újra később.';
  }
  return 'A bejelentkezés során hiba történt. Kérjük, próbáld újra.';
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setLoading(false);
      setError(mapAuthError(error.message));
      return;
    }

    // Check if user profile is suspended
    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profile?.status === 'suspended') {
        await supabase.auth.signOut();
        setLoading(false);
        router.push('/fiok-felfuggesztve');
        return;
      }
    }

    showToast('Sikeres bejelentkezés.', 'success');
    const rawRedirect = searchParams.get('redirect');
    const safeRedirect = validateSafeRedirect(rawRedirect || '/fiokom');
    router.push(safeRedirect);
  };

  return (
    <PageContainer>
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-navy-900">Bejelentkezés</h1>
          <p className="text-gray-500 mt-2">Jelentkezz be az ELVARK fiókodba</p>
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
              <label htmlFor="login-email" className="text-sm font-medium text-navy-700 mb-1.5 block">E-mail-cím</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pelda@email.hu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div>
              <label htmlFor="login-password" className="text-sm font-medium text-navy-700 mb-1.5 block">Jelszó</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Link href="/elfelejtett-jelszo" className="text-xs text-cobalt-600 hover:text-cobalt-700 font-medium">
                Elfelejtetted a jelszavad?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cobalt-600 text-white font-medium hover:bg-cobalt-700 transition-colors shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Bejelentkezés...</>
              ) : (
                <>Bejelentkezés <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
          <p className="text-sm text-gray-500 text-center mt-4">
            Még nincs fiókod?{' '}
            <Link href="/regisztracio" className="text-cobalt-600 font-medium hover:text-cobalt-700">
              Regisztrálj itt
            </Link>
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
