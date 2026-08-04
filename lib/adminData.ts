export interface AdminPendingItem {
  id: string;
  title: string;
  type: 'course' | 'live' | 'instructor';
  submitter: string;
  date: string;
  category: string;
}

export interface AdminOrder {
  id: string;
  date: string;
  customer: string;
  itemTitle: string;
  itemType: 'course' | 'live';
  amount: number;
  status: 'fizetesre-var' | 'fizetve' | 'visszateritve' | 'sikertelen';
}

export interface AdminReport {
  id: string;
  title: string;
  type: 'course' | 'live' | 'review';
  reporter: string;
  reason: string;
  date: string;
}

export const adminPendingItems: AdminPendingItem[] = [
  { id: 'ap1', title: 'Excel haladóknak - Adatelemzés', type: 'course', submitter: 'Kovács Anna', date: '2026-08-01', category: 'Üzlet és vállalkozás' },
  { id: 'ap2', title: 'React Native alapok', type: 'course', submitter: 'Nagy Péter', date: '2026-08-02', category: 'Informatika' },
  { id: 'ap3', title: 'Excel haladó konzultáció', type: 'live', submitter: 'Kovács Anna', date: '2026-08-02', category: 'Üzlet és vállalkozás' },
  { id: 'ap4', title: 'SEO mesterkurzus', type: 'course', submitter: 'Szabó Dóra', date: '2026-08-03', category: 'Marketing' },
  { id: 'ap5', title: 'Német kezdő kurzus', type: 'instructor', submitter: 'Tóth Márton', date: '2026-08-03', category: 'Nyelvek' },
];

export const adminOrders: AdminOrder[] = [
  { id: 'ao1', date: '2026-08-03', customer: 'Németh Katalin', itemTitle: 'Excel az alapoktól a magabiztos használatig', itemType: 'course', amount: 24900, status: 'fizetve' },
  { id: 'ao2', date: '2026-08-03', customer: 'Farkas Gábor', itemTitle: 'Kezdő webfejlesztés', itemType: 'course', amount: 29900, status: 'fizetve' },
  { id: 'ao3', date: '2026-08-02', customer: 'Szilágyi Éva', itemTitle: 'Kezdő Excel élő workshop', itemType: 'live', amount: 12900, status: 'fizetve' },
  { id: 'ao4', date: '2026-08-02', customer: 'Oláh Bence', itemTitle: 'Angol állásinterjú-felkészítő', itemType: 'course', amount: 19900, status: 'fizetesre-var' },
  { id: 'ao5', date: '2026-08-01', customer: 'Varga Nóra', itemTitle: 'Canva és közösségi média design', itemType: 'course', amount: 18900, status: 'fizetve' },
  { id: 'ao6', date: '2026-08-01', customer: 'Kis Ádám', itemTitle: 'Érettségi matematika felkészítő', itemType: 'course', amount: 27900, status: 'visszateritve' },
];

export const adminReports: AdminReport[] = [
  { id: 'ar1', title: 'Online marketing kisvállalkozóknak', type: 'course', reporter: 'Kovács Péter', reason: 'Elavult információ a 3. leckében', date: '2026-08-02' },
  { id: 'ar2', title: 'Kezdő Excel élő workshop - Q&A', type: 'review', reporter: 'Németh Katalin', reason: 'Spam hozzászólás', date: '2026-08-01' },
];

export const adminStats = {
  totalRevenue: 2840000,
  monthlyRevenue: 486000,
  totalUsers: 3420,
  totalInstructors: 87,
  totalCourses: 156,
  totalLiveEvents: 42,
  pendingApprovals: 5,
  monthlyOrders: 128,
};
