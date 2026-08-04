'use client';

import { useState } from 'react';
import { User, Mail, Phone, Globe, Star, Users, BookOpen } from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { DashboardLayout } from '@/components/shared/DashboardSidebar';
import { instructorSidebarItems } from '@/components/shared/sidebarItems';
import { useToast } from '@/components/providers/ToastProvider';
import { instructors } from '@/lib/instructors';
import { formatNumber } from '@/lib/format';

export default function InstructorProfilePage() {
  const { showToast } = useToast();
  const instructor = instructors[0];
  const [name, setName] = useState(instructor.name);
  const [title, setTitle] = useState(instructor.title);
  const [bio, setBio] = useState(instructor.bio);
  const [email, setEmail] = useState('kovacs.anna@example.com');
  const [phone, setPhone] = useState('+36 30 987 6543');
  const [website, setWebsite] = useState('https://kovacsanna.hu');
  const [linkedin, setLinkedin] = useState('linkedin.com/in/kovacsanna');

  return (
    <PageContainer showFooter={false}>
      <DashboardLayout items={instructorSidebarItems} title="Oktatói fiók">
        <h1 className="text-2xl font-bold text-navy-900 mb-6">Oktatói profil</h1>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-navy-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-navy-700">KA</span>
              </div>
              <h2 className="font-semibold text-navy-900">{name}</h2>
              <p className="text-sm text-gray-500">{title}</p>
              <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-cobalt-600" fill="currentColor" />
                  {instructor.rating.toFixed(1)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-navy-400" />
                  {formatNumber(instructor.studentCount)}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4 text-navy-400" />
                  {instructor.courseCount}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-navy-700 mb-1.5 block">Név</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-navy-700 mb-1.5 block">Titulus</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all" />
              </div>
              <div>
                <label className="text-sm font-medium text-navy-700 mb-1.5 block">Bemutatkozás</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all resize-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-navy-700 mb-1.5 block">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-navy-700 mb-1.5 block">Telefonszám</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-navy-700 mb-1.5 block">Weboldal</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-navy-700 mb-1.5 block">LinkedIn</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all" />
                </div>
              </div>
              <button onClick={() => showToast('Oktatói profil sikeresen frissítve.', 'success')} className="px-6 py-2.5 rounded-xl bg-navy-900 text-white text-sm font-medium hover:bg-navy-800 transition-colors">
                Mentés
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </PageContainer>
  );
}
