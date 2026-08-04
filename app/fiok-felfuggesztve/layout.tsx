import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Fiók felfüggesztve',
  description: 'Az ELVARK fiók jelenleg nem elérhető.',
  path: '/fiok-felfuggesztve',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
