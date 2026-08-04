'use client';

import Link from 'next/link';
import { PlayCircle, BookOpen } from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { DashboardLayout } from '@/components/shared/DashboardSidebar';
import { studentSidebarItems } from '@/components/shared/sidebarItems';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { EmptyState } from '@/components/shared/EmptyState';
import { enrolledCourses } from '@/lib/studentData';
import { formatDate } from '@/lib/format';

export default function MyCoursesPage() {
  return (
    <PageContainer showFooter={false}>
      <DashboardLayout items={studentSidebarItems} title="Hallgatói fiók">
        <h1 className="text-2xl font-bold text-navy-900 mb-6">Kurzusaim</h1>
        {enrolledCourses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Még nincs kurzusod"
            description="Böngéssz a kurzusok között és kezdd el a tanulást."
            action={
              <Link href="/kurzusok" className="px-4 py-2 rounded-xl bg-cobalt-600 text-white text-sm font-medium hover:bg-cobalt-600 transition-colors">
                Kurzusok böngészése
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {enrolledCourses.map((course) => (
              <Link
                key={course.courseId}
                href={`/kurzusok/${course.courseSlug}`}
                className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 hover:shadow-soft-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${course.coverColor}15` }}
                  >
                    <PlayCircle className="w-7 h-7" style={{ color: course.coverColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-navy-900">{course.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{course.instructorName}</p>
                    <div className="mt-3">
                      <ProgressBar value={course.progress} showLabel />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                      <span>{course.completedLessons} / {course.totalLessons} lecke</span>
                      <span>Utolsó hozzáférés: {formatDate(course.lastAccessed)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </DashboardLayout>
    </PageContainer>
  );
}
