import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Elfelejtett jelszó',
  description: 'Kérj jelszó visszaállítási linket az ELVARK-on.',
  path: '/elfelejtett-jelszo',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
