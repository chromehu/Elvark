import { PageContainer } from '@/components/shared/PageContainer';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-navy-900 mb-6">Kapcsolat</h1>
        <p className="text-gray-600 mb-8">
          Kérdésed van? Lépj kapcsolatba velünk az alábbi elérhetőségeken.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
            <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center mb-3">
              <Mail className="w-5 h-5 text-navy-600" />
            </div>
            <h3 className="font-semibold text-navy-900">E-mail</h3>
            <p className="text-sm text-gray-500 mt-1">info@elvark.hu</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
            <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center mb-3">
              <Phone className="w-5 h-5 text-navy-600" />
            </div>
            <h3 className="font-semibold text-navy-900">Telefon</h3>
            <p className="text-sm text-gray-500 mt-1">+36 1 234 5678</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
            <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5 text-navy-600" />
            </div>
            <h3 className="font-semibold text-navy-900">Cím</h3>
            <p className="text-sm text-gray-500 mt-1">1083 Budapest, Kerepesi út 1.</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
            <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center mb-3">
              <MessageCircle className="w-5 h-5 text-navy-600" />
            </div>
            <h3 className="font-semibold text-navy-900">Ügyfélszolgálat</h3>
            <p className="text-sm text-gray-500 mt-1">H-P 9:00 - 17:00</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
