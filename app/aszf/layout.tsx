import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Általános Szerződési Feltételek',
  description: 'Az ELVARK platform általános szerződési feltételei.',
  path: '/aszf',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
