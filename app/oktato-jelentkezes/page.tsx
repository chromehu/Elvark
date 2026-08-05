'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap, User, Globe, Briefcase, BookOpen,
  CheckCircle2, XCircle, AlertCircle, Loader2, ArrowRight, Clock, Send
} from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { useToast } from '@/components/providers/ToastProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { validateAndNormalizeUrl, getUrlErrorMessage } from '@/lib/url-validation';
import { INSTRUCTOR_TERMS_VERSION } from '@/lib/legal-versions';

interface InstructorProfile {
  user_id: string;
  public_name: string;
  professional_title: string;
  biography: string;
  experience: string;
  teaching_topics: string;
  website_url: string | null;
  social_url: string | null;
  application_message: string;
  approval_status: ApprovalStatus;
  rejection_reason: string | null;
  applied_at: string | null;
}

interface FormErrors {
  fullName?: string;
  instructorName?: string;
  profession?: string;
  bio?: string;
  experience?: string;
  topics?: string;
  website?: string;
  linkedin?: string;
  motivation?: string;
  contentOwnership?: string;
  termsAccepted?: string;
}

const APPROVAL_STATUSES = [
  'pending',
  'approved',
  'rejected',
  'suspended',
] as const;

type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

const isApprovalStatus = (value: unknown): value is ApprovalStatus =>
  typeof value === 'string' &&
  APPROVAL_STATUSES.includes(value as ApprovalStatus);

