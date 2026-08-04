import type { Metadata } from 'next';
import { siteConfig, DEMO_MODE } from './config';

interface PageMetaInput {
  title: string;
  description: string;
  path?: string;
}

export function createMetadata({ title, description, path = '' }: PageMetaInput): Metadata {
  const fullTitle = title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;
  const url = `${siteConfig.url}${path}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: 'hu_HU',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
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
}
