import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-navy-50 to-white px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>
        <p className="text-6xl font-bold text-navy-900 mt-4">404</p>
        <h1 className="text-xl font-semibold text-navy-900 mb-2 mt-4">
          Úgy tűnik, ez a lecke még nem létezik.
        </h1>
        <p className="text-gray-500 mb-8 max-w-md">
          A keresett oldal nem található vagy áthelyezésre került.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cobalt-600 text-white font-medium hover:bg-cobalt-700 transition-colors shadow-soft"
        >
          <ArrowLeft className="w-4 h-4" />
          Vissza az ELVARK főoldalára
        </Link>
      </div>
    </div>
  );
}
