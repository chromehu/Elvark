import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Adatkezelési tájékoztató',
  description: 'Az ELVARK platform adatkezelési tájékoztatója a felhasználói adatok kezeléséről.',
  path: '/adatkezeles',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
