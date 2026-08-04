import type { Order, Notification, EnrolledCourse, UpcomingLive, RecentLesson } from '@/types';

export const enrolledCourses: EnrolledCourse[] = [
  {
    courseId: 'co1',
    courseSlug: 'excel-az-alapoktol-a-magabiztos-hasznalatig',
    title: 'Excel az alapoktól a magabiztos használatig',
    instructorName: 'Kovács Anna',
    coverColor: '#365288',
    progress: 65,
    totalLessons: 10,
    completedLessons: 6,
    lastAccessed: '2026-08-02',
  },
  {
    courseId: 'co4',
    courseSlug: 'kezdo-webfejlesztes',
    title: 'Kezdő webfejlesztés',
    instructorName: 'Nagy Péter',
    coverColor: '#476da6',
    progress: 32,
    totalLessons: 10,
    completedLessons: 3,
    lastAccessed: '2026-08-03',
  },
  {
    courseId: 'co7',
    courseSlug: 'erettsegi-matematika-felkeszito',
    title: 'Érettségi matematika felkészítő',
    instructorName: 'Kiss Gábor',
    coverColor: '#f0610a',
    progress: 28,
    totalLessons: 7,
    completedLessons: 2,
    lastAccessed: '2026-07-30',
  },
];

export const upcomingLives: UpcomingLive[] = [
  {
    liveEventId: 'le1',
    liveEventSlug: 'kezdo-excel-elo-workshop',
    title: 'Kezdő Excel élő workshop',
    instructorName: 'Kovács Anna',
    date: '2026-08-15',
    startTime: '17:00',
    coverColor: '#365488',
  },
];

export const recentLessons: RecentLesson[] = [
  {
    courseId: 'co1',
    courseSlug: 'excel-az-alapoktol-a-magabiztos-hasznalatig',
    courseTitle: 'Excel az alapoktól a magabiztos használatig',
    lessonTitle: 'Kereső függvények (VLOOKUP, XLOOKUP)',
    coverColor: '#365288',
    watchedAt: '2026-08-02',
  },
  {
    courseId: 'co4',
    courseSlug: 'kezdo-webfejlesztes',
    courseTitle: 'Kezdő webfejlesztés',
    lessonTitle: 'CSS alapok',
    coverColor: '#476da6',
    watchedAt: '2026-08-03',
  },
  {
    courseId: 'co7',
    courseSlug: 'erettsegi-matematika-felkeszito',
    courseTitle: 'Érettségi matematika felkészítő',
    lessonTitle: 'Egyenletek és egyenlőtlenségek',
    coverColor: '#f0610a',
    watchedAt: '2026-07-30',
  },
];

export const orders: Order[] = [
  {
    id: 'o1',
    date: '2026-07-15',
    itemTitle: 'Excel az alapoktól a magabiztos használatig',
    itemType: 'course',
    amount: 24900,
    status: 'fizetve',
    itemId: 'co1',
  },
  {
    id: 'o2',
    date: '2026-07-20',
    itemTitle: 'Kezdő webfejlesztés',
    itemType: 'course',
    amount: 29900,
    status: 'fizetve',
    itemId: 'co4',
  },
  {
    id: 'o3',
    date: '2026-07-25',
    itemTitle: 'Érettségi matematika felkészítő',
    itemType: 'course',
    amount: 27900,
    status: 'fizetve',
    itemId: 'co7',
  },
  {
    id: 'o4',
    date: '2026-08-01',
    itemTitle: 'Kezdő Excel élő workshop',
    itemType: 'live',
    amount: 12900,
    status: 'fizetve',
    itemId: 'le1',
  },
  {
    id: 'o5',
    date: '2026-08-03',
    itemTitle: 'Haladó JavaScript és React',
    itemType: 'course',
    amount: 49900,
    status: 'fizetesre-var',
    itemId: 'co10',
  },
];

export const notifications: Notification[] = [
  {
    id: 'n1',
    title: 'Élő oktatás hamarosan kezdődik',
    message: 'A "Kezdő Excel élő workshop" 2026. augusztus 15-én 17:00-kor kezdődik.',
    date: '2026-08-04',
    read: false,
    type: 'info',
  },
  {
    id: 'n2',
    title: 'Új lecke érhető el',
    message: 'A "Haladó JavaScript és React" kurzushoz új leckék kerültek hozzáadásra.',
    date: '2026-08-03',
    read: false,
    type: 'success',
  },
  {
    id: 'n3',
    title: 'Fizetésre vár',
    message: 'A "Haladó JavaScript és React" kurzus vásárlása fizetésre vár.',
    date: '2026-08-03',
    read: true,
    type: 'warning',
  },
];
