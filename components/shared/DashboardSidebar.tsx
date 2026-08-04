'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { Logo } from './Logo';

export interface SidebarItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardSidebarProps {
  items: SidebarItem[];
  title: string;
}

export function DashboardSidebar({ items, title }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== items[0]?.href && pathname.startsWith(href));

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-100">
        <Logo size="sm" />
        <p className="text-xs text-gray-400 mt-2">{title}</p>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-navy-900 text-white'
                  : 'text-gray-600 hover:bg-navy-50 hover:text-navy-900'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full bg-navy-900 text-white shadow-soft-lg flex items-center justify-center"
        aria-label="Menü megnyitása"
      >
        <Menu className="w-5 h-5" />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-soft-lg animate-fade-in overflow-y-auto">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 p-1.5 rounded-lg text-gray-400 hover:bg-gray-50"
              aria-label="Menü bezárása"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-gray-100 bg-white sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        {sidebarContent}
      </aside>
    </>
  );
}

interface DashboardLayoutProps {
  items: SidebarItem[];
  title: string;
  children: React.ReactNode;
}

export function DashboardLayout({ items, title, children }: DashboardLayoutProps) {
  return (
    <div className="flex">
      <DashboardSidebar items={items} title={title} />
      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">{children}</div>
    </div>
  );
}
