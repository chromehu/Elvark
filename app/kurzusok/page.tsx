'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchX, SlidersHorizontal, X } from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { CourseCard } from '@/components/shared/CourseCard';
import { SearchField } from '@/components/shared/SearchField';
import { FilterPanel, FilterGroup } from '@/components/shared/FilterPanel';
import { EmptyState } from '@/components/shared/EmptyState';
import { courses } from '@/lib/courses';
import { categories, getCategoryName } from '@/lib/categories';
import { getDifficultyLabel } from '@/lib/format';

const difficultyOptions = [
  { value: 'kezdő', label: 'Kezdő' },
  { value: 'kozepes', label: 'Közepes' },
  { value: 'halado', label: 'Haladó' },
];

const typeOptions = [
  { value: 'video', label: 'Videó kurzus' },
  { value: 'pdf', label: 'PDF tananyag' },
  { value: 'live', label: 'Élő oktatás' },
  { value: 'mixed', label: 'Vegyes' },
];

const priceOptions = [
  { value: 'free', label: 'Ingyenes' },
  { value: 'under-20000', label: '20 000 Ft alatt' },
  { value: '20000-40000', label: '20 000 - 40 000 Ft' },
  { value: 'over-40000', label: '40 000 Ft felett' },
];

const sortOptions = [
  { value: 'popular', label: 'Népszerű' },
  { value: 'rating', label: 'Legjobbra értékelt' },
  { value: 'price-asc', label: 'Olcsóbb előbb' },
  { value: 'price-desc', label: 'Drágább előbb' },
  { value: 'newest', label: 'Legújabb' },
];

export default function CoursesPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('kategoria') ?? '';

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [difficulty, setDifficulty] = useState('');
  const [type, setType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  const categoryOptions = categories.map((c) => ({ value: c.slug, label: c.name }));

  const filtered = useMemo(() => {
    let result = [...courses];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.instructorName.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q)
      );
    }
    if (category) result = result.filter((c) => c.categorySlug === category);
    if (difficulty) result = result.filter((c) => c.difficulty === difficulty);
    if (type) result = result.filter((c) => c.type === type);

    if (priceRange) {
      result = result.filter((c) => {
        if (priceRange === 'free') return c.price === 0;
        if (priceRange === 'under-20000') return c.price > 0 && c.price < 20000;
        if (priceRange === '20000-40000') return c.price >= 20000 && c.price <= 40000;
        if (priceRange === 'over-40000') return c.price > 40000;
        return true;
      });
    }

    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
        break;
      default:
        result.sort((a, b) => b.studentCount - a.studentCount);
    }

    return result;
  }, [search, category, difficulty, type, priceRange, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setDifficulty('');
    setType('');
    setPriceRange('');
    setSortBy('popular');
  };

  const hasActiveFilters = Boolean(search || category || difficulty || type || priceRange);

  const priceLabel = (value: string) =>
    priceOptions.find((o) => o.value === value)?.label ?? value;
  const typeLabel = (value: string) =>
    typeOptions.find((o) => o.value === value)?.label ?? value;

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">Kurzusok</h1>
        <p className="text-gray-600 mt-2 max-w-2xl">
          Böngéssz több száz kurzus között különböző kategóriákban. Találd meg a számodra
          megfelelő videókurzust, tananyagot vagy vegyes kurzust.
        </p>

        <div className="mt-6 flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchField
              value={search}
              onChange={setSearch}
              placeholder="Keress kurzusokra, oktatókra..."
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Rendezés"
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-cobalt-400 transition-all"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-navy-700"
              aria-label="Szűrők megjelenítése"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Szűrők
            </button>
          </div>
        </div>

        {(hasActiveFilters) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {search && (
              <button
                onClick={() => setSearch('')}
                className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-cobalt-50 text-cobalt-700 text-sm font-medium hover:bg-cobalt-100 transition-colors"
              >
                <span className="text-cobalt-600/70">Keresés:</span> {search}
                <X className="w-3.5 h-3.5 text-cobalt-600" />
              </button>
            )}
            {category && (
              <button
                onClick={() => setCategory('')}
                className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-cobalt-50 text-cobalt-700 text-sm font-medium hover:bg-cobalt-100 transition-colors"
              >
                {getCategoryName(category)}
                <X className="w-3.5 h-3.5 text-cobalt-600" />
              </button>
            )}
            {difficulty && (
              <button
                onClick={() => setDifficulty('')}
                className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-cobalt-50 text-cobalt-700 text-sm font-medium hover:bg-cobalt-100 transition-colors"
              >
                {getDifficultyLabel(difficulty)}
                <X className="w-3.5 h-3.5 text-cobalt-600" />
              </button>
            )}
            {type && (
              <button
                onClick={() => setType('')}
                className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-cobalt-50 text-cobalt-700 text-sm font-medium hover:bg-cobalt-100 transition-colors"
              >
                {typeLabel(type)}
                <X className="w-3.5 h-3.5 text-cobalt-600" />
              </button>
            )}
            {priceRange && (
              <button
                onClick={() => setPriceRange('')}
                className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-cobalt-50 text-cobalt-700 text-sm font-medium hover:bg-cobalt-100 transition-colors"
              >
                {priceLabel(priceRange)}
                <X className="w-3.5 h-3.5 text-cobalt-600" />
              </button>
            )}
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-gray-500 hover:text-navy-900 hover:bg-gray-100 transition-colors"
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
                label="Nehézség"
                options={difficultyOptions}
                selectedValue={difficulty}
                onChange={setDifficulty}
              />
              <FilterGroup
                label="Kurzus típus"
                options={typeOptions}
                selectedValue={type}
                onChange={setType}
              />
              <FilterGroup
                label="Ár"
                options={priceOptions}
                selectedValue={priceRange}
                onChange={setPriceRange}
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
            <p className="text-sm text-gray-500 mb-4">{filtered.length} kurzus található</p>
            {filtered.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="Nem találtunk a szűrésnek megfelelő kurzust."
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
                {filtered.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
