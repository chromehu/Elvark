import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Oktatói irányítópult',
  description: 'Kezeld kurzusaidat, élő oktatásaidat, bevételeidet és eladásaidat az ELVARK oktatói felületen.',
  path: '/oktato',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
