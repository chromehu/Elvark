import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Online kurzusok',
  description: 'Böngéssz több száz online kurzus között különböző kategóriákban. Videókurzusok, PDF tananyagok és vegyes kurzusok az ELVARK-on.',
  path: '/kurzusok',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
