import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Regisztráció',
  description: 'Csatlakozz az ELVARK közösséghez. Regisztrálj hallgatóként és kezdj el tanulni.',
  path: '/regisztracio',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
