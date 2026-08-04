import { PageContainer } from '@/components/shared/PageContainer';

export default function TermsPage() {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-navy-900 mb-6">Általános Szerződési Feltételek</h1>
        <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
          <p><strong className="text-navy-900">1. Hatály</strong></p>
          <p>Jelen Általános Szerződési Feltételek (továbbiakban: ÁSZF) az ELVARK online oktatási platform minden felhasználójára vonatkozik.</p>
          <p><strong className="text-navy-900">2. Szolgáltatások</strong></p>
          <p>A ELVARK videókurzusok, digitális tananyagok és élő online oktatások vásárlását és értékesítését teszi lehetővé.</p>
          <p><strong className="text-navy-900">3. Regisztráció</strong></p>
          <p>A platform használata regisztrációhoz kötött. A felhasználó kötelező valós adatokat megadni a regisztráció során.</p>
          <p><strong className="text-navy-900">4. Vásárlás és fizetés</strong></p>
          <p>A kurzusok és élő oktatások ára forintban (HUF) kerül megadásra. A fizetés biztonságos online tranzakcióval történik.</p>
          <p><strong className="text-navy-900">5. Elállás</strong></p>
          <p>A kurzusok esetében 30 napos pénzvisszatérítési garancia érvényes. Az élő oktatásoknál a lemondási feltételek eseményenként kerülnek meghatározásra.</p>
          <p><strong className="text-navy-900">6. Oktatói feltételek</strong></p>
          <p>Oktatóként a tartalom minőségéért és pontosságáért a felelősséget vállalod. A kurzusok jóváhagyás után válnak publikussá.</p>
        </div>
      </div>
    </PageContainer>
  );
}