export default function InstructorApplicationPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();

  const [existingApp, setExistingApp] = useState<InstructorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionCompleted, setSubmissionCompleted] = useState(false);
  const [refreshFailedAfterSubmission, setRefreshFailedAfterSubmission] = useState(false);
  const [applicationLoadError, setApplicationLoadError] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [fullName, setFullName] = useState('');
  const [instructorName, setInstructorName] = useState('');
  const [profession, setProfession] = useState('');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('');
  const [topics, setTopics] = useState('');
  const [website, setWebsite] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [motivation, setMotivation] = useState('');
  const [contentOwnership, setContentOwnership] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/belepes?redirect=/oktato-jelentkezes');
      return;
    }

    let cancelled = false;

    const fetchApplication = async () => {
      setApplicationLoadError(false);

      try {
        const supabase = createClient();
        const {
          data,
          error: fetchError,
        } = await supabase
          .from('instructor_profiles')
          .select('user_id, public_name, professional_title, biography, experience, teaching_topics, website_url, social_url, application_message, approval_status, rejection_reason, applied_at')
          .eq('user_id', user.id)
          .maybeSingle();

        if (cancelled) return;

        if (fetchError) {
          setApplicationLoadError(true);
          return;
        }

        if (data) {
          if (!isApprovalStatus(data.approval_status)) {
            setApplicationLoadError(true);
            return;
          }

          const app = data as InstructorProfile;
          setExistingApp(app);
          setInstructorName(app.public_name || '');
          setProfession(app.professional_title || '');
          setBio(app.biography || '');
          setExperience(app.experience || '');
          setTopics(app.teaching_topics || '');
          setWebsite(app.website_url || '');
          setLinkedin(app.social_url || '');
          setMotivation(app.application_message || '');
        } else {
          setExistingApp(null);
          setFullName(profile?.full_name || '');
        }
      } catch (exception) {
        if (cancelled) return;

        setApplicationLoadError(true);

        if (process.env.NODE_ENV === 'development') {
          console.error(
            'Unexpected instructor application loading error:',
            exception
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchApplication();

    return () => {
      cancelled = true;
    };
  }, [user, profile, authLoading, router]);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!existingApp && !fullName.trim()) e.fullName = 'A teljes név megadása kötelező.';
    if (!instructorName.trim()) e.instructorName = 'Az oktatói név megadása kötelező.';
    if (!profession.trim()) e.profession = 'A szakmai megnevezés megadása kötelező.';
    if (!bio.trim()) e.bio = 'A bemutatkozás megadása kötelező.';
    else if (bio.trim().length < 20) e.bio = 'A bemutatkozás legalább 20 karakter hosszú legyen.';
    if (!experience.trim()) e.experience = 'A szakmai tapasztalat megadása kötelező.';
    if (!topics.trim()) e.topics = 'Az oktatási témakörök megadása kötelező.';
    if (!motivation.trim()) e.motivation = 'A motiváció megadása kötelező.';
    
    const websiteValidation = validateAndNormalizeUrl(website, true);
    const linkedinValidation = validateAndNormalizeUrl(linkedin, true);
    
    if (!websiteValidation.valid && website.trim()) {
      e.website = websiteValidation.error ? getUrlErrorMessage(websiteValidation.error) : 'Érvénytelen weboldal URL.';
    }
    if (!linkedinValidation.valid && linkedin.trim()) {
      e.linkedin = linkedinValidation.error ? getUrlErrorMessage(linkedinValidation.error) : 'Érvénytelen social média URL.';
    }
    
    if (!contentOwnership) e.contentOwnership = 'A tartalomtulajdonos nyilatkozat elfogadása kötelező.';
    if (!termsAccepted) e.termsAccepted = 'A feltételek elfogadása kötelező.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (submitting || submissionCompleted) {
      return;
    }
    if (!validate() || !user) return;
    setSubmitting(true);

    let rpcSucceeded = false;

    try {
      // Validate and normalize URLs
      const websiteValidation = validateAndNormalizeUrl(website, true);
      const linkedinValidation = validateAndNormalizeUrl(linkedin, true);

      // Stop submission if URL validation failed
      if (!websiteValidation.valid || !linkedinValidation.valid) {
        const urlErrors: FormErrors = {};
        if (!websiteValidation.valid && website.trim()) {
          urlErrors.website = websiteValidation.error ? getUrlErrorMessage(websiteValidation.error) : 'Érvénytelen weboldal URL.';
        }
        if (!linkedinValidation.valid && linkedin.trim()) {
          urlErrors.linkedin = linkedinValidation.error ? getUrlErrorMessage(linkedinValidation.error) : 'Érvénytelen social média URL.';
        }
        setErrors(e => ({ ...e, ...urlErrors }));
        return;
      }

      const supabase = createClient();
      
      let error;

      // Determine which RPC to call
      if (existingApp?.approval_status === 'rejected') {
        // Use protected RPC to resubmit rejected application
        ({ error } = await supabase.rpc('resubmit_instructor_application', {
          p_public_name: instructorName.trim(),
          p_professional_title: profession.trim(),
          p_biography: bio.trim(),
          p_experience: experience.trim(),
          p_teaching_topics: topics.trim(),
          p_website_url: websiteValidation.normalized,
          p_social_url: linkedinValidation.normalized,
          p_application_message: motivation.trim(),
          p_instructor_terms_version: INSTRUCTOR_TERMS_VERSION,
        }));
      } else if (!existingApp) {
        // Use protected RPC to submit new application
        ({ error } = await supabase.rpc('submit_instructor_application', {
          p_public_name: instructorName.trim(),
          p_professional_title: profession.trim(),
          p_biography: bio.trim(),
          p_experience: experience.trim(),
          p_teaching_topics: topics.trim(),
          p_website_url: websiteValidation.normalized,
          p_social_url: linkedinValidation.normalized,
          p_application_message: motivation.trim(),
          p_instructor_terms_version: INSTRUCTOR_TERMS_VERSION,
        }));
      } else {
        // No RPC path for existing pending, approved, or suspended application
        return;
      }

      if (error) {
        if (error.message?.includes('already pending') || error.message?.includes('existing')) {
          showToast('Már van folyamatban lévő oktatói jelentkezésed.', 'warning');
        } else {
          showToast('A jelentkezés beküldése sikertelen. Kérjük, próbáld újra.', 'warning');
          if (process.env.NODE_ENV === 'development') {
            console.error('Instructor application error:', error);
          }
        }
        return;
      }

      // RPC succeeded
      rpcSucceeded = true;
      setSubmissionCompleted(true);
      setRefreshFailedAfterSubmission(false);

      // Refresh application data with explicit column selection
      const {
        data: updated,
        error: refreshError,
      } = await supabase
        .from('instructor_profiles')
        .select('user_id, public_name, professional_title, biography, experience, teaching_topics, website_url, social_url, application_message, approval_status, rejection_reason, applied_at')
        .eq('user_id', user.id)
        .maybeSingle();

      // Check all refresh failure conditions
      if (refreshError || !updated || !isApprovalStatus(updated.approval_status) || updated.approval_status !== 'pending') {
        setRefreshFailedAfterSubmission(true);
        return;
      }

      setExistingApp(updated as InstructorProfile);
      showToast('Oktatói jelentkezésed sikeresen beküldve.', 'success');
    } catch (exception) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Unexpected error in handleSubmit:', exception);
      }

      if (rpcSucceeded) {
        setRefreshFailedAfterSubmission(true);
        showToast('A jelentkezésed mentése sikerült, de az oldal frissítése nem sikerült.', 'warning');
      } else {
        showToast('A jelentkezés beküldése sikertelen. Kérjük, próbáld újra.', 'warning');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-cobalt-600 animate-spin" />
        </div>
      </PageContainer>
    );
  }

  // Show error panel if application load failed
  if (applicationLoadError) {
    return (
      <PageContainer>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-3 border border-red-100">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-sm font-medium text-red-900 mb-1">A jelentkezési adatok betöltése nem sikerült.</p>
            <p className="text-sm text-red-700 mb-4">Kérjük, töltsd be újra az oldalt.</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors min-h-[44px]"
            >
              Oldal újratöltése
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Show blocked status if application is suspended
  if (existingApp && existingApp.approval_status === 'suspended') {
    return (
      <PageContainer>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 rounded-2xl border border-red-100 shadow-soft p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4 border border-red-100">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-xl font-bold text-red-900">Oktatói hozzáférés felfüggesztve</h1>
            <p className="text-red-700 mt-3">Az oktatói hozzáférésed jelenleg fel van függesztve. További információért vedd fel a kapcsolatot az ügyfélszolgálattal.</p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-red-700 font-medium border border-red-200 hover:bg-red-50 transition-colors min-h-[44px]"
              >
                Vissza a főoldalra
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Show status card if application exists and is pending or approved
  if (existingApp && (existingApp.approval_status === 'pending' || existingApp.approval_status === 'approved')) {
    const statusConfig = {
      pending: {
        icon: Clock,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        title: 'Jelentkezés elbírálás alatt',
        message: 'Az oktatói jelentkezésed ellenőrzés alatt áll. Hamarosan értesítünk az eredményről.',
      },
      approved: {
        icon: CheckCircle2,
        color: 'text-green-600',
        bg: 'bg-green-50',
        title: 'Jelentkezés jóváhagyva',
        message: 'Gratulálunk! Oktatói jelentkezésed jóváhagyásra került.',
      },
    };

    const config = statusConfig[existingApp.approval_status as 'pending' | 'approved'];
    const Icon = config.icon;

    return (
      <PageContainer>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className={`${config.bg} rounded-2xl border border-gray-100 shadow-soft p-8 text-center`}>
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4">
              <Icon className={`w-8 h-8 ${config.color}`} />
            </div>
            <h1 className="text-xl font-bold text-navy-900">{config.title}</h1>
            <p className="text-gray-600 mt-3">{config.message}</p>

            <div className="mt-6 text-left bg-white rounded-xl p-5 border border-gray-100">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-400">Oktatói név:</span> <span className="font-medium text-navy-900">{existingApp.public_name}</span></div>
                <div><span className="text-gray-400">Szakma:</span> <span className="font-medium text-navy-900">{existingApp.professional_title}</span></div>
                {existingApp.applied_at && (
                  <div><span className="text-gray-400">Beküldve:</span> <span className="font-medium text-navy-900">{new Date(existingApp.applied_at).toLocaleDateString('hu-HU')}</span></div>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              {existingApp.approval_status === 'approved' && (
                <button
                  onClick={() => router.push('/oktato')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cobalt-600 text-white font-medium hover:bg-cobalt-700 transition-colors min-h-[44px]"
                >
                  Oktatói felület megnyitása
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-navy-700 font-medium border border-gray-200 hover:bg-navy-50 transition-colors min-h-[44px]"
              >
                Vissza a főoldalra
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Show rejection reason and allow resubmission
  const isRejected = existingApp?.approval_status === 'rejected';

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-cobalt-50 text-cobalt-700 text-sm font-medium px-3 py-1.5 rounded-full mb-4">
            <GraduationCap className="w-4 h-4" />
            Oktatói jelentkezés
          </div>
          <h1 className="text-3xl font-bold text-navy-900">
            {isRejected ? 'Jelentkezés szerkesztése' : 'Légy oktató az ELVARK-on'}
          </h1>
          <p className="text-gray-600 mt-3">
            {isRejected
              ? 'A jelentkezésed elutasításra került. Szerkesztheted és újra beküldheted.'
              : 'Töltsd ki az alábbi jelentkezési űrlapot.'}
          </p>
        </div>

        {isRejected && existingApp?.rejection_reason && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">Elutasítás oka:</p>
              <p className="text-sm text-red-700 mt-1">{existingApp.rejection_reason}</p>
            </div>
          </div>
        )}

        {refreshFailedAfterSubmission ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-3 border border-amber-100">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <p className="text-sm font-medium text-amber-900 mb-1">A jelentkezésed mentése sikerült</p>
            <p className="text-sm text-amber-700 mb-4">de az oldal frissítése nem sikerült.</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors min-h-[44px]"
            >
              Oldal újratöltése
            </button>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 space-y-5" noValidate>
          {!existingApp && (
            <div>
              <label htmlFor="app-fullname" className="text-sm font-medium text-navy-700 mb-1.5 block">Teljes név</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input id="app-fullname" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Kovács Anna" aria-invalid={!!errors.fullName} maxLength={100} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all" />
              </div>
              {errors.fullName && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.fullName}</p>}
            </div>
          )}

          <div>
            <label htmlFor="app-instname" className="text-sm font-medium text-navy-700 mb-1.5 block">Nyilvános oktatói név</label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input id="app-instname" type="text" value={instructorName} onChange={(e) => setInstructorName(e.target.value)} placeholder="Kovács Anna oktató" aria-invalid={!!errors.instructorName} maxLength={100} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all" />
            </div>
            {errors.instructorName && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.instructorName}</p>}
          </div>

          <div>
            <label htmlFor="app-profession" className="text-sm font-medium text-navy-700 mb-1.5 block">Szakmai megnevezés</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input id="app-profession" type="text" value={profession} onChange={(e) => setProfession(e.target.value)} placeholder="pl. Pénzügyi tanácsadó és Excel szakértő" aria-invalid={!!errors.profession} maxLength={100} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all" />
            </div>
            {errors.profession && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.profession}</p>}
          </div>

          <div>
            <label htmlFor="app-bio" className="text-sm font-medium text-navy-700 mb-1.5 block">Rövid bemutatkozás</label>
            <textarea id="app-bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Írj egy rövid bemutatkozást magadról..." aria-invalid={!!errors.bio} maxLength={500} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all resize-none" />
            {errors.bio && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.bio}</p>}
          </div>

          <div>
            <label htmlFor="app-exp" className="text-sm font-medium text-navy-700 mb-1.5 block">Szakmai tapasztalat</label>
            <textarea id="app-exp" value={experience} onChange={(e) => setExperience(e.target.value)} rows={4} placeholder="Főbb szakmai tapasztalatok, korábbi munkahelyek, projektek..." aria-invalid={!!errors.experience} maxLength={1500} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all resize-none" />
            {errors.experience && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.experience}</p>}
          </div>

          <div>
            <label htmlFor="app-topics" className="text-sm font-medium text-navy-700 mb-1.5 block">Oktatási témakörök</label>
            <input id="app-topics" type="text" value={topics} onChange={(e) => setTopics(e.target.value)} placeholder="pl. Excel, pénzügyi tervezés, adatelemzés" aria-invalid={!!errors.topics} maxLength={255} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all" />
            {errors.topics && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.topics}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="app-web" className="text-sm font-medium text-navy-700 mb-1.5 block">Weboldal (opcionális)</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input id="app-web" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://pelda.hu" aria-invalid={!!errors.website} maxLength={255} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all" />
              </div>
              {errors.website && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.website}</p>}
            </div>
            <div>
              <label htmlFor="app-linkedin" className="text-sm font-medium text-navy-700 mb-1.5 block">LinkedIn / social (opcionális)</label>
              <div className="relative">
                <input id="app-linkedin" type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/pelda" aria-invalid={!!errors.linkedin} maxLength={255} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all" />
              </div>
              {errors.linkedin && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.linkedin}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="app-motivation" className="text-sm font-medium text-navy-700 mb-1.5 block">Miért szeretnél oktatni az ELVARK-on?</label>
            <textarea id="app-motivation" value={motivation} onChange={(e) => setMotivation(e.target.value)} rows={3} placeholder="Mi a motivációd az oktatásban?" aria-invalid={!!errors.motivation} maxLength={1000} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all resize-none" />
            {errors.motivation && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.motivation}</p>}
          </div>

          <div className="space-y-3 pt-2 border-t border-gray-100">
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={contentOwnership} onChange={(e) => setContentOwnership(e.target.checked)} className="w-4 h-4 rounded mt-0.5" />
              <span className="text-sm text-navy-700">Kijelentem, hogy a feltöltött tananyagok tartalmáért jogilag felelős vagyok, és rendelkezem a szükséges felhasználási jogokkal.</span>
            </label>
            {errors.contentOwnership && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.contentOwnership}</p>}

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="w-4 h-4 rounded mt-0.5" />
              <span className="text-sm text-navy-700">Elfogadom az <Link href="/aszf" className="text-cobalt-600 hover:text-cobalt-700 underline">ÁSZF</Link>-et és az <Link href="/adatkezeles" className="text-cobalt-600 hover:text-cobalt-700 underline">adatkezelési tájékoztatót</Link>.</span>
            </label>
            {errors.termsAccepted && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.termsAccepted}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting || submissionCompleted}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cobalt-600 text-white font-medium hover:bg-cobalt-700 transition-colors shadow-soft disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Jelentkezés beküldése...</>
            ) : (
              <><Send className="w-4 h-4" /> {isRejected ? 'Jelentkezés újraküldése' : 'Jelentkezés beküldése'}</>
            )}
          </button>
        </form>
        )}
      </div>
    </PageContainer>
  );
}
