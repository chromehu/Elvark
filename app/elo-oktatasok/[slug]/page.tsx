'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Calendar, Clock, Users, Video, CheckCircle2, XCircle, ArrowLeft,
  Globe, Disc, ChevronRight, Share2
} from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { DemoModal } from '@/components/shared/DemoModal';
import { getLiveEvent } from '@/lib/liveEvents';
import { formatDate, getLiveEventTypeLabel } from '@/lib/format';
import { useToast } from '@/components/providers/ToastProvider';

export default function LiveClassDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const event = getLiveEvent(slug);

  const [demoOpen, setDemoOpen] = useState(false);
  const { showToast } = useToast();

  if (!event) notFound();

  const remaining = event.maxParticipants - event.registeredParticipants;
  const isFull = remaining <= 0;

  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: event.shortDescription,
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
          href="/elo-oktatasok"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Vissza az élő oktatásokhoz
        </Link>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-navy-900 transition-colors">Főoldal</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href="/elo-oktatasok" className="hover:text-navy-900 transition-colors">Élő oktatások</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-navy-900 font-medium truncate">{event.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <CategoryBadge label={event.category} color={event.coverColor} />
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-navy-50 text-navy-700">
                  {getLiveEventTypeLabel(event.type)}
                </span>
              </div>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 transition-colors flex-shrink-0"
                aria-label="Megosztás"
              >
                <Share2 className="w-4 h-4" />
                Megosztás
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mt-3">{event.title}</h1>
            <p className="text-gray-600 mt-3 text-lg">{event.shortDescription}</p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(event.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {event.startTime} - {event.endTime}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {event.timezone}
              </span>
              <span className="flex items-center gap-1">
                <Video className="w-4 h-4" />
                {event.instructorName}
              </span>
            </div>

            <div
              className="relative h-56 sm:h-72 rounded-2xl flex items-center justify-center mt-6"
              style={{ backgroundColor: event.coverColor }}
            >
              <Video className="w-16 h-16 text-white/70" />
              {isFull && (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                  Betelt
                </span>
              )}
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-navy-900 mb-3">Részletes leírás</h2>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-navy-900 mb-4">Agenda</h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5">
                <ul className="space-y-3">
                  {event.agenda.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-navy-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-navy-700">{index + 1}</span>
                      </div>
                      <span className="text-sm text-navy-700 pt-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-navy-900 mb-4">Szükséges eszközök</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {event.equipment.map((eq, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-navy-700">
                    <CheckCircle2 className="w-4 h-4 text-cobalt-600 flex-shrink-0" />
                    {eq}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5">
                <h3 className="font-semibold text-navy-900 text-sm mb-2">Felvétel</h3>
                {event.recordingAvailable ? (
                  <div className="flex items-start gap-2">
                    <Disc className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      Az esemény felvétele elérhető lesz {event.recordingAccessDays} napig a résztvevők számára.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">Az eseményről nem készül felvétel.</p>
                  </div>
                )}
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5">
                <h3 className="font-semibold text-navy-900 text-sm mb-2">Lemondási feltételek</h3>
                <p className="text-sm text-gray-600">{event.cancellationPolicy}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-soft-lg p-6">
                <PriceDisplay price={event.price} size="lg" />

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      Dátum
                    </span>
                    <span className="font-medium text-navy-900">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      Időpont
                    </span>
                    <span className="font-medium text-navy-900">{event.startTime} - {event.endTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Globe className="w-4 h-4" />
                      Időzóna
                    </span>
                    <span className="font-medium text-navy-900">{event.timezone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Users className="w-4 h-4" />
                      Szabad hely
                    </span>
                    <span className={`font-medium ${isFull ? 'text-red-600' : 'text-navy-900'}`}>
                      {isFull ? 'Betelt' : `${remaining} / ${event.maxParticipants}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      Időtartam
                    </span>
                    <span className="font-medium text-navy-900">{event.durationMinutes} perc</span>
                  </div>
                </div>

                <button
                  onClick={() => setDemoOpen(true)}
                  disabled={isFull}
                  className="w-full mt-6 px-4 py-3 rounded-xl bg-cobalt-600 text-white font-medium hover:bg-cobalt-700 transition-colors shadow-soft disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {isFull ? 'Betelt' : 'Jelentkezés'}
                </button>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-400 font-medium cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Csatlakozás az élő oktatáshoz
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center leading-relaxed">
                    A csatlakozás az esemény kezdete előtt 15 perccel válik elérhetővé a befizetett résztvevők számára.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-40 shadow-soft-lg">
        <div className="flex items-center justify-between gap-4">
          <PriceDisplay price={event.price} size="md" />
          <button
            onClick={() => setDemoOpen(true)}
            disabled={isFull}
            className="flex-shrink-0 px-6 py-2.5 rounded-xl bg-cobalt-600 text-white font-medium hover:bg-cobalt-700 transition-colors disabled:bg-gray-200 disabled:text-gray-400"
          >
            {isFull ? 'Betelt' : 'Jelentkezés'}
          </button>
        </div>
      </div>

      <DemoModal
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
        message="Az ELVARK jelenleg bemutató verzió. A fizetett jelentkezés és az élő videós csatlakozás később kerül bekötésre."
      />
    </PageContainer>
  );
}
