import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Kapcsolat',
  description: 'Lépj kapcsolatba az ELVARK csapatával. E-mail, telefon és ügyfélszolgálat.',
  path: '/kapcsolat',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
