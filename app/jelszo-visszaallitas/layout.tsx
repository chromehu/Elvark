import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Jelszó visszaállítás',
  description: 'Állíts be új jelszót az ELVARK fiókodhoz.',
  path: '/jelszo-visszaallitas',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
