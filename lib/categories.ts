import type { Category } from '@/types';

export const categories: Category[] = [
  { id: 'c1', name: 'Üzlet és vállalkozás', slug: 'uzlet-es-vallalkozas', color: '#365288' },
  { id: 'c2', name: 'Informatika', slug: 'informatika', color: '#476da6' },
  { id: 'c3', name: 'Marketing', slug: 'marketing', color: '#ff7f0f' },
  { id: 'c4', name: 'Pénzügy', slug: 'penzugy', color: '#2b426d' },
  { id: 'c5', name: 'Mezőgazdaság', slug: 'mezogazdasag', color: '#6a90c2' },
  { id: 'c6', name: 'Nyelvek', slug: 'nyelvek', color: '#ff9d37' },
  { id: 'c7', name: 'Kreatív készségek', slug: 'kreativ-keszsegek', color: '#9bb5d8' },
  { id: 'c8', name: 'Érettségi felkészítés', slug: 'erettsegi-felkeszites', color: '#f0610a' },
];

export function getCategoryName(slug: string): string {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}
