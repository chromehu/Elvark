import { PageContainer } from '@/components/shared/PageContainer';

export default function ImpressumPage() {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-navy-900 mb-6">Impresszum</h1>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 space-y-4 text-gray-600">
          <div>
            <h3 className="font-semibold text-navy-900">Szolgáltató</h3>
            <p className="mt-1">ELVARK Kft.</p>
          </div>
          <div>
            <h3 className="font-semibold text-navy-900">Székhely</h3>
            <p className="mt-1">1083 Budapest, Kerepesi út 1.</p>
          </div>
          <div>
            <h3 className="font-semibold text-navy-900">Cégjegyzékszám</h3>
            <p className="mt-1">01-09-123456</p>
          </div>
          <div>
            <h3 className="font-semibold text-navy-900">Adószám</h3>
            <p className="mt-1">12345678-2-43</p>
          </div>
          <div>
            <h3 className="font-semibold text-navy-900">Kapcsolat</h3>
            <p className="mt-1">E-mail: info@elvark.hu</p>
            <p>Telefon: +36 1 234 5678</p>
          </div>
          <div>
            <h3 className="font-semibold text-navy-900">Felelős szerkesztő</h3>
            <p className="mt-1">ELVARK Kft. ügyvezetése</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
