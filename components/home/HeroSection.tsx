'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, GraduationCap, PlayCircle, Video, FileText, Radio, ArrowRight, Star, Users } from 'lucide-react';

export function HeroSection() {
  const [search, setSearch] = useState('');

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-navy-50 via-white to-white">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cobalt-100/30 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-100/30 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-cobalt-50 text-cobalt-700 text-sm font-medium px-3 py-1.5 rounded-full mb-6">
              <GraduationCap className="w-4 h-4" />
              Learn your way.
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight">
              Tanulj valódi szakemberektől, a saját tempódban vagy élőben.
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-xl">
              Videókurzusok, letölthető tananyagok és interaktív online oktatások egyetlen modern platformon.
            </p>
            <p className="mt-2 text-base text-navy-500 italic">
              Tanulj videókból vagy élőben.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/kurzusok"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cobalt-600 text-white font-medium hover:bg-cobalt-700 transition-colors shadow-soft"
              >
                Kurzusok böngészése
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/elo-oktatasok"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-navy-700 font-medium border border-gray-200 hover:border-navy-300 hover:bg-navy-50 transition-colors"
              >
                Élő oktatások
              </Link>
              <Link
                href="/oktato-jelentkezes"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-navy-700 font-medium border border-gray-200 hover:border-navy-300 hover:bg-navy-50 transition-colors"
              >
                Oktatóként csatlakozom
              </Link>
            </div>

            <div className="mt-8 relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Keress kurzusokra, témákra, oktatókra..."
                aria-label="Keresés"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm shadow-soft focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="relative hidden lg:block animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-navy-900 rounded-2xl p-5 shadow-soft-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                  <PlayCircle className="w-8 h-8 text-cobalt-400 mb-3" />
                  <p className="text-white font-medium text-sm">Excel az alapoktól</p>
                  <p className="text-navy-300 text-xs mt-1">12 óra videó tartalom</p>
                  <div className="flex items-center gap-1 mt-3">
                    <Star className="w-3 h-3 text-cobalt-400" fill="currentColor" />
                    <span className="text-white text-xs">4.9</span>
                    <span className="text-navy-300 text-xs">(312)</span>
                  </div>
                </div>
                <div className="bg-cobalt-600 rounded-2xl p-5 shadow-soft-lg transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  <Radio className="w-8 h-8 text-white mb-3" />
                  <p className="text-white font-medium text-sm">Élő workshop</p>
                  <p className="text-white/80 text-xs mt-1">Augusztus 15. 17:00</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-white rounded-2xl p-5 shadow-soft-lg border border-gray-100 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <FileText className="w-8 h-8 text-navy-600 mb-3" />
                  <p className="text-navy-900 font-medium text-sm">Letölthető tananyagok</p>
                  <p className="text-gray-500 text-xs mt-1">PDF fájlok és sablonok</p>
                </div>
                <div className="bg-teal-50 rounded-2xl p-5 shadow-soft transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                  <Video className="w-8 h-8 text-teal-600 mb-3" />
                  <p className="text-navy-900 font-medium text-sm">Kezdő webfejlesztés</p>
                  <div className="flex items-center gap-1 mt-3">
                    <Users className="w-3 h-3 text-teal-500" />
                    <span className="text-navy-600 text-xs">1320 hallgató</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
