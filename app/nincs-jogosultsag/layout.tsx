import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Nincs jogosultság',
  description: 'Nincs jogosultság az oldal megtekintéséhez.',
  path: '/nincs-jogosultsag',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
