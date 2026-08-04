import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Fiókom',
  description: 'Tekintsd át a kurzusaidat, élő oktatásaidat, vásárlásaidat és értesítéseidet az ELVARK hallgatói fiókban.',
  path: '/fiokom',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
