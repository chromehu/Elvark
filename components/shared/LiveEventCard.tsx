import Link from 'next/link';
import { Calendar, Clock, Users, Video } from 'lucide-react';
import type { LiveEvent } from '@/types';
import { PriceDisplay } from './PriceDisplay';
import { CategoryBadge } from './CategoryBadge';
import { formatDateShort, getLiveEventTypeLabel } from '@/lib/format';

interface LiveEventCardProps {
  event: LiveEvent;
}

export function LiveEventCard({ event }: LiveEventCardProps) {
  const remaining = event.maxParticipants - event.registeredParticipants;
  const isFull = remaining <= 0;

  return (
    <Link
      href={`/elo-oktatasok/${event.slug}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-soft-lg hover:border-navy-200 transition-all duration-300 overflow-hidden flex flex-col"
    >
      <div
        className="relative h-36 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: event.coverColor }}
      >
        <Video className="w-10 h-10 text-white/80 group-hover:scale-110 transition-transform duration-300" />
        <span className="absolute top-3 left-3 bg-white/90 text-navy-700 text-xs font-medium px-2.5 py-1 rounded-full">
          {getLiveEventTypeLabel(event.type)}
        </span>
        {isFull && (
          <span className="absolute top-3 right-3 bg-red-500/90 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            Betelt
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <CategoryBadge label={event.category} color={event.coverColor} />
        <h3 className="font-semibold text-navy-900 mt-2 line-clamp-2 group-hover:text-navy-700 transition-colors">
          {event.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{event.instructorName}</p>

        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDateShort(event.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {event.startTime}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-gray-400" />
          <span className={`text-xs font-medium ${isFull ? 'text-red-600' : 'text-navy-600'}`}>
            {isFull ? 'Betelt' : `${remaining} hely maradt`}
          </span>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-50">
          <PriceDisplay price={event.price} size="sm" />
        </div>
      </div>
    </Link>
  );
}
