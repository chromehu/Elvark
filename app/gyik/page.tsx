import { PageContainer } from '@/components/shared/PageContainer';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'Mi az az ELVARK?', a: 'Az ELVARK egy modern online oktatási platform, amely videókurzusokat, digitális tananyagokat és élő online oktatásokat kapcsol össze egyetlen felületen.' },
  { q: 'Hogyan vásárolhatok kurzust?', a: 'A bemutató verzióban a vásárlás funkció még nem elérhető. A teljes verzióban biztonságos online fizetéssel tudsz majd kurzusokat vásárolni.' },
  { q: 'Tarthatek én is élő oktatást?', a: 'Igen! Regisztrálj oktatóként, hozd létre a profilodat, és már indíthatod is az első élő oktatásodat vagy kurzusodat.' },
  { q: 'Milyen eszközökre van szükségem az élő oktatásokhoz?', a: 'Egy számítógépre internetkapcsolattal, valamint mikrofonra és opcionálisan kamerára. A pontos követelmények minden élő oktatásnál fel vannak tüntetve.' },
  { q: 'Visszakaphatom a pénzem, ha nem tetszik a kurzus?', a: 'Igen, 30 napos pénzvisszatérítési garanciát kínálunk a kurzusokra. Az élő oktatásoknál a lemondási feltételek eseményenként változnak.' },
  { q: 'Hogyan válhatok oktatóvá?', a: 'Regisztrálj oktatóként, hozd létre a profilodat, töltsd fel kurzusodat vagy hirdess élő oktatást. A kurzusok jóváhagyás után válnak publikussá.' },
];

export default function FAQPage() {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-navy-900 mb-6">Gyakori kérdések</h1>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <details key={index} className="group bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                <span className="font-medium text-navy-900">{faq.q}</span>
                <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-5 pb-5 text-sm text-gray-600">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
