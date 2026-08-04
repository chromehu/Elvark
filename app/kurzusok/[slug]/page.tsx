'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Star, Users, Clock, Calendar, CheckCircle2, FileDown, Radio,
  PlayCircle, ChevronDown, ChevronUp, ArrowLeft, BookOpen, Award, FileText, Download,
  ChevronRight, Share2
} from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { RatingDisplay } from '@/components/shared/RatingDisplay';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { DemoModal } from '@/components/shared/DemoModal';
import { CourseCard } from '@/components/shared/CourseCard';
import { getCourse, getRelatedCourses } from '@/lib/courses';
import { getInstructor } from '@/lib/instructors';
import { formatDate, formatDuration, getDifficultyLabel, formatNumber } from '@/lib/format';
import { useToast } from '@/components/providers/ToastProvider';

export default function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const course = getCourse(slug);

  const [openSections, setOpenSections] = useState<Set<string>>(new Set([course?.sections[0]?.id ?? '']));
  const [demoOpen, setDemoOpen] = useState(false);
  const { showToast } = useToast();

  if (!course) notFound();

  const instructor = getInstructor(course.instructorId);
  const related = getRelatedCourses(slug, 3);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalLessons = course.sections.reduce((sum, s) => sum + s.lessons.length, 0);

  const handleShare = async () => {
    const shareData = {
      title: course.title,
      text: course.shortDescription,
      url: window.location.href,
    };
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled — no action needed
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link másolva a vágólapra.', 'success');
      } catch {
        showToast('Link másolva a vágólapra.', 'success');
      }
    }
  };

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/kurzusok"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Vissza a kurzusokhoz
        </Link>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-navy-900 transition-colors">Főoldal</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href="/kurzusok" className="hover:text-navy-900 transition-colors">Kurzusok</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-navy-900 font-medium truncate">{course.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <CategoryBadge label={course.category} color={course.coverColor} />
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 transition-colors flex-shrink-0"
                aria-label="Megosztás"
              >
                <Share2 className="w-4 h-4" />
                Megosztás
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mt-3">
              {course.title}
            </h1>
            <p className="text-gray-600 mt-3 text-lg">{course.shortDescription}</p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
              <RatingDisplay rating={course.rating} reviewCount={course.reviewCount} size="md" />
              <span className="flex items-center gap-1 text-gray-500">
                <Users className="w-4 h-4" />
                {formatNumber(course.studentCount)} hallgató
              </span>
              <span className="flex items-center gap-1 text-gray-500">
                <Clock className="w-4 h-4" />
                {formatDuration(course.durationMinutes)}
              </span>
              <span className="flex items-center gap-1 text-gray-500">
                <BookOpen className="w-4 h-4" />
                {getDifficultyLabel(course.difficulty)}
              </span>
              <span className="flex items-center gap-1 text-gray-500">
                <Calendar className="w-4 h-4" />
                Frissítve: {formatDate(course.lastUpdated)}
              </span>
            </div>

            <div
              className="relative h-56 sm:h-72 rounded-2xl flex items-center justify-center mt-6 overflow-hidden"
              style={{ backgroundColor: course.coverColor }}
            >
              <PlayCircle className="w-16 h-16 text-white/70" />
              <div className="absolute top-4 left-4 flex gap-2">
                {course.hasDownloadableMaterials && (
                  <span className="inline-flex items-center gap-1 bg-white/90 text-navy-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    <FileDown className="w-3 h-3" />
                    Letölthető tananyag
                  </span>
                )}
                {course.hasLiveSession && (
                  <span className="inline-flex items-center gap-1 bg-cobalt-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    <Radio className="w-3 h-3" />
                    Élő óra
                  </span>
                )}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-navy-900 mb-3">A kurzusról</h2>
              <p className="text-gray-600 leading-relaxed">{course.description}</p>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-navy-900 mb-4">Mit fogsz tanulni?</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {course.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-cobalt-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-navy-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-navy-900 mb-4">Tartalmaz</h2>
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-navy-500" />
                  {totalLessons} lecke
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-navy-500" />
                  {formatDuration(course.durationMinutes)}
                </div>
                {course.hasDownloadableMaterials && (
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-navy-500" />
                    Letölthető tananyagok
                  </div>
                )}
                {course.hasLiveSession && (
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-navy-500" />
                    Élő óra részvétel
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-navy-500" />
                  Tanúsítvány a kurzus végén
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-navy-900 mb-4">Tananyag</h2>
              <div className="space-y-2">
                {course.sections.map((section) => {
                  const isOpen = openSections.has(section.id);
                  return (
                    <div
                      key={section.id}
                      className="bg-white rounded-xl border border-gray-100 shadow-soft overflow-hidden"
                    >
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-navy-50/50 transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span className="font-medium text-navy-900 text-sm">
                          {section.title}
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {section.lessons.length} lecke
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="border-t border-gray-50">
                          {section.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-3 p-3 pl-6 hover:bg-navy-50/30 transition-colors"
                            >
                              {lesson.type === 'video' ? (
                                <PlayCircle className="w-4 h-4 text-navy-400 flex-shrink-0" />
                              ) : lesson.type === 'pdf' ? (
                                <FileText className="w-4 h-4 text-navy-400 flex-shrink-0" />
                              ) : (
                                <Download className="w-4 h-4 text-navy-400 flex-shrink-0" />
                              )}
                              <span className="text-sm text-navy-700 flex-1">
                                {lesson.title}
                              </span>
                              {lesson.isFreePreview && (
                                <span className="text-xs font-medium text-cobalt-600 bg-cobalt-50 px-2 py-0.5 rounded-full">
                                  Ingyenes előzetes
                                </span>
                              )}
                              {lesson.isDownloadable && (
                                <span className="text-xs font-medium text-navy-600 bg-navy-50 px-2 py-0.5 rounded-full">
                                  Letölthető
                                </span>
                              )}
                              {lesson.durationMinutes > 0 && (
                                <span className="text-xs text-gray-400">
                                  {formatDuration(lesson.durationMinutes)}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {instructor && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-navy-900 mb-4">Oktató</h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-navy-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-navy-700">
                        {instructor.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy-900">{instructor.name}</h3>
                      <p className="text-sm text-gray-500">{instructor.title}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-cobalt-600" fill="currentColor" />
                          {instructor.rating.toFixed(1)} értékelés
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-navy-400" />
                          {formatNumber(instructor.studentCount)} hallgató
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-3 leading-relaxed">{instructor.bio}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-navy-900 mb-4">Hallgatói értékelések</h2>
              <div className="space-y-4">
                {course.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-navy-700">
                            {review.studentName.split(' ').map((n) => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-navy-900 text-sm">{review.studentName}</p>
                          <p className="text-xs text-gray-400">{formatDate(review.date)}</p>
                        </div>
                      </div>
                      <RatingDisplay rating={review.rating} showCount={false} />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-soft-lg p-6">
                <PriceDisplay price={course.price} originalPrice={course.originalPrice} size="lg" />
                {course.originalPrice && course.originalPrice > course.price && (
                  <p className="text-sm text-cobalt-600 font-medium mt-1">
                    {Math.round((1 - course.price / course.originalPrice) * 100)}% kedvezmény
                  </p>
                )}

                <button
                  onClick={() => setDemoOpen(true)}
                  className="w-full mt-4 px-4 py-3 rounded-xl bg-cobalt-600 text-white font-medium hover:bg-cobalt-700 transition-colors shadow-soft"
                >
                  Megvásárolom
                </button>
                <button
                  onClick={() => setDemoOpen(true)}
                  className="w-full mt-2 px-4 py-3 rounded-xl bg-navy-50 text-navy-700 font-medium hover:bg-navy-100 transition-colors"
                >
                  Kosárba
                </button>

                <div className="mt-6 space-y-3 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Teljes hossz</span>
                    <span className="font-medium text-navy-900">{formatDuration(course.durationMinutes)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Leckék száma</span>
                    <span className="font-medium text-navy-900">{totalLessons}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Nehézség</span>
                    <span className="font-medium text-navy-900">{getDifficultyLabel(course.difficulty)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Hallgatók</span>
                    <span className="font-medium text-navy-900">{formatNumber(course.studentCount)}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    30 napos pénzvisszatérítési garancia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-semibold text-navy-900 mb-6">Kapcsolódó kurzusok</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-40 shadow-soft-lg">
        <div className="flex items-center justify-between gap-4">
          <PriceDisplay price={course.price} originalPrice={course.originalPrice} size="md" />
          <button
            onClick={() => setDemoOpen(true)}
            className="flex-shrink-0 px-6 py-2.5 rounded-xl bg-cobalt-600 text-white font-medium hover:bg-cobalt-700 transition-colors"
          >
            Megvásárolom
          </button>
        </div>
      </div>

      <DemoModal
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
        message="Az ELVARK jelenleg bemutató verzió. Az online fizetés a következő fejlesztési szakaszban kerül bekötésre."
      />
    </PageContainer>
  );
}
