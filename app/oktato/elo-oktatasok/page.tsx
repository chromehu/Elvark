'use client';

import Link from 'next/link';
import { Radio, Video } from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { DashboardLayout } from '@/components/shared/DashboardSidebar';
import { instructorSidebarItems } from '@/components/shared/sidebarItems';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { instructorLiveEvents } from '@/lib/instructorData';
import { formatHUF, formatDate, getLiveEventStatusLabel } from '@/lib/format';

export default function InstructorLiveClassesPage() {
  return (
    <PageContainer showFooter={false}>
      <DashboardLayout items={instructorSidebarItems} title="Oktatói fiók">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-navy-900">Élő oktatásaim</h1>
          <Link
            href="/oktato/elo-oktatasok/uj"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cobalt-600 text-white text-sm font-medium hover:bg-cobalt-600 transition-colors"
          >
            <Video className="w-4 h-4" />
            Új élő oktatás
          </Link>
        </div>
        <div className="space-y-3">
          {instructorLiveEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-soft p-5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${event.coverColor}15` }}
              >
                <Radio className="w-6 h-6" style={{ color: event.coverColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-navy-900 truncate">{event.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(event.date)} - {event.startTime} - {formatHUF(event.price)}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm text-gray-500 hidden sm:block">
                  {event.registeredParticipants}/{event.maxParticipants} fő
                </span>
                <StatusBadge status={event.status} label={getLiveEventStatusLabel(event.status)} />
              </div>
            </div>
          ))}
        </div>
      </DashboardLayout>
    </PageContainer>
  );
}
