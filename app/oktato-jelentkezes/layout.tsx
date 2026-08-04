import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Oktatóknak',
  description: 'Van tudásod, amit érdemes továbbadni? Az ELVARK segítségével videókurzusokat készíthetsz, digitális tananyagokat értékesíthetsz és fizetős élő oktatásokat tarthatsz.',
  path: '/oktato-jelentkezes',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
