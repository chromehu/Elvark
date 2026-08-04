import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { courses } from '@/lib/courses';
import { CourseCard } from '@/components/shared/CourseCard';

export function FeaturedCourses() {
  const featured = courses.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-navy-900">Kiemelt kurzusok</h2>
        <Link
          href="/kurzusok"
          className="inline-flex items-center gap-1 text-sm font-medium text-navy-600 hover:text-navy-900 transition-colors"
        >
          Összes kurzus
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {featured.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
