import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';
import { siteConfig, DEMO_MODE } from '@/lib/config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} – Videókurzusok és élő online oktatások`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: `${siteConfig.name} – ${siteConfig.slogan}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: 'hu_HU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} – ${siteConfig.slogan}`,
    description: siteConfig.description,
  },
  ...(DEMO_MODE
    ? {
        robots: {
          index: false,
          follow: false,
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body className={inter.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
