'use client';

import {
  LayoutDashboard, BookOpen, Radio, ShoppingBag, User,
  PlusCircle, Video, DollarSign, TrendingUp, Users,
  Settings, BookCopy, Package, CreditCard
} from 'lucide-react';
import type { SidebarItem } from '@/components/shared/DashboardSidebar';

export const studentSidebarItems: SidebarItem[] = [
  { href: '/fiokom', label: 'Áttekintés', icon: LayoutDashboard },
  { href: '/fiokom/kurzusaim', label: 'Kurzusaim', icon: BookOpen },
  { href: '/fiokom/elo-oktatasaim', label: 'Élő oktatásaim', icon: Radio },
  { href: '/fiokom/vasarlasaim', label: 'Vásárlásaim', icon: ShoppingBag },
  { href: '/fiokom/profilom', label: 'Profilom', icon: User },
];

export const instructorSidebarItems: SidebarItem[] = [
  { href: '/oktato', label: 'Áttekintés', icon: LayoutDashboard },
  { href: '/oktato/kurzusok', label: 'Kurzusaim', icon: BookOpen },
  { href: '/oktato/kurzusok/uj', label: 'Új kurzus', icon: PlusCircle },
  { href: '/oktato/elo-oktatasok', label: 'Élő oktatásaim', icon: Radio },
  { href: '/oktato/elo-oktatasok/uj', label: 'Új élő oktatás', icon: Video },
  { href: '/oktato/eladasok', label: 'Eladások', icon: TrendingUp },
  { href: '/oktato/bevetelek', label: 'Bevételek', icon: DollarSign },
  { href: '/oktato/profil', label: 'Oktatói profil', icon: User },
];

export const adminSidebarItems: SidebarItem[] = [
  { href: '/admin', label: 'Áttekintés', icon: LayoutDashboard },
  { href: '/admin/felhasznalok', label: 'Felhasználók', icon: Users },
  { href: '/admin/oktatok', label: 'Oktatók', icon: BookCopy },
  { href: '/admin/kurzusok', label: 'Kurzusok', icon: BookOpen },
  { href: '/admin/elo-oktatasok', label: 'Élő oktatások', icon: Radio },
  { href: '/admin/rendelesek', label: 'Rendelések', icon: Package },
  { href: '/admin/kifizetesek', label: 'Kifizetések', icon: CreditCard },
  { href: '/admin/beallitasok', label: 'Beállítások', icon: Settings },
];
