'use client';

import Link from 'next/link';
import {
  BookOpen, Radio, Clock, Bell, TrendingUp, PlayCircle, ArrowRight, CheckCircle2, AlertCircle, Info
} from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { DashboardLayout } from '@/components/shared/DashboardSidebar';
import { studentSidebarItems } from '@/components/shared/sidebarItems';
import { StatisticCard } from '@/components/shared/StatisticCard';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { DemoBadge } from '@/components/shared/DemoBadge';
import { enrolledCourses, upcomingLives, recentLessons, orders, notifications } from '@/lib/studentData';
import { formatHUF, formatDate, getOrderStatusLabel } from '@/lib/format';
import { useAuth } from '@/components/providers/AuthProvider';

const notificationIcon = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
};

const notificationColor = {
  info: 'text-navy-500',
  success: 'text-green-600',
  warning: 'text-cobalt-600',
};

export default function StudentDashboard() {
  const { profile } = useAuth();
  const displayName = profile?.full_name || profile?.email || 'Hallgató';
  const avgProgress = Math.round(
    enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length
  );

  return (
    <PageContainer showFooter={false}>
      <DashboardLayout items={studentSidebarItems} title="Hallgatói fiók">
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-navy-900">Üdvözöljük, {displayName}!</h1>
              <DemoBadge />
            </div>
            <p className="text-gray-500 mt-1">Folytassa a tanulást ott, ahol abbahagyta.</p>
          </div>

          <div>
            <DemoBadge />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatisticCard
              icon={BookOpen}
              label="Aktív kurzus"
              value={String(enrolledCourses.length)}
              color="#365288"
            />
            <StatisticCard
              icon={Radio}
              label="Közelgő élő oktatás"
              value={String(upcomingLives.length)}
              color="#2563eb"
            />
            <StatisticCard
              icon={TrendingUp}
              label="Átlagos kurzusteljesítés"
              value={`${avgProgress}%`}
              color="#2b426d"
            />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-navy-900">Kurzusaim</h2>
              <Link href="/fiokom/kurzusaim" className="text-sm text-navy-600 hover:text-navy-900 flex items-center gap-1">
                Összes <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {enrolledCourses.map((course) => (
                <Link
                  key={course.courseId}
                  href={`/kurzusok/${course.courseSlug}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 hover:shadow-soft-lg transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${course.coverColor}15` }}
                    >
                      <PlayCircle className="w-6 h-6" style={{ color: course.coverColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-navy-900 text-sm group-hover:text-navy-700 truncate">
                        {course.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">{course.instructorName}</p>
                      <div className="mt-3">
                        <ProgressBar value={course.progress} size="sm" showLabel />
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {course.completedLessons} / {course.totalLessons} lecke befejezve
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-navy-900 mb-4">Közelgő élő oktatások</h2>
              {upcomingLives.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft">
                  <EmptyState icon={Radio} title="Nincs közelgő élő oktatás" />
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingLives.map((live) => (
                    <Link
                      key={live.liveEventId}
                      href={`/elo-oktatasok/${live.liveEventSlug}`}
                      className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-soft p-4 hover:shadow-soft-lg transition-all"
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${live.coverColor}15` }}
                      >
                        <Radio className="w-5 h-5" style={{ color: live.coverColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-navy-900 text-sm truncate">{live.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{live.instructorName}</p>
                        <p className="text-xs text-navy-600 mt-1">
                          {formatDate(live.date)} - {live.startTime}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-navy-900 mb-4">Legutóbb megtekintett leckék</h2>
              <div className="space-y-3">
                {recentLessons.map((lesson, index) => (
                  <Link
                    key={index}
                    href={`/kurzusok/${lesson.courseSlug}`}
                    className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-soft p-4 hover:shadow-soft-lg transition-all"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${lesson.coverColor}15` }}
                    >
                      <PlayCircle className="w-5 h-5" style={{ color: lesson.coverColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-navy-900 text-sm truncate">{lesson.lessonTitle}</p>
                      <p className="text-xs text-gray-500 truncate">{lesson.courseTitle}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-navy-900 mb-4">Vásárlási előzmények</h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
                <div className="divide-y divide-gray-50">
                  {orders.slice(0, 4).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-navy-900 truncate">{order.itemTitle}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.date)}</p>
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
              <h2 className="text-lg font-semibold text-navy-900 mb-4">Értesítések</h2>
              <div className="space-y-3">
                {notifications.map((notif) => {
                  const Icon = notificationIcon[notif.type];
                  return (
                    <div
                      key={notif.id}
                      className={`flex items-start gap-3 bg-white rounded-2xl border border-gray-100 shadow-soft p-4 ${
                        !notif.read ? 'border-l-4 border-l-cobalt-400' : ''
                      }`}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${notificationColor[notif.type]}`} />
                      <div>
                        <p className="text-sm font-medium text-navy-900">{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(notif.date)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </PageContainer>
  );
}
