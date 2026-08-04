'use client';

import { useState, useMemo } from 'react';
import { SearchX, Calendar, X } from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { LiveEventCard } from '@/components/shared/LiveEventCard';
import { SearchField } from '@/components/shared/SearchField';
import { FilterPanel, FilterGroup } from '@/components/shared/FilterPanel';
import { EmptyState } from '@/components/shared/EmptyState';
import { liveEvents } from '@/lib/liveEvents';
import { categories } from '@/lib/categories';

const typeOptions = [
  { value: 'interaktiv-ora', label: 'Interaktív óra' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'konzultacio', label: 'Konzultáció' },
];

const dateOptions = [
  { value: 'this-week', label: 'Ezen a héten' },
  { value: 'next-week', label: 'Jövő héten' },
  { value: 'this-month', label: 'Ebben a hónapban' },
];

export default function LiveClassesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categoryOptions = categories.map((c) => ({ value: c.slug, label: c.name }));

  const filtered = useMemo(() => {
    let result = [...liveEvents];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.instructorName.toLowerCase().includes(q) ||
          e.shortDescription.toLowerCase().includes(q)
      );
    }
    if (category) result = result.filter((e) => e.categorySlug === category);
    if (type) result = result.filter((e) => e.type === type);

    if (dateFilter) {
      const now = new Date('2026-08-04');
      const weekFromNow = new Date(now);
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      const twoWeeksFromNow = new Date(now);
      twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
      const monthFromNow = new Date(now);
      monthFromNow.setMonth(monthFromNow.getMonth() + 1);

      result = result.filter((e) => {
        const eventDate = new Date(e.date);
        if (dateFilter === 'this-week') return eventDate <= weekFromNow;
        if (dateFilter === 'next-week') return eventDate > weekFromNow && eventDate <= twoWeeksFromNow;
        if (dateFilter === 'this-month') return eventDate <= monthFromNow;
        return true;
      });
    }

    result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return result;
  }, [search, category, type, dateFilter]);

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setType('');
    setDateFilter('');
  };

  const activeChips = [];
  if (search) activeChips.push({ key: 'search', label: `"${search}"`, clear: () => setSearch('') });
  if (category) {
    const cat = categoryOptions.find((c) => c.value === category);
    if (cat) activeChips.push({ key: 'category', label: cat.label, clear: () => setCategory('') });
  }
  if (type) {
    const tp = typeOptions.find((t) => t.value === type);
    if (tp) activeChips.push({ key: 'type', label: tp.label, clear: () => setType('') });
  }
  if (dateFilter) {
    const dt = dateOptions.find((d) => d.value === dateFilter);
    if (dt) activeChips.push({ key: 'dateFilter', label: dt.label, clear: () => setDateFilter('') });
  }

  const hasActiveFilters = activeChips.length > 0;

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">Élő oktatások</h1>
        <p className="text-gray-600 mt-2 max-w-2xl">
          Csatlakozz valós idejű online órákhoz, workshopokhoz, webinarokhoz és konzultációkhoz.
          Tanulj interaktívan, és tedd fel kérdéseid közvetlenül az oktatónak.
        </p>

        <div className="mt-6 flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchField
              value={search}
              onChange={setSearch}
              placeholder="Keress élő oktatásokra..."
              className="w-full"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-navy-700"
            aria-label="Szűrők megjelenítése"
          >
            <Calendar className="w-4 h-4" />
            Szűrők
          </button>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                onClick={chip.clear}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cobalt-50 text-cobalt-600 text-sm font-medium hover:bg-cobalt-100 transition-colors"
              >
                {chip.label}
                <X className="w-3.5 h-3.5" />
              </button>
            ))}
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 px-2 py-1.5 text-sm text-gray-500 hover:text-navy-700 font-medium transition-colors"
            >
              Összes törlése
            </button>
          </div>
        )}

        <div className="mt-6 flex flex-col lg:flex-row gap-6">
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <FilterPanel>
              <FilterGroup
                label="Kategória"
                options={categoryOptions}
                selectedValue={category}
                onChange={setCategory}
              />
              <FilterGroup
                label="Esemény típus"
                options={typeOptions}
                selectedValue={type}
                onChange={setType}
              />
              <FilterGroup
                label="Időpont"
                options={dateOptions}
                selectedValue={dateFilter}
                onChange={setDateFilter}
              />
              <button
                onClick={resetFilters}
                className="text-sm text-cobalt-600 hover:text-cobalt-700 font-medium"
              >
                Szűrők törlése
              </button>
            </FilterPanel>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 mb-4">{filtered.length} közelgő élő oktatás</p>
            {filtered.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="Nem találtunk a szűrésnek megfelelő élő oktatást."
                description="Próbáld módosítani a szűrőket vagy a keresési kifejezést."
                action={
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 rounded-xl bg-navy-900 text-white text-sm font-medium hover:bg-navy-800 transition-colors"
                  >
                    Szűrők törlése
                  </button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((event) => (
                  <LiveEventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
