import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { liveEvents } from '@/lib/liveEvents';
import { LiveEventCard } from '@/components/shared/LiveEventCard';

export function UpcomingLiveClasses() {
  const upcoming = liveEvents.filter((e) => e.status === 'meghirdetve').slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-navy-900">Közelgő élő oktatások</h2>
          <p className="text-sm text-gray-500 mt-1">
            Csatlakozz valós idejű online órákhoz, workshopokhoz és konzultációkhoz.
          </p>
        </div>
        <Link
          href="/elo-oktatasok"
          className="inline-flex items-center gap-1 text-sm font-medium text-navy-600 hover:text-navy-900 transition-colors whitespace-nowrap"
        >
          Összes élő oktatás
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {upcoming.map((event) => (
          <LiveEventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
