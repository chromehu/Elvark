'use client';

import Link from 'next/link';
import { Radio } from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { DashboardLayout } from '@/components/shared/DashboardSidebar';
import { studentSidebarItems } from '@/components/shared/sidebarItems';
import { EmptyState } from '@/components/shared/EmptyState';
import { upcomingLives } from '@/lib/studentData';
import { formatDate } from '@/lib/format';

export default function MyLiveClassesPage() {
  return (
    <PageContainer showFooter={false}>
      <DashboardLayout items={studentSidebarItems} title="Hallgatói fiók">
        <h1 className="text-2xl font-bold text-navy-900 mb-6">Élő oktatásaim</h1>
        {upcomingLives.length === 0 ? (
          <EmptyState
            icon={Radio}
            title="Nincs közelgő élő oktatás"
            description="Böngéssz az élő oktatások között és jelentkezz."
            action={
              <Link href="/elo-oktatasok" className="px-4 py-2 rounded-xl bg-cobalt-600 text-white text-sm font-medium hover:bg-cobalt-600 transition-colors">
                Élő oktatások böngészése
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {upcomingLives.map((live) => (
              <Link
                key={live.liveEventId}
                href={`/elo-oktatasok/${live.liveEventSlug}`}
                className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-soft p-5 hover:shadow-soft-lg transition-all"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${live.coverColor}15` }}
                >
                  <Radio className="w-7 h-7" style={{ color: live.coverColor }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-navy-900">{live.title}</h3>
                  <p className="text-sm text-gray-500">{live.instructorName}</p>
                  <p className="text-sm text-navy-600 mt-1">{formatDate(live.date)} - {live.startTime}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </DashboardLayout>
    </PageContainer>
  );
}
