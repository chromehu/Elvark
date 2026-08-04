import { PageContainer } from '@/components/shared/PageContainer';

export default function PrivacyPage() {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-navy-900 mb-6">Adatkezelési tájékoztató</h1>
        <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
          <p><strong className="text-navy-900">1. Adatkezelő</strong></p>
          <p>Az ELVARK platform üzemeltetője (továbbiakban: Adatkezelő) a felhasználói adatok kezelője.</p>
          <p><strong className="text-navy-900">2. Kezelt adatok</strong></p>
          <p>Név, e-mail cím, telefonszám, vásárlási előzmények, tanulási előrehaladás.</p>
          <p><strong className="text-navy-900">3. Adatkezelés célja</strong></p>
          <p>A szolgáltatások nyújtása, felhasználói fiók kezelése, vásárlások feldolgozása és kommunikáció.</p>
          <p><strong className="text-navy-900">4. Adatmegőrzés</strong></p>
          <p>A felhasználói adatok a fiók megszüntetéséig kerülnek tárolásra, utána 30 napon belül törlésre kerülnek.</p>
          <p><strong className="text-navy-900">5. Jogok</strong></p>
          <p>A felhasználó bármikor kérheti adatai megtekintését, módosítását vagy törlését az info@elvark.hu e-mail címen.</p>
        </div>
      </div>
    </PageContainer>
  );
}
