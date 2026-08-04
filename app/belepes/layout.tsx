import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Bejelentkezés',
  description: 'Jelentkezz be az ELVARK fiókodba.',
  path: '/belepes',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
