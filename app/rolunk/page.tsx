import { PageContainer } from '@/components/shared/PageContainer';
import { GraduationCap } from 'lucide-react';

export default function AboutPage() {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="inline-flex items-center gap-2 bg-cobalt-50 text-cobalt-700 text-sm font-medium px-3 py-1.5 rounded-full mb-4">
          <GraduationCap className="w-4 h-4" />
          Rólunk
        </div>
        <h1 className="text-3xl font-bold text-navy-900 mb-6">A ELVARK-ról</h1>
        <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
          <p>
            A ELVARK — Education, Live, Video, Academy, Resources, Knowledge — egy modern
            magyar online oktatási platform, amely videókurzusokat, digitális tananyagokat
            és élő online oktatásokat kapcsol össze egyetlen modern felületen.
          </p>
          <p>
            Küldetésünk, hogy a tudásmegosztást demokratizáljuk: lehetővé tesszük szakemberek
            számára, hogy tudásukat megosszák, és a hallgatók számára, hogy a saját tempójukban
            vagy élőben tanuljanak valódi szakemberektől.
          </p>
          <p>
            A ELVARK platformon mindenki találhat megfelelő tanulási formát — legyen szó
            videókurzusról, letölthető tananyagról vagy interaktív élő oktatásról.
          </p>
          <p className="text-navy-900 font-medium italic">
            Learn your way.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
