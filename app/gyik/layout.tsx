import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Gyakori kérdések',
  description: 'A leggyakoribb kérdések és válaszok az ELVARK platformról.',
  path: '/gyik',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
