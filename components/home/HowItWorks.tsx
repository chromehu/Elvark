'use client';

import { useState } from 'react';
import { BookOpen, CreditCard, MonitorPlay } from 'lucide-react';

const tabs = [
  { key: 'hallgato', label: 'Hallgatóknak' },
  { key: 'oktato', label: 'Oktatóknak' },
];

const steps = {
  hallgato: [
    {
      icon: BookOpen,
      title: 'Találd meg a neked való kurzust',
      description: 'Böngéssz a kategóriák között, és válaszd ki a számodra leginkább megfelelő kurzust vagy élő oktatást.',
    },
    {
      icon: CreditCard,
      title: 'Jelentkezz és vásárold meg',
      description: 'Biztonságos online fizetéssel regisztrálj a kiválasztott kurzusra vagy élő oktatásra.',
    },
    {
      icon: MonitorPlay,
      title: 'Tanulj a saját tempódban',
      description: 'Nézd vissza a videókat, töltsd le a tananyagokat, vagy csatlakozz élőben az órákhoz.',
    },
  ],
  oktato: [
    {
      icon: BookOpen,
      title: 'Hozd létre oktatói profilodat',
      description: 'Regisztrálj oktatóként, és készítsd el a profilodat, hogy a hallgatók megismerjenek.',
    },
    {
      icon: CreditCard,
      title: 'Töltsd fel kurzusodat',
      description: 'Készíts videókurzusokat, töltsd fel tananyagokat, vagy hirdess meg élő oktatásokat.',
    },
    {
      icon: MonitorPlay,
      title: 'Érd el hallgatóidat',
      description: 'Kövesd nyomon a bevételeidet, hallgatói előrehaladását és értékeléseit egy helyen.',
    },
  ],
};

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState<'hallgato' | 'oktato'>('hallgato');
  const currentSteps = steps[activeTab];

  return (
    <section id="hogyan-mukodik" className="bg-navy-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-navy-900">Hogyan működik?</h2>
          <p className="text-gray-600 mt-2">Két út az ELVARK platformon</p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white rounded-xl border border-gray-100 p-1 shadow-soft">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'hallgato' | 'oktato')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-navy-900 text-white'
                    : 'text-gray-600 hover:text-navy-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cobalt-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-cobalt-600" />
                  </div>
                  <span className="text-3xl font-bold text-navy-100">
                    {index + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-navy-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
