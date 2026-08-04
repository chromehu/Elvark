import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Élő online oktatások',
  description: 'Csatlakozz valós idejű online órákhoz, workshopokhoz, webinarokhoz és konzultációkhoz. Tanulj interaktívan az ELVARK-on.',
  path: '/elo-oktatasok',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
