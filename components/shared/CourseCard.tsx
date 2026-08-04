import Link from 'next/link';
import { Users, Clock, FileDown, Radio, PlayCircle } from 'lucide-react';
import type { Course } from '@/types';
import { RatingDisplay } from './RatingDisplay';
import { PriceDisplay } from './PriceDisplay';
import { CategoryBadge } from './CategoryBadge';
import { formatDuration, getDifficultyLabel } from '@/lib/format';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      href={`/kurzusok/${course.slug}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-soft-lg hover:border-navy-200 transition-all duration-300 overflow-hidden flex flex-col"
    >
      <div
        className="relative h-40 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: course.coverColor }}
      >
        <PlayCircle className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform duration-300" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {course.hasDownloadableMaterials && (
            <span className="inline-flex items-center gap-1 bg-white/90 text-navy-700 text-xs font-medium px-2 py-1 rounded-full">
              <FileDown className="w-3 h-3" />
              Letölthető
            </span>
          )}
          {course.hasLiveSession && (
            <span className="inline-flex items-center gap-1 bg-cobalt-500/90 text-white text-xs font-medium px-2 py-1 rounded-full">
              <Radio className="w-3 h-3" />
              Élő
            </span>
          )}
        </div>
        <span className="absolute bottom-3 right-3 bg-navy-950/60 text-white text-xs font-medium px-2 py-1 rounded-full">
          {getDifficultyLabel(course.difficulty)}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <CategoryBadge label={course.category} color={course.coverColor} />
        <h3 className="font-semibold text-navy-900 mt-2 line-clamp-2 group-hover:text-navy-700 transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{course.instructorName}</p>

        <div className="mt-3">
          <RatingDisplay rating={course.rating} reviewCount={course.reviewCount} />
        </div>

        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {course.studentCount} hallgató
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatDuration(course.durationMinutes)}
          </span>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
          <PriceDisplay price={course.price} originalPrice={course.originalPrice} size="sm" />
        </div>
      </div>
    </Link>
  );
}
