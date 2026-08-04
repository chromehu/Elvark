export const siteConfig = {
  name: 'ELVARK',
  slogan: 'Learn your way.',
  description:
    'Videókurzusok, digitális tananyagok és élő online oktatások egy helyen. Tanulj valódi szakemberektől, a saját tempódban vagy élőben.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://elvark.hu',
  ogImage: '/og-image.png',
};

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';
