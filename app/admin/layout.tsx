import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Adminisztráció',
  description: 'Az ELVARK platform adminisztrációs felülete: jóváhagyások, rendelések, tartalommoderáció.',
  path: '/admin',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
