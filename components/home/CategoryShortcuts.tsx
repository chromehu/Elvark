import Link from 'next/link';
import { categories } from '@/lib/categories';

export function CategoryShortcuts() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-xl font-semibold text-navy-900 mb-6">Kategóriák</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/kurzusok?kategoria=${cat.slug}`}
            className="group flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 shadow-soft hover:shadow-soft-lg hover:border-navy-200 transition-all duration-300 text-center"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${cat.color}15` }}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
            </div>
            <span className="text-xs font-medium text-navy-700 group-hover:text-navy-900">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
