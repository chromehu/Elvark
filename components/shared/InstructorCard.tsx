import Link from 'next/link';
import { Star, Users, BookOpen } from 'lucide-react';
import type { Instructor } from '@/types';

interface InstructorCardProps {
  instructor: Instructor;
}

export function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-soft-lg transition-all duration-300 p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-navy-100 flex items-center justify-center mx-auto mb-4">
        <span className="text-xl font-bold text-navy-700">
          {instructor.name.split(' ').map((n) => n[0]).join('')}
        </span>
      </div>
      <h3 className="font-semibold text-navy-900">{instructor.name}</h3>
      <p className="text-sm text-gray-500 mt-1">{instructor.title}</p>

      <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <Star className="w-4 h-4 text-cobalt-500" fill="currentColor" />
          {instructor.rating.toFixed(1)}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4 text-navy-400" />
          {instructor.studentCount}
        </span>
        <span className="flex items-center gap-1">
          <BookOpen className="w-4 h-4 text-navy-400" />
          {instructor.courseCount}
        </span>
      </div>
    </div>
  );
}
