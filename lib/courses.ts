import type { Course } from '@/types';

export const courses: Course[] = [
  {
    id: 'co1',
    slug: 'excel-az-alapoktol-a-magabiztos-hasznalatig',
    title: 'Excel az alapoktól a magabiztos használatig',
    shortDescription:
      'Tanuld meg az Excel alapjait és haladó funkcióit gyakorlati példákon keresztül.',
    description:
      'Ez a kurzus az alapoktól visz el a magabiztos Excel használatig. Kezdjük a cellákkal és képletekkel, majd haladunk a pivot táblák, feltételes formázás és makrók felé. Minden fejezet gyakorlati példákkal és letölthető munkafüzetekkel teszi elméleti tudásodat.',
    category: 'Üzlet és vállalkozás',
    categorySlug: 'uzlet-es-vallalkozas',
    instructorId: 'i1',
    instructorName: 'Kovács Anna',
    price: 24900,
    originalPrice: 39900,
    rating: 4.9,
    reviewCount: 312,
    studentCount: 1840,
    durationMinutes: 720,
    difficulty: 'kezdő',
    type: 'mixed',
    hasDownloadableMaterials: true,
    hasLiveSession: false,
    coverColor: '#365288',
    lastUpdated: '2026-07-15',
    benefits: [
      'Magabiztos Excel tudás gyakorlati példákkal',
      'Letölthető munkafüzetek minden fejezethez',
      'Pivot táblák és makrók elsajátítása',
      'Érvénytelenítés 30 napon belül',
    ],
    sections: [
      {
        id: 's1',
        title: 'Bevezetés és alapok',
        lessons: [
          { id: 'l1', title: 'Az Excel felülete és navigáció', type: 'video', durationMinutes: 12, isFreePreview: true, isDownloadable: false },
          { id: 'l2', title: 'Cellák, sorok és oszlopok', type: 'video', durationMinutes: 18, isFreePreview: false, isDownloadable: false },
          { id: 'l3', title: 'Adatbevitel és formázás', type: 'video', durationMinutes: 22, isFreePreview: false, isDownloadable: false },
        ],
      },
      {
        id: 's2',
        title: 'Képletek és függvények',
        lessons: [
          { id: 'l4', title: 'Alapvető képletek', type: 'video', durationMinutes: 25, isFreePreview: true, isDownloadable: false },
          { id: 'l5', title: 'Feltételes függvények (IF, SUMIF)', type: 'video', durationMinutes: 30, isFreePreview: false, isDownloadable: false },
          { id: 'l6', title: 'Kereső függvények (VLOOKUP, XLOOKUP)', type: 'video', durationMinutes: 28, isFreePreview: false, isDownloadable: false },
          { id: 'l7', title: 'Munkafüzet és letölthető segédlet', type: 'pdf', durationMinutes: 0, isFreePreview: false, isDownloadable: true },
        ],
      },
      {
        id: 's3',
        title: 'Adatelemzés és pivot táblák',
        lessons: [
          { id: 'l8', title: 'Pivot táblák létrehozása', type: 'video', durationMinutes: 35, isFreePreview: false, isDownloadable: false },
          { id: 'l9', title: 'Feltételes formázás', type: 'video', durationMinutes: 20, isFreePreview: false, isDownloadable: false },
          { id: 'l10', title: 'Makrók és automatizáció', type: 'video', durationMinutes: 40, isFreePreview: false, isDownloadable: false },
        ],
      },
    ],
    reviews: [
      { id: 'r1', studentName: 'Németh Katalin', rating: 5, date: '2026-07-20', comment: 'Nagyszerű kurzus, végre megértettem a pivot táblákat!' },
      { id: 'r2', studentName: 'Farkas Gábor', rating: 5, date: '2026-07-18', comment: 'Kovács Anna nagyon világosan magyaráz. Ajánlom mindenkinek.' },
      { id: 'r3', studentName: 'Szilágyi Éva', rating: 4, date: '2026-07-10', comment: 'Jó anyag, a makrós rész lehetne kicsit részletesebb.' },
    ],
    status: 'kozzeteva',
  },
  {
    id: 'co2',
    slug: 'online-marketing-kisvallalkozoknak',
    title: 'Online marketing kisvállalkozóknak',
    shortDescription:
      'Tanuld meg, hogyan építs hatékony online jelenlétet és szerezz ügyfeleket.',
    description:
      'Ez a kurzus kisvállalkozóknak szól, akik szeretnék növelni online láthatóságukat. Feldolgozzuk a social media marketinget, Google Ads-t, email marketinget és a tartalomstratégiát. Gyakorlati példákkal és sablonokkal.',
    category: 'Marketing',
    categorySlug: 'marketing',
    instructorId: 'i3',
    instructorName: 'Szabó Dóra',
    price: 32900,
    originalPrice: 49900,
    rating: 4.7,
    reviewCount: 198,
    studentCount: 980,
    durationMinutes: 540,
    difficulty: 'kezdő',
    type: 'mixed',
    hasDownloadableMaterials: true,
    hasLiveSession: true,
    coverColor: '#ff7f0f',
    lastUpdated: '2026-06-28',
    benefits: [
      'Saját marketing stratégia kidolgozása',
      'Social media és Google Ads alapok',
      'Letölthető sablonok és ellenőrző listák',
      'Élő Q&A szekció a kurzus végén',
    ],
    sections: [
      {
        id: 's1',
        title: 'Alapok',
        lessons: [
          { id: 'l1', title: 'Mi az online marketing?', type: 'video', durationMinutes: 15, isFreePreview: true, isDownloadable: false },
          { id: 'l2', title: 'Célközönség meghatározása', type: 'video', durationMinutes: 22, isFreePreview: false, isDownloadable: false },
        ],
      },
      {
        id: 's2',
        title: 'Csatornák és taktikák',
        lessons: [
          { id: 'l3', title: 'Facebook és Instagram marketing', type: 'video', durationMinutes: 35, isFreePreview: false, isDownloadable: false },
          { id: 'l4', title: 'Google Ads alapok', type: 'video', durationMinutes: 30, isFreePreview: false, isDownloadable: false },
          { id: 'l5', title: 'Email marketing', type: 'video', durationMinutes: 25, isFreePreview: false, isDownloadable: false },
          { id: 'l6', title: 'Marketing terv sablon', type: 'letoltheto-fajl', durationMinutes: 0, isFreePreview: false, isDownloadable: true },
        ],
      },
      {
        id: 's3',
        title: 'Mérés és optimalizálás',
        lessons: [
          { id: 'l7', title: 'Google Analytics alapok', type: 'video', durationMinutes: 28, isFreePreview: false, isDownloadable: false },
          { id: 'l8', title: 'Élő Q&A szekció', type: 'video', durationMinutes: 60, isFreePreview: false, isDownloadable: false },
        ],
      },
    ],
    reviews: [
      { id: 'r1', studentName: 'Balogh Andrea', rating: 5, date: '2026-07-05', comment: 'Gyakorlatias és használható tudást kaptam a saját vállalkozásomhoz.' },
      { id: 'r2', studentName: 'Papp László', rating: 4, date: '2026-06-30', comment: 'Jó áttekintés, a Google Ads rész lehetne mélyebb.' },
    ],
    status: 'kozzeteva',
  },
  {
    id: 'co3',
    slug: 'angol-allasinterju-felkeszito',
    title: 'Angol állásinterjú-felkészítő',
    shortDescription:
      'Készülj fel magabiztosan az angol nyelvű állásinterjúkra.',
    description:
      'Ez a kurzus felkészít az angol nyelvű állásinterjúk leggyakoribb kérdéseire és helyzeteire. Gyakorlati szerepjátékokkal, mintaválaszokkal és kiejtési tippekkel segít, hogy magabiztosan nyilatkozz.',
    category: 'Nyelvek',
    categorySlug: 'nyelvek',
    instructorId: 'i4',
    instructorName: 'Tóth Márton',
    price: 19900,
    rating: 4.9,
    reviewCount: 174,
    studentCount: 760,
    durationMinutes: 360,
    difficulty: 'kozepes',
    type: 'video',
    hasDownloadableMaterials: false,
    hasLiveSession: false,
    coverColor: '#ff9d37',
    lastUpdated: '2026-07-01',
    benefits: [
      'Leggyakoribb interjúkérdések és mintaválaszok',
      'Kiejtés és nyelvtani tippek',
      'Szerepjáték gyakorlatok',
      'Önéletrajz írása angolul',
    ],
    sections: [
      {
        id: 's1',
        title: 'Felkészülés',
        lessons: [
          { id: 'l1', title: 'Az interjú felépítése', type: 'video', durationMinutes: 18, isFreePreview: true, isDownloadable: false },
          { id: 'l2', title: 'Tell me about yourself', type: 'video', durationMinutes: 20, isFreePreview: false, isDownloadable: false },
        ],
      },
      {
        id: 's2',
        title: 'Kérdések és válaszok',
        lessons: [
          { id: 'l3', title: 'Strengths and weaknesses', type: 'video', durationMinutes: 25, isFreePreview: false, isDownloadable: false },
          { id: 'l4', title: 'Behavioral questions (STAR method)', type: 'video', durationMinutes: 30, isFreePreview: false, isDownloadable: false },
          { id: 'l5', title: 'Salary negotiation', type: 'video', durationMinutes: 22, isFreePreview: false, isDownloadable: false },
        ],
      },
      {
        id: 's3',
        title: 'Gyakorlás',
        lessons: [
          { id: 'l6', title: 'Szerepjáték: teljes interjú', type: 'video', durationMinutes: 45, isFreePreview: false, isDownloadable: false },
        ],
      },
    ],
    reviews: [
      { id: 'r1', studentName: 'Kovács Zsófia', rating: 5, date: '2026-07-12', comment: 'Sikerült megkapnom az állást! Köszönöm a felkészítést.' },
      { id: 'r2', studentName: 'Molnár Dávid', rating: 5, date: '2026-06-25', comment: 'Nagyon hasznos és gyakorlatias.' },
    ],
    status: 'kozzeteva',
  },
  {
    id: 'co4',
    slug: 'kezdo-webfejlesztes',
    title: 'Kezdő webfejlesztés',
    shortDescription:
      'Tanulj HTML, CSS és JavaScript alapokat az első weboldalad elkészítéséhez.',
    description:
      'Ez a kurzus a webfejlesztés alapjait tanítja HTML, CSS és JavaScript segítségével. A kurzus végére saját reszponzív weboldalt építesz. Letölthető kódpéldák és feladatok.',
    category: 'Informatika',
    categorySlug: 'informatika',
    instructorId: 'i2',
    instructorName: 'Nagy Péter',
    price: 29900,
    originalPrice: 45000,
    rating: 4.8,
    reviewCount: 256,
    studentCount: 1320,
    durationMinutes: 900,
    difficulty: 'kezdő',
    type: 'mixed',
    hasDownloadableMaterials: true,
    hasLiveSession: false,
    coverColor: '#476da6',
    lastUpdated: '2026-07-20',
    benefits: [
      'HTML, CSS és JavaScript alapok',
      'Saját reszponzív weboldal építése',
      'Letölthető kódpéldák',
      'Modern fejlesztőeszközök ismerete',
    ],
    sections: [
      {
        id: 's1',
        title: 'HTML alapok',
        lessons: [
          { id: 'l1', title: 'Mi az a HTML?', type: 'video', durationMinutes: 15, isFreePreview: true, isDownloadable: false },
          { id: 'l2', title: 'HTML struktúra és elemek', type: 'video', durationMinutes: 25, isFreePreview: false, isDownloadable: false },
        ],
      },
      {
        id: 's2',
        title: 'CSS és formázás',
        lessons: [
          { id: 'l3', title: 'CSS alapok', type: 'video', durationMinutes: 30, isFreePreview: false, isDownloadable: false },
          { id: 'l4', title: 'Reszponzív design', type: 'video', durationMinutes: 35, isFreePreview: false, isDownloadable: false },
          { id: 'l5', title: 'CSS gyakorló feladatok', type: 'letoltheto-fajl', durationMinutes: 0, isFreePreview: false, isDownloadable: true },
        ],
      },
      {
        id: 's3',
        title: 'JavaScript alapok',
        lessons: [
          { id: 'l6', title: 'Változók és adattípusok', type: 'video', durationMinutes: 28, isFreePreview: false, isDownloadable: false },
          { id: 'l7', title: 'DOM manipuláció', type: 'video', durationMinutes: 32, isFreePreview: false, isDownloadable: false },
          { id: 'l8', title: 'Eseménykezelés', type: 'video', durationMinutes: 25, isFreePreview: false, isDownloadable: false },
        ],
      },
      {
        id: 's4',
        title: 'Projekt',
        lessons: [
          { id: 'l9', title: 'Saját weboldal építése', type: 'video', durationMinutes: 60, isFreePreview: false, isDownloadable: false },
          { id: 'l10', title: 'Projekt forráskód', type: 'letoltheto-fajl', durationMinutes: 0, isFreePreview: false, isDownloadable: true },
        ],
      },
    ],
    reviews: [
      { id: 'r1', studentName: 'Oláh Bence', rating: 5, date: '2026-07-22', comment: 'Nagyon élvezetes volt, végre értem a webfejlesztést!' },
      { id: 'r2', studentName: 'Varga Nóra', rating: 4, date: '2026-07-15', comment: 'Jó tempó, a JavaScript rész kicsit gyors.' },
      { id: 'r3', studentName: 'Kis Ádám', rating: 5, date: '2026-07-08', comment: 'Kiváló oktató, világos magyarázatok.' },
    ],
    status: 'kozzeteva',
  },
  {
    id: 'co5',
    slug: 'penzugyi-tervezes-vallalkozoknak',
    title: 'Pénzügyi tervezés vállalkozóknak',
    shortDescription:
      'Tanuld meg a vállalkozás pénzügyi tervezésének és költségvetésének alapjait.',
    description:
      'Ez a kurzus a vállalkozók számára készült, akik meg akarják érteni a pénzügyi tervezést. Témák: cash flow, költségvetés, mutatószámok, adózás alapjai. Gyakorlati példákkal és letölthető sablonokkal.',
    category: 'Pénzügy',
    categorySlug: 'penzugy',
    instructorId: 'i1',
    instructorName: 'Kovács Anna',
    price: 38900,
    rating: 4.8,
    reviewCount: 145,
    studentCount: 620,
    durationMinutes: 480,
    difficulty: 'kozepes',
    type: 'mixed',
    hasDownloadableMaterials: true,
    hasLiveSession: false,
    coverColor: '#2b426d',
    lastUpdated: '2026-06-10',
    benefits: [
      'Cash flow tervezés és költségvetés',
      'Pénzügyi mutatószámok értelmezése',
      'Letölthető Excel sablonok',
      'Adózás alapjai vállalkozóknak',
    ],
    sections: [
      {
        id: 's1',
        title: 'Alapok',
        lessons: [
          { id: 'l1', title: 'Pénzügyi tervezés fontossága', type: 'video', durationMinutes: 18, isFreePreview: true, isDownloadable: false },
          { id: 'l2', title: 'Cash flow megértése', type: 'video', durationMinutes: 28, isFreePreview: false, isDownloadable: false },
        ],
      },
      {
        id: 's2',
        title: 'Költségvetés és mutatók',
        lessons: [
          { id: 'l3', title: 'Költségvetés készítése', type: 'video', durationMinutes: 35, isFreePreview: false, isDownloadable: false },
          { id: 'l4', title: 'Pénzügyi mutatószámok', type: 'video', durationMinutes: 30, isFreePreview: false, isDownloadable: false },
          { id: 'l5', title: 'Cash flow sablon', type: 'pdf', durationMinutes: 0, isFreePreview: false, isDownloadable: true },
        ],
      },
      {
        id: 's3',
        title: 'Adózás',
        lessons: [
          { id: 'l6', title: 'Adózás alapjai', type: 'video', durationMinutes: 40, isFreePreview: false, isDownloadable: false },
        ],
      },
    ],
    reviews: [
      { id: 'r1', studentName: 'Tóth Roland', rating: 5, date: '2026-06-20', comment: 'Végre rendet tettem a vállalkozásom pénzügyeiben.' },
    ],
    status: 'kozzeteva',
  },
  {
    id: 'co6',
    slug: 'precizios-mezogazdasag-alapjai',
    title: 'Precíziós mezőgazdaság alapjai',
    shortDescription:
      'Ismerd meg a modern technológiákat a hatékonyabb gazdálkodáshoz.',
    description:
      'Ez a kurzus a precíziós mezőgazdaság alapjait mutatja be: GPS-vezérelt gépek, drónos monitoring, talajvizsgálat és adatalapú döntéshozatal. Gyakorlati példákkal és esettanulmányokkal.',
    category: 'Mezőgazdaság',
    categorySlug: 'mezogazdasag',
    instructorId: 'i5',
    instructorName: 'Varga Eszter',
    price: 35900,
    rating: 4.8,
    reviewCount: 142,
    studentCount: 540,
    durationMinutes: 420,
    difficulty: 'kozepes',
    type: 'video',
    hasDownloadableMaterials: false,
    hasLiveSession: true,
    coverColor: '#6a90c2',
    lastUpdated: '2026-05-30',
    benefits: [
      'Modern precíziós technológiák megismerése',
      'Adatalapú döntéshozatal a gazdálkodásban',
      'Drónos monitoring alapjai',
      'Élő konzultáció a kurzus végén',
    ],
    sections: [
      {
        id: 's1',
        title: 'Bevezetés',
        lessons: [
          { id: 'l1', title: 'Mi a precíziós mezőgazdaság?', type: 'video', durationMinutes: 20, isFreePreview: true, isDownloadable: false },
          { id: 'l2', title: 'Előnyök és kihívások', type: 'video', durationMinutes: 25, isFreePreview: false, isDownloadable: false },
        ],
      },
      {
        id: 's2',
        title: 'Technológiák',
        lessons: [
          { id: 'l3', title: 'GPS-vezérelt gépek', type: 'video', durationMinutes: 35, isFreePreview: false, isDownloadable: false },
          { id: 'l4', title: 'Drónos monitoring', type: 'video', durationMinutes: 30, isFreePreview: false, isDownloadable: false },
          { id: 'l5', title: 'Talajvizsgálat', type: 'video', durationMinutes: 28, isFreePreview: false, isDownloadable: false },
        ],
      },
      {
        id: 's3',
        title: 'Gyakorlat',
        lessons: [
          { id: 'l6', title: 'Esettanulmány', type: 'video', durationMinutes: 40, isFreePreview: false, isDownloadable: false },
          { id: 'l7', title: 'Élő konzultáció', type: 'video', durationMinutes: 60, isFreePreview: false, isDownloadable: false },
        ],
      },
    ],
    reviews: [
      { id: 'r1', studentName: 'Balogh József', rating: 5, date: '2026-06-15', comment: 'Nagyon hasznos a gyakorlatban, köszönöm!' },
    ],
    status: 'kozzeteva',
  },
  {
    id: 'co7',
    slug: 'erettsegi-matematika-felkeszito',
    title: 'Érettségi matematika felkészítő',
    shortDescription:
      'Készülj fel az érettségi matematika vizsgára gyakorlati példákkal.',
    description:
      'Ez a kurzus az érettségi matematika vizsgára készít fel. Minden témakört feldolgozunk: algebra, geometria, függvények, valószínűség. Több száz feladat és megoldás.',
    category: 'Érettségi felkészítés',
    categorySlug: 'erettsegi-felkeszites',
    instructorId: 'i6',
    instructorName: 'Kiss Gábor',
    price: 27900,
    originalPrice: 39000,
    rating: 4.9,
    reviewCount: 287,
    studentCount: 1620,
    durationMinutes: 780,
    difficulty: 'kozepes',
    type: 'mixed',
    hasDownloadableMaterials: true,
    hasLiveSession: true,
    coverColor: '#f0610a',
    lastUpdated: '2026-07-25',
    benefits: [
      'Minden érettségi téma feldolgozása',
      'Több száz feladat megoldással',
      'Letölthető feladatgyűjtemény',
      'Élő konzultáció vizsga előtt',
    ],
    sections: [
      {
        id: 's1',
        title: 'Algebra',
        lessons: [
          { id: 'l1', title: 'Algebrai alapok', type: 'video', durationMinutes: 30, isFreePreview: true, isDownloadable: false },
          { id: 'l2', title: 'Egyenletek és egyenlőtlenségek', type: 'video', durationMinutes: 35, isFreePreview: false, isDownloadable: false },
        ],
      },
      {
        id: 's2',
        title: 'Geometria és függvények',
        lessons: [
          { id: 'l3', title: 'Síkgeometria', type: 'video', durationMinutes: 32, isFreePreview: false, isDownloadable: false },
          { id: 'l4', title: 'Függvények', type: 'video', durationMinutes: 38, isFreePreview: false, isDownloadable: false },
          { id: 'l5', title: 'Feladatgyűjtemény', type: 'pdf', durationMinutes: 0, isFreePreview: false, isDownloadable: true },
        ],
      },
      {
        id: 's3',
        title: 'Valószínűség és statisztika',
        lessons: [
          { id: 'l6', title: 'Valószínűség alapjai', type: 'video', durationMinutes: 28, isFreePreview: false, isDownloadable: false },
          { id: 'l7', title: 'Élő vizsgafelkészítő', type: 'video', durationMinutes: 90, isFreePreview: false, isDownloadable: false },
        ],
      },
    ],
    reviews: [
      { id: 'r1', studentName: 'Kovács Péter', rating: 5, date: '2026-07-28', comment: 'Kiváló felkészítő, ajánlom mindenkinek!' },
      { id: 'r2', studentName: 'Németh Anna', rating: 5, date: '2026-07-20', comment: 'Végre megértettem a valószínűségszámítást.' },
      { id: 'r3', studentName: 'Varga Bence', rating: 4, date: '2026-07-10', comment: 'Jó anyag, a geometria rész lehetne részletesebb.' },
    ],
    status: 'kozzeteva',
  },
  {
    id: 'co8',
    slug: 'canva-es-kozossegi-media-design',
    title: 'Canva és közösségi média design',
    shortDescription:
      'Tanulj meg látványos grafikákat készíteni Canva segítségével.',
    description:
      'Ez a kurzus a Canva és a közösségi média design alapjait tanítja. Tanulj meg látványos posztokat, borítóképeket és prezentációkat készíteni. Gyakorlati feladatokkal és inspirációkkal.',
    category: 'Kreatív készségek',
    categorySlug: 'kreativ-keszsegek',
    instructorId: 'i7',
    instructorName: 'Horváth Réka',
    price: 18900,
    rating: 4.7,
    reviewCount: 156,
    studentCount: 890,
    durationMinutes: 300,
    difficulty: 'kezdő',
    type: 'video',
    hasDownloadableMaterials: false,
    hasLiveSession: false,
    coverColor: '#9bb5d8',
    lastUpdated: '2026-07-05',
    benefits: [
      'Canva alapok és haladó funkciók',
      'Social media posztok tervezése',
      'Márkaépítés vizuálisan',
      'Gyakorlati design feladatok',
    ],
    sections: [
      {
        id: 's1',
        title: 'Canva alapok',
        lessons: [
          { id: 'l1', title: 'Canva bemutatkozás', type: 'video', durationMinutes: 15, isFreePreview: true, isDownloadable: false },
          { id: 'l2', title: 'Eszközök és funkciók', type: 'video', durationMinutes: 25, isFreePreview: false, isDownloadable: false },
        ],
      },
      {
        id: 's2',
        title: 'Social media design',
        lessons: [
          { id: 'l3', title: 'Instagram posztok', type: 'video', durationMinutes: 30, isFreePreview: false, isDownloadable: false },
          { id: 'l4', title: 'Facebook borítóképek', type: 'video', durationMinutes: 20, isFreePreview: false, isDownloadable: false },
          { id: 'l5', title: 'Sablonok és inspiráció', type: 'video', durationMinutes: 25, isFreePreview: false, isDownloadable: false },
        ],
      },
    ],
    reviews: [
      { id: 'r1', studentName: 'Székely Fruzsina', rating: 5, date: '2026-07-15', comment: 'Nagyon élvezetes, rengeteget tanultam!' },
      { id: 'r2', studentName: 'Nagy Lilla', rating: 4, date: '2026-07-01', comment: 'Jó bevezető a Canva világába.' },
    ],
    status: 'kozzeteva',
  },
  {
    id: 'co9',
    slug: 'vallalkozasinditas-lepesrol-lepesre',
    title: 'Vállalkozásindítás lépésről lépésre',
    shortDescription:
      'Tanuld meg a vállalkozásindítás lépéseit az ötlettől az indulásig.',
    description:
      'Ez a kurzus végigvezet a vállalkozásindítás teljes folyamatán: ötletvalidálás, üzleti terv, jogi formák, finanszírozás és piacra lépés. Gyakorlati példákkal és letölthető sablonokkal.',
    category: 'Üzlet és vállalkozás',
    categorySlug: 'uzlet-es-vallalkozas',
    instructorId: 'i8',
    instructorName: 'Varga Tamás',
    price: 42900,
    originalPrice: 59000,
    rating: 4.8,
    reviewCount: 203,
    studentCount: 1150,
    durationMinutes: 660,
    difficulty: 'kozepes',
    type: 'mixed',
    hasDownloadableMaterials: true,
    hasLiveSession: true,
    coverColor: '#365288',
    lastUpdated: '2026-07-12',
    benefits: [
      'Teljes vállalkozásindítási folyamat',
      'Üzleti terv sablon',
      'Jogi formák és finanszírozás',
      'Élő Q&A szekció',
    ],
    sections: [
      {
        id: 's1',
        title: 'Előkészületek',
        lessons: [
          { id: 'l1', title: 'Ötletvalidálás', type: 'video', durationMinutes: 25, isFreePreview: true, isDownloadable: false },
          { id: 'l2', title: 'Piackutatás', type: 'video', durationMinutes: 35, isFreePreview: false, isDownloadable: false },
        ],
      },
      {
        id: 's2',
        title: 'Tervezés és indulás',
        lessons: [
          { id: 'l3', title: 'Üzleti terv írása', type: 'video', durationMinutes: 40, isFreePreview: false, isDownloadable: false },
          { id: 'l4', title: 'Jogi formák', type: 'video', durationMinutes: 30, isFreePreview: false, isDownloadable: false },
          { id: 'l5', title: 'Üzleti terv sablon', type: 'letoltheto-fajl', durationMinutes: 0, isFreePreview: false, isDownloadable: true },
          { id: 'l6', title: 'Élő Q&A', type: 'video', durationMinutes: 60, isFreePreview: false, isDownloadable: false },
        ],
      },
    ],
    reviews: [
      { id: 'r1', studentName: 'Kovács Gábor', rating: 5, date: '2026-07-18', comment: 'Kiváló kurzus, segített elindítani a vállalkozásomat.' },
    ],
    status: 'kozzeteva',
  },
  {
    id: 'co10',
    slug: 'halado-javascript-es-react',
    title: 'Haladó JavaScript és React',
    shortDescription:
      'Mélyítsd el JavaScript tudásod és tanulj React alapoktól haladó szintig.',
    description:
      'Ez a kurzus a haladó JavaScript témákat és a React fejlesztést fedi le. Témák: async/await, ES6+, React komponensek, hooks, state management. Valós projektekkel.',
    category: 'Informatika',
    categorySlug: 'informatika',
    instructorId: 'i2',
    instructorName: 'Nagy Péter',
    price: 49900,
    rating: 4.8,
    reviewCount: 134,
    studentCount: 680,
    durationMinutes: 840,
    difficulty: 'halado',
    type: 'mixed',
    hasDownloadableMaterials: true,
    hasLiveSession: false,
    coverColor: '#476da6',
    lastUpdated: '2026-07-22',
    benefits: [
      'Haladó JavaScript (ES6+, async/await)',
      'React alapok és hooks',
      'State management',
      'Letölthető kódpéldák',
    ],
    sections: [
      {
        id: 's1',
        title: 'Haladó JavaScript',
        lessons: [
          { id: 'l1', title: 'ES6+ funkciók', type: 'video', durationMinutes: 35, isFreePreview: true, isDownloadable: false },
          { id: 'l2', title: 'Async/await', type: 'video', durationMinutes: 40, isFreePreview: false, isDownloadable: false },
        ],
      },
      {
        id: 's2',
        title: 'React alapok',
        lessons: [
          { id: 'l3', title: 'Komponensek és JSX', type: 'video', durationMinutes: 30, isFreePreview: false, isDownloadable: false },
          { id: 'l4', title: 'Hooks (useState, useEffect)', type: 'video', durationMinutes: 45, isFreePreview: false, isDownloadable: false },
          { id: 'l5', title: 'Kódpéldák', type: 'letoltheto-fajl', durationMinutes: 0, isFreePreview: false, isDownloadable: true },
        ],
      },
    ],
    reviews: [
      { id: 'r1', studentName: 'Szabó Márk', rating: 5, date: '2026-07-24', comment: 'Nagyon alapos, a hooks részt különösen hasznosnak találtam.' },
    ],
    status: 'kozzeteva',
  },
];

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getRelatedCourses(slug: string, limit = 3): Course[] {
  const course = getCourse(slug);
  if (!course) return [];
  return courses
    .filter((c) => c.slug !== slug && c.categorySlug === course.categorySlug)
    .slice(0, limit);
}
