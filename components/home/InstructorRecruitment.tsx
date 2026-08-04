import Link from 'next/link';
import { BookOpen, Radio, BarChart3, ArrowRight } from 'lucide-react';

const benefits = [
  {
    icon: BookOpen,
    title: 'Saját kurzusok és tananyagok',
    description: 'Hozz létre és értékesíts videókurzusokat, PDF tananyagokat és letölthető fájlokat.',
  },
  {
    icon: Radio,
    title: 'Fizetős élő oktatások',
    description: 'Tarts interaktív órákat, webinarokat és workshopokat valós időben.',
  },
  {
    icon: BarChart3,
    title: 'Átlátható bevételi kimutatások',
    description: 'Kövesd nyomon a bevételeidet, eladásaidat és hallgatói statisztikáidat.',
  },
];

export function InstructorRecruitment() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cobalt-500/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="relative grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              Van tudásod, amit érdemes továbbadni?
            </h2>
            <p className="text-navy-200 mt-4 text-lg">
              Az ELVARK segítségével videókurzusokat készíthetsz, digitális tananyagokat
              értékesíthetsz és fizetős élő oktatásokat tarthatsz.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/oktato-jelentkezes"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cobalt-600 text-white font-medium hover:bg-cobalt-700 transition-colors"
              >
                Oktatóként csatlakozom
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/#hogyan-mukodik"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-medium border border-white/20 hover:bg-white/20 transition-colors"
              >
                Hogyan működik?
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="flex items-start gap-4 bg-white/5 rounded-2xl p-4 border border-white/10"
                >
                  <div className="w-10 h-10 rounded-xl bg-cobalt-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-cobalt-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{benefit.title}</h3>
                    <p className="text-navy-200 text-sm mt-1">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
