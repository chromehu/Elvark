'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle, Loader2, MailCheck } from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { Logo } from '@/components/shared/Logo';
import { useToast } from '@/components/providers/ToastProvider';
import { createClient } from '@/lib/supabase/client';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  privacy?: string;
}

function mapAuthError(message: string): string {
  if (message.includes('already registered') || message.includes('already been registered')) {
    return 'Ez az e-mail-cím már regisztrálva van. Próbálj meg bejelentkezni.';
  }
  if (message.includes('Password should be at least')) {
    return 'A jelszónak legalább 6 karakter hosszúnak kell lennie.';
  }
  if (message.includes('Invalid email') || message.includes('invalid')) {
    return 'Érvénytelen e-mail-cím.';
  }
  if (message.includes('rate limit') || message.includes('RateLimit')) {
    return 'Túl sok próbálkozás. Kérjük, próbáld újra később.';
  }
  return 'A regisztráció során hiba történt. Kérjük, próbáld újra.';
}

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!name.trim()) e.name = 'A teljes név megadása kötelező.';
    else if (name.trim().length < 3) e.name = 'A név túl rövid.';
    if (!email.trim()) e.email = 'Az e-mail-cím megadása kötelező.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Érvénytelen e-mail-cím.';
    if (!password) e.password = 'A jelszó megadása kötelező.';
    else if (password.length < 8) e.password = 'A jelszó legalább 8 karakter hosszú legyen.';
    if (password !== confirmPassword) e.confirmPassword = 'A jelszavak nem egyeznek.';
    if (!termsAccepted) e.terms = 'Az ÁSZF elfogadása kötelező.';
    if (!privacyAccepted) e.privacy = 'Az adatkezelési tájékoztató elfogadása kötelező.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim() },
      },
    });

    if (error) {
      setLoading(false);
      showToast(mapAuthError(error.message), 'warning');
      return;
    }

    // Check if email confirmation is required (no session returned)
    if (data.user && !data.session) {
      setLoading(false);
      setNeedsConfirmation(true);
      return;
    }

    // If we got a session, user is logged in
    setSuccess(true);
    showToast('Sikeres regisztráció. Üdvözlünk az ELVARK-on!', 'success');

    const redirect = searchParams.get('redirect') || '/fiokom';
    setTimeout(() => router.push(redirect), 1200);
  };

  return (
    <PageContainer>
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-navy-900">Regisztráció</h1>
          <p className="text-gray-500 mt-2">Csatlakozz az ELVARK közösséghez</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
          {needsConfirmation ? (
            <div className="text-center py-8">
              <MailCheck className="w-12 h-12 text-cobalt-600 mx-auto mb-4" />
              <p className="font-semibold text-navy-900">Erősítsd meg az e-mail-címed</p>
              <p className="text-sm text-gray-500 mt-2">
                Elküldtük a megerősítő linket a <span className="font-medium text-navy-700">{email}</span> címre.
                Kattints a levélben lévő linkre a regisztráció befejezéséhez.
              </p>
              <Link
                href="/belepes"
                className="inline-flex items-center gap-2 mt-6 text-sm text-cobalt-600 font-medium hover:text-cobalt-700"
              >
                Tovább a bejelentkezéshez <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : success ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="font-semibold text-navy-900">Sikeres regisztráció!</p>
              <p className="text-sm text-gray-500 mt-2">Átirányítás a fiókodba...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-6 p-3 rounded-xl bg-navy-50 text-sm text-navy-700">
                <User className="w-4 h-4 flex-shrink-0" />
                <span>Minden regisztráció hallgatóként kezdődik. Később oktatói jelentkezést is benyújthatsz.</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="reg-name" className="text-sm font-medium text-navy-700 mb-1.5 block">Teljes név</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="reg-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Kovács Péter"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'reg-name-error' : undefined}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.name && <p id="reg-name-error" className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="reg-email" className="text-sm font-medium text-navy-700 mb-1.5 block">E-mail-cím</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="reg-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="pelda@email.hu"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'reg-email-error' : undefined}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.email && <p id="reg-email-error" className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="reg-password" className="text-sm font-medium text-navy-700 mb-1.5 block">Jelszó</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="reg-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? 'reg-password-error' : undefined}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.password && <p id="reg-password-error" className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="reg-confirm" className="text-sm font-medium text-navy-700 mb-1.5 block">Jelszó megerősítése</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="reg-confirm"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={errors.confirmPassword ? 'reg-confirm-error' : undefined}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.confirmPassword && <p id="reg-confirm-error" className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.confirmPassword}</p>}
                </div>

                <div className="space-y-2 pt-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="w-4 h-4 rounded mt-0.5" />
                    <span className="text-sm text-navy-700">Elfogadom az <Link href="/aszf" className="text-cobalt-600 hover:text-cobalt-700 underline">Általános Szerződési Feltételeket</Link>.</span>
                  </label>
                  {errors.terms && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.terms}</p>}

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)} className="w-4 h-4 rounded mt-0.5" />
                    <span className="text-sm text-navy-700">Elfogadom az <Link href="/adatkezeles" className="text-cobalt-600 hover:text-cobalt-700 underline">adatkezelési tájékoztatót</Link>.</span>
                  </label>
                  {errors.privacy && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.privacy}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cobalt-600 text-white font-medium hover:bg-cobalt-700 transition-colors shadow-soft disabled:opacity-60 min-h-[44px]"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Regisztráció folyamatban...</>
                  ) : (
                    <>Regisztráció <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </>
          )}

          <p className="text-sm text-gray-500 text-center mt-4">
            Már van fiókod?{' '}
            <Link href="/belepes" className="text-cobalt-600 font-medium hover:text-cobalt-700">
              Jelentkezz be
            </Link>
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
