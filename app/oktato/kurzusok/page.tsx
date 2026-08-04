'use client';

import Link from 'next/link';
import { BookOpen, PlusCircle, Eye } from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { DashboardLayout } from '@/components/shared/DashboardSidebar';
import { instructorSidebarItems } from '@/components/shared/sidebarItems';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { instructorCourses } from '@/lib/instructorData';
import { formatHUF, formatNumber, getCourseStatusLabel } from '@/lib/format';

export default function InstructorCoursesPage() {
  return (
    <PageContainer showFooter={false}>
      <DashboardLayout items={instructorSidebarItems} title="Oktatói fiók">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-navy-900">Kurzusaim</h1>
          <Link
            href="/oktato/kurzusok/uj"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cobalt-600 text-white text-sm font-medium hover:bg-cobalt-600 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Új kurzus
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
          <div className="divide-y divide-gray-50">
            {instructorCourses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${course.coverColor}15` }}
                  >
                    <BookOpen className="w-6 h-6" style={{ color: course.coverColor }} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-navy-900 truncate">{course.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatNumber(course.studentCount)} hallgató - {course.price > 0 ? formatHUF(course.price) : 'Nincs beállítva'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button className="p-2 rounded-lg text-gray-400 hover:bg-navy-50 hover:text-navy-700 transition-colors" aria-label="Megtekintés">
                    <Eye className="w-4 h-4" />
                  </button>
                  <StatusBadge status={course.status} label={getCourseStatusLabel(course.status)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </PageContainer>
  );
}
