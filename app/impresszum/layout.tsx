import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Impresszum',
  description: 'Az ELVARK platform szolgáltatójának adatai és elérhetőségei.',
  path: '/impresszum',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
