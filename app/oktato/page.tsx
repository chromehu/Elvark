'use client';

import Link from 'next/link';
import {
  DollarSign, Users, BookOpen, Radio, TrendingUp, PlusCircle, Video, ArrowRight, Eye
} from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { DashboardLayout } from '@/components/shared/DashboardSidebar';
import { instructorSidebarItems } from '@/components/shared/sidebarItems';
import { StatisticCard } from '@/components/shared/StatisticCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DemoBadge } from '@/components/shared/DemoBadge';
import { instructorStats, instructorCourses, instructorLiveEvents, instructorOrders } from '@/lib/instructorData';
import { formatHUF, formatDate, formatNumber, getCourseStatusLabel, getLiveEventStatusLabel, getOrderStatusLabel } from '@/lib/format';

export default function InstructorDashboard() {
  return (
    <PageContainer showFooter={false}>
      <DashboardLayout items={instructorSidebarItems} title="Oktatói fiók">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-navy-900">Oktatói áttekintés</h1>
                <DemoBadge />
              </div>
              <p className="text-gray-500 mt-1">Üdvözöljük, Kovács Anna!</p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/oktato/kurzusok/uj"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cobalt-600 text-white text-sm font-medium hover:bg-cobalt-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Új kurzus
              </Link>
              <Link
                href="/oktato/elo-oktatasok/uj"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 text-white text-sm font-medium hover:bg-navy-800 transition-colors"
              >
                <Video className="w-4 h-4" />
                Új élő oktatás
              </Link>
            </div>
          </div>

          <div>
            <DemoBadge />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatisticCard
                icon={DollarSign}
                label="Teljes bevétel"
              value={formatHUF(instructorStats.totalRevenue)}
              trend="+12%"
              color="#365488"
            />
            <StatisticCard
              icon={Users}
              label="Aktív hallgatók"
              value={String(instructorStats.activeStudents)}
              trend="+8%"
              color="#476da6"
            />
            <StatisticCard
              icon={BookOpen}
              label="Közzétett kurzusok"
              value={String(instructorStats.publishedCourses)}
              color="#ff7f0f"
            />
            <StatisticCard
              icon={Radio}
              label="Közelgő élő oktatások"
              value={String(instructorStats.upcomingLives)}
              color="#2b426d"
            />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-navy-900">Kurzusaim</h2>
              <Link href="/oktato/kurzusok" className="text-sm text-navy-600 hover:text-navy-900 flex items-center gap-1">
                Összes <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
              <div className="divide-y divide-gray-50">
                {instructorCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${course.coverColor}15` }}
                      >
                        <BookOpen className="w-5 h-5" style={{ color: course.coverColor }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-navy-900 truncate">{course.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {course.studentCount > 0 ? `${formatNumber(course.studentCount)} hallgató` : 'Még nincs hallgató'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm font-semibold text-navy-900 hidden sm:block">
                        {course.price > 0 ? formatHUF(course.price) : '-'}
                      </span>
                      <StatusBadge status={course.status} label={getCourseStatusLabel(course.status)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-navy-900 mb-4">Közelgő élő oktatások</h2>
              <div className="space-y-3">
                {instructorLiveEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-soft p-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${event.coverColor}15` }}
                    >
                      <Radio className="w-5 h-5" style={{ color: event.coverColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy-900 truncate">{event.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(event.date)} - {event.startTime}</p>
                    </div>
                    <StatusBadge status={event.status} label={getLiveEventStatusLabel(event.status)} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-navy-900 mb-4">Legutóbbi vásárlások</h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
                <div className="divide-y divide-gray-50">
                  {instructorOrders.slice(0, 4).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-navy-900 truncate">{order.itemTitle}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.date)}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm font-semibold text-navy-900">{formatHUF(order.amount)}</span>
                        <StatusBadge status={order.status} label={getOrderStatusLabel(order.status)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </PageContainer>
  );
}
