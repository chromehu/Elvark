'use client';

import { ShoppingBag } from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { DashboardLayout } from '@/components/shared/DashboardSidebar';
import { studentSidebarItems } from '@/components/shared/sidebarItems';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { orders } from '@/lib/studentData';
import { formatHUF, formatDate, getOrderStatusLabel } from '@/lib/format';

export default function MyOrdersPage() {
  return (
    <PageContainer showFooter={false}>
      <DashboardLayout items={studentSidebarItems} title="Hallgatói fiók">
        <h1 className="text-2xl font-bold text-navy-900 mb-6">Vásárlásaim</h1>
        {orders.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="Még nincs vásárlásod" />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
            <div className="divide-y divide-gray-50">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-5">
                  <div className="min-w-0">
                    <p className="font-medium text-navy-900 truncate">{order.itemTitle}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(order.date)} - {order.itemType === 'course' ? 'Kurzus' : 'Élő oktatás'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="font-semibold text-navy-900">{formatHUF(order.amount)}</span>
                    <StatusBadge status={order.status} label={getOrderStatusLabel(order.status)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DashboardLayout>
    </PageContainer>
  );
}
