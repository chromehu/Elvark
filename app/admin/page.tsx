'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DollarSign, Users, BookOpen, Radio, TrendingUp, CheckCircle2,
  XCircle, Eye, Ban, Flag, Package, Loader2, Mail, Calendar
} from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { DashboardLayout } from '@/components/shared/DashboardSidebar';
import { adminSidebarItems } from '@/components/shared/sidebarItems';
import { StatisticCard } from '@/components/shared/StatisticCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DemoBadge } from '@/components/shared/DemoBadge';
import { Modal } from '@/components/shared/Modal';
import { useToast } from '@/components/providers/ToastProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { adminOrders, adminReports, adminStats } from '@/lib/adminData';
import { formatHUF, formatDate, getOrderStatusLabel } from '@/lib/format';

interface PendingInstructor {
  user_id: string;
  public_name: string;
  professional_title: string;
  biography: string;
  experience: string;
  teaching_topics: string;
  website_url: string | null;
  social_url: string | null;
  application_message: string;
  applied_at: string;
  profile?: {
    email: string;
    full_name: string | null;
  };
}

const typeLabels: Record<string, string> = {
  course: 'Kurzus',
  live: 'Élő oktatás',
  instructor: 'Oktatói jelentkezés',
};

export default function AdminDashboard() {
  const { showToast } = useToast();
  const { profile } = useAuth();
  const [pendingInstructors, setPendingInstructors] = useState<PendingInstructor[]>([]);
  const [loadingInstructors, setLoadingInstructors] = useState(true);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | 'suspend' | null>(null);
  const [confirmItem, setConfirmItem] = useState<PendingInstructor | { title: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPendingInstructors = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('instructor_profiles')
      .select(`
        user_id,
        public_name,
        professional_title,
        biography,
        experience,
        teaching_topics,
        website_url,
        social_url,
        application_message,
        applied_at,
        profiles!inner ( email, full_name )
      `)
      .eq('approval_status', 'pending')
      .order('applied_at', { ascending: false });

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Fetch pending instructors error:', error);
      }
      setLoadingInstructors(false);
      return;
    }

    // Flatten the nested profile data (Supabase join returns array for relations)
    const mapped = (data || []).map((item: Record<string, unknown>) => {
      const profiles = item.profiles as Array<{ email: string; full_name: string | null }>;
      const profileData = Array.isArray(profiles) ? profiles[0] : (profiles as { email: string; full_name: string | null });
      return {
        user_id: item.user_id as string,
        public_name: item.public_name as string,
        professional_title: item.professional_title as string,
        biography: item.biography as string,
        experience: item.experience as string,
        teaching_topics: item.teaching_topics as string,
        website_url: item.website_url as string | null,
        social_url: item.social_url as string | null,
        application_message: item.application_message as string,
        applied_at: item.applied_at as string,
        profile: {
          email: profileData?.email || '',
          full_name: profileData?.full_name || null,
        },
      } as PendingInstructor;
    });

    setPendingInstructors(mapped);
    setLoadingInstructors(false);
  }, []);

  useEffect(() => {
    fetchPendingInstructors();
  }, [fetchPendingInstructors]);

  const openApproveConfirm = (item: PendingInstructor) => {
    setConfirmAction('approve');
    setConfirmItem(item);
    setRejectReason('');
    setRejectError(false);
  };

  const openRejectConfirm = (item: PendingInstructor) => {
    setConfirmAction('reject');
    setConfirmItem(item);
    setRejectReason('');
    setRejectError(false);
  };

  const openSuspendConfirm = (item: { title: string }) => {
    setConfirmAction('suspend');
    setConfirmItem(item);
  };

  const closeConfirm = () => {
    setConfirmAction(null);
    setConfirmItem(null);
    setRejectReason('');
    setRejectError(false);
  };

  const handleConfirm = async () => {
    if (!confirmItem || !confirmAction) return;

    if (confirmAction === 'reject') {
      if (!rejectReason.trim()) {
        setRejectError(true);
        return;
      }
    }

    setActionLoading(true);
    const supabase = createClient();

    if (confirmAction === 'approve' && 'user_id' in confirmItem) {
      const { error } = await supabase.rpc('approve_instructor_application', {
        p_user_id: confirmItem.user_id,
      });

      setActionLoading(false);
      if (error) {
        showToast('A jóváhagyás sikertelen.', 'warning');
        if (process.env.NODE_ENV === 'development') {
          console.error('Approve error:', error);
        }
      } else {
        showToast(`${confirmItem.public_name} jóváhagyva.`, 'success');
        fetchPendingInstructors();
      }
    } else if (confirmAction === 'reject' && 'user_id' in confirmItem) {
      const { error } = await supabase.rpc('reject_instructor_application', {
        p_user_id: confirmItem.user_id,
        p_rejection_reason: rejectReason.trim(),
      });

      setActionLoading(false);
      if (error) {
        showToast('Az elutasítás sikertelen.', 'warning');
        if (process.env.NODE_ENV === 'development') {
          console.error('Reject error:', error);
        }
      } else {
        showToast(`${confirmItem.public_name} elutasítva. Indok: ${rejectReason.trim()}`, 'warning');
        fetchPendingInstructors();
      }
    } else if (confirmAction === 'suspend' && confirmItem && 'title' in confirmItem) {
      showToast(`${confirmItem.title} felfüggesztve.`, 'warning');
    }

    closeConfirm();
  };

  const [viewingApp, setViewingApp] = useState<PendingInstructor | null>(null);

  return (
    <PageContainer showFooter={false}>
      <DashboardLayout items={adminSidebarItems} title="Admin felület">
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-navy-900">Admin áttekintés</h1>
              <DemoBadge />
            </div>
            <p className="text-gray-500 mt-1">Az ELVARK platform kezelőfelülete</p>
          </div>

          <div>
            <DemoBadge />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatisticCard icon={DollarSign} label="Teljes platform bevétel" value={formatHUF(adminStats.totalRevenue)} trend="+18%" color="#365288" />
              <StatisticCard icon={TrendingUp} label="Havi bevétel" value={formatHUF(adminStats.monthlyRevenue)} trend="+12%" color="#2563eb" />
              <StatisticCard icon={Users} label="Összes felhasználó" value={String(adminStats.totalUsers)} color="#476da6" />
              <StatisticCard icon={BookOpen} label="Összes kurzus" value={String(adminStats.totalCourses)} color="#2b426d" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatisticCard icon={Radio} label="Élő oktatások" value={String(adminStats.totalLiveEvents)} color="#6a90c2" />
            <StatisticCard icon={Users} label="Oktatók" value={String(adminStats.totalInstructors)} color="#9bb5d8" />
            <StatisticCard icon={Package} label="Havi rendelések" value={String(adminStats.monthlyOrders)} color="#0d9488" />
            <StatisticCard icon={Flag} label="Jóváhagyásra vár" value={String(pendingInstructors.length)} color="#1e3a8a" />
          </div>

          {/* Real instructor applications from Supabase */}
          <div>
            <h2 className="text-lg font-semibold text-navy-900 mb-4">Oktatói jelentkezések</h2>
            {loadingInstructors ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-8 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-cobalt-600 animate-spin" />
              </div>
            ) : pendingInstructors.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-8 text-center">
                <p className="text-sm text-gray-500">Jelenleg nincs jóváhagyásra váró oktatói jelentkezés.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
                <div className="divide-y divide-gray-50">
                  {pendingInstructors.map((item) => (
                    <div key={item.user_id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-navy-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-navy-900 text-sm truncate">{item.public_name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {item.professional_title} {item.applied_at && `- ${formatDate(item.applied_at)}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setViewingApp(item)} className="p-2 rounded-lg text-gray-400 hover:bg-navy-50 hover:text-navy-700 transition-colors" aria-label="Megtekintés">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => openApproveConfirm(item)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Jóváhagyás
                        </button>
                        <button onClick={() => openRejectConfirm(item)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 transition-colors">
                          <XCircle className="w-3.5 h-3.5" />
                          Elutasítás
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mock data sections (orders, reports) — remain as demo data */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-navy-900 mb-4">Legutóbbi rendelések</h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
                <div className="divide-y divide-gray-50">
                  {adminOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-navy-900 truncate">{order.itemTitle}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {order.customer} - {formatDate(order.date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-sm font-semibold text-navy-900">{formatHUF(order.amount)}</span>
                        <StatusBadge status={order.status} label={getOrderStatusLabel(order.status)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-navy-900 mb-4">Bejelentett tartalmak</h2>
              <div className="space-y-3">
                {adminReports.map((report) => (
                  <div key={report.id} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-navy-900 truncate">{report.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{report.reason}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Bejelentő: {report.reporter} - {formatDate(report.date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => showToast(`${report.title} megtekintése.`, 'info')} className="p-2 rounded-lg text-gray-400 hover:bg-navy-50 hover:text-navy-700 transition-colors" aria-label="Megtekintés">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => openSuspendConfirm(report)} className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" aria-label="Felfüggesztés">
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* Application detail modal */}
      <Modal
        open={!!viewingApp}
        onClose={() => setViewingApp(null)}
        title="Oktatói jelentkezés részletei"
      >
        {viewingApp && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-400">Oktatói név:</span> <span className="font-medium text-navy-900">{viewingApp.public_name}</span></div>
              <div><span className="text-gray-400">Szakma:</span> <span className="font-medium text-navy-900">{viewingApp.professional_title}</span></div>
              {viewingApp.profile && (
                <div className="flex items-center gap-1"><Mail className="w-3 h-3 text-gray-400" /> <span className="font-medium text-navy-900">{viewingApp.profile.email}</span></div>
              )}
              {viewingApp.applied_at && (
                <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-gray-400" /> <span className="font-medium text-navy-900">{formatDate(viewingApp.applied_at)}</span></div>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">Bemutatkozás</p>
              <p className="text-sm text-navy-900">{viewingApp.biography}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">Szakmai tapasztalat</p>
              <p className="text-sm text-navy-900">{viewingApp.experience}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">Oktatási témakörök</p>
              <p className="text-sm text-navy-900">{viewingApp.teaching_topics}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">Motiváció</p>
              <p className="text-sm text-navy-900">{viewingApp.application_message}</p>
            </div>
            {viewingApp.website_url && (
              <div><span className="text-xs text-gray-400">Weboldal: </span><a href={viewingApp.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-cobalt-600 hover:underline">{viewingApp.website_url}</a></div>
            )}
            {viewingApp.social_url && (
              <div><span className="text-xs text-gray-400">Social: </span><a href={viewingApp.social_url} target="_blank" rel="noopener noreferrer" className="text-sm text-cobalt-600 hover:underline">{viewingApp.social_url}</a></div>
            )}
          </div>
        )}
      </Modal>

      {/* Confirmation modals */}
      <Modal
        open={confirmAction !== null}
        onClose={closeConfirm}
        title={confirmAction === 'approve' ? 'Jóváhagyás megerősítése' : confirmAction === 'reject' ? 'Elutasítás indoklása' : confirmAction === 'suspend' ? 'Felfüggesztés megerősítése' : ''}
        size="sm"
      >
        {confirmAction === 'approve' && confirmItem && 'user_id' in confirmItem && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Biztosan jóváhagyod: <span className="font-semibold text-navy-900">{confirmItem.public_name}</span>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={closeConfirm} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Mégse</button>
              <button onClick={handleConfirm} disabled={actionLoading} className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-60 inline-flex items-center gap-2">
                {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Megerősítés
              </button>
            </div>
          </div>
        )}

        {confirmAction === 'reject' && confirmItem && 'user_id' in confirmItem && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Biztosan elutasítod: <span className="font-semibold text-navy-900">{confirmItem.public_name}</span>?
            </p>
            <div>
              <label htmlFor="reject-reason" className="block text-sm font-medium text-navy-900 mb-1">Indoklás</label>
              <textarea
                id="reject-reason"
                value={rejectReason}
                onChange={(e) => { setRejectReason(e.target.value); if (rejectError) setRejectError(false); }}
                rows={3}
                className={`w-full rounded-lg border px-3 py-2 text-sm text-navy-900 outline-none transition-colors focus:ring-2 focus:ring-navy-200 ${rejectError ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-navy-400'}`}
                placeholder="Add meg az elutasítás indokát..."
              />
              {rejectError && <p className="mt-1 text-xs text-red-600">Az indok megadása kötelező.</p>}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={closeConfirm} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Mégse</button>
              <button onClick={handleConfirm} disabled={actionLoading} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-60 inline-flex items-center gap-2">
                {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Elutasítás
              </button>
            </div>
          </div>
        )}

        {confirmAction === 'suspend' && confirmItem && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Biztosan felfüggeszted: <span className="font-semibold text-navy-900">{confirmItem && 'title' in confirmItem ? confirmItem.title : ''}</span>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={closeConfirm} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Mégse</button>
              <button onClick={handleConfirm} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors">Felfüggesztés</button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
