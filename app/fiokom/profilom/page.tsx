'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Shield, Loader2, AlertCircle } from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { DashboardLayout } from '@/components/shared/DashboardSidebar';
import { studentSidebarItems } from '@/components/shared/sidebarItems';
import { useToast } from '@/components/providers/ToastProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/format';

export default function ProfilePage() {
  const { showToast } = useToast();
  const { profile, loading: authLoading, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setAvatarUrl(profile.avatar_url || '');
      setLoading(false);
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [profile, authLoading]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim(), avatar_url: avatarUrl.trim() || null })
      .eq('id', profile.id);

    setSaving(false);
    if (error) {
      showToast('A profil frissítése sikertelen. Kérjük, próbáld újra.', 'warning');
      if (process.env.NODE_ENV === 'development') {
        console.error('Profile update error:', error);
      }
    } else {
      showToast('Profil sikeresen frissítve.', 'success');
      await refreshProfile();
    }
  };

  if (loading || authLoading) {
    return (
      <PageContainer showFooter={false}>
        <DashboardLayout items={studentSidebarItems} title="Hallgatói fiók">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-cobalt-600 animate-spin" />
          </div>
        </DashboardLayout>
      </PageContainer>
    );
  }

  if (!profile) {
    return (
      <PageContainer showFooter={false}>
        <DashboardLayout items={studentSidebarItems} title="Hallgatói fiók">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="w-12 h-12 text-amber-600 mb-4" />
            <p className="text-navy-900 font-semibold">Profil nem található</p>
            <p className="text-sm text-gray-500 mt-2">A profiladat nem sikerült betölteni. Kérjük, jelentkezz be újra.</p>
          </div>
        </DashboardLayout>
      </PageContainer>
    );
  }

  const initials = (profile.full_name || profile.email)
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const roleLabels: Record<string, string> = {
    student: 'Hallgató',
    instructor: 'Oktató',
    admin: 'Adminisztrátor',
  };

  return (
    <PageContainer showFooter={false}>
      <DashboardLayout items={studentSidebarItems} title="Hallgatói fiók">
        <h1 className="text-2xl font-bold text-navy-900 mb-6">Profilom</h1>
        <div className="max-w-2xl space-y-6">
          {/* Profile info card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
            <div className="flex items-center gap-4 mb-6">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-navy-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-navy-700">{initials}</span>
                </div>
              )}
              <div>
                <h2 className="font-semibold text-navy-900">{profile.full_name || 'Névtelen felhasználó'}</h2>
                <p className="text-sm text-gray-500">{roleLabels[profile.role] || 'Hallgató'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-50">
                <Mail className="w-4 h-4 text-navy-500 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">E-mail</p>
                  <p className="text-sm font-medium text-navy-900 truncate">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-50">
                <Shield className="w-4 h-4 text-navy-500 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Státusz</p>
                  <p className="text-sm font-medium text-navy-900">
                    {profile.status === 'active' ? 'Aktív' : 'Felfüggesztve'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-50">
                <Calendar className="w-4 h-4 text-navy-500 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Regisztráció dátuma</p>
                  <p className="text-sm font-medium text-navy-900">{formatDate(profile.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-50">
                <User className="w-4 h-4 text-navy-500 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Szerepkör</p>
                  <p className="text-sm font-medium text-navy-900">{roleLabels[profile.role] || 'Hallgató'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Editable fields */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
            <h3 className="font-semibold text-navy-900 mb-4">Szerkeszthető adatok</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="profile-name" className="text-sm font-medium text-navy-700 mb-1.5 block">Teljes név</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="profile-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="profile-avatar" className="text-sm font-medium text-navy-700 mb-1.5 block">Profilkép URL (opcionális)</label>
                <div className="relative">
                  <input
                    id="profile-avatar"
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://pelda.hu/kep.jpg"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-navy-900 text-white text-sm font-medium hover:bg-navy-800 transition-colors disabled:opacity-60 min-h-[44px]"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Mentés
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              A szerepkör és a fiók állapota nem szerkeszthető. Ezek módosítását csak az adminisztrátorok végezhetik.
            </p>
          </div>
        </div>
      </DashboardLayout>
    </PageContainer>
  );
}
