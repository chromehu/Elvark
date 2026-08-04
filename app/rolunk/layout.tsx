import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Rólunk',
  description: 'Az ELVARK egy modern online oktatási platform, amely videókurzusokat, digitális tananyagokat és élő online oktatásokat kapcsol össze.',
  path: '/rolunk',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
