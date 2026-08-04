'use client';

import { TrendingUp } from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { DashboardLayout } from '@/components/shared/DashboardSidebar';
import { instructorSidebarItems } from '@/components/shared/sidebarItems';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { StatisticCard } from '@/components/shared/StatisticCard';
import { instructorStats, instructorOrders } from '@/lib/instructorData';
import { formatHUF, formatDate, getOrderStatusLabel } from '@/lib/format';

export default function SalesPage() {
  return (
    <PageContainer showFooter={false}>
      <DashboardLayout items={instructorSidebarItems} title="Oktatói fiók">
        <h1 className="text-2xl font-bold text-navy-900 mb-6">Eladások</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatisticCard icon={TrendingUp} label="Havi eladás" value={String(instructorStats.monthlySales)} color="#365288" />
          <StatisticCard icon={TrendingUp} label="Havi bevétel" value={formatHUF(instructorStats.monthlyRevenue)} color="#2563eb" />
          <StatisticCard icon={TrendingUp} label="Átlag rendelés" value={formatHUF(Math.round(instructorStats.monthlyRevenue / instructorStats.monthlySales))} color="#2b426d" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
          <div className="divide-y divide-gray-50">
            {instructorOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-5">
                <div className="min-w-0">
                  <p className="font-medium text-navy-900 truncate">{order.itemTitle}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(order.date)}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="font-semibold text-navy-900">{formatHUF(order.amount)}</span>
                  <StatusBadge status={order.status} label={getOrderStatusLabel(order.status)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </PageContainer>
  );
}
