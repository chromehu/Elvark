import { Users, BookOpen, Star, Video } from 'lucide-react';
import { DemoBadge } from '@/components/shared/DemoBadge';

const stats = [
  { icon: Users, label: 'Aktív hallgató', value: '3 420+' },
  { icon: BookOpen, label: 'Közzétett kurzus', value: '156' },
  { icon: Video, label: 'Élő oktatás havonta', value: '42' },
  { icon: Star, label: 'Átlagos értékelés', value: '4.8' },
];

export function TrustStats() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-center mb-6">
        <DemoBadge />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-navy-600" />
              </div>
              <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
