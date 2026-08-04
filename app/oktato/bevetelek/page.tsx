'use client';

import { DollarSign, TrendingUp, Wallet } from 'lucide-react';
import { PageContainer } from '@/components/shared/PageContainer';
import { DashboardLayout } from '@/components/shared/DashboardSidebar';
import { instructorSidebarItems } from '@/components/shared/sidebarItems';
import { StatisticCard } from '@/components/shared/StatisticCard';
import { instructorStats, instructorOrders } from '@/lib/instructorData';
import { formatHUF, formatDate, getOrderStatusLabel } from '@/lib/format';
import { StatusBadge } from '@/components/shared/StatusBadge';

const monthlyData = [
  { month: 'Március', revenue: 98000 },
  { month: 'Április', revenue: 112000 },
  { month: 'Május', revenue: 128000 },
  { month: 'Június', revenue: 135000 },
  { month: 'Július', revenue: 142000 },
  { month: 'Augusztus', revenue: 142000 },
];

export default function RevenuePage() {
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  return (
    <PageContainer showFooter={false}>
      <DashboardLayout items={instructorSidebarItems} title="Oktatói fiók">
        <h1 className="text-2xl font-bold text-navy-900 mb-6">Bevételek</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatisticCard icon={Wallet} label="Teljes bevétel" value={formatHUF(instructorStats.totalRevenue)} color="#365288" />
          <StatisticCard icon={TrendingUp} label="Havi bevétel" value={formatHUF(instructorStats.monthlyRevenue)} trend="+5%" color="#2563eb" />
          <StatisticCard icon={DollarSign} label="Kifizetésre vár" value={formatHUF(instructorStats.monthlyRevenue)} color="#2b426d" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 mb-6">
          <h2 className="text-lg font-semibold text-navy-900 mb-6">Havi bevétel</h2>
          <div className="flex items-end justify-between gap-4 h-48">
            {monthlyData.map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-navy-700 to-navy-500 rounded-t-lg transition-all hover:from-cobalt-600 hover:to-cobalt-400"
                    style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                    title={formatHUF(data.revenue)}
                  />
                </div>
                <span className="text-xs text-gray-500">{data.month}</span>
                <span className="text-xs font-medium text-navy-900">{formatHUF(data.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
          <h2 className="text-lg font-semibold text-navy-900 p-5">Kifizetések</h2>
          <div className="divide-y divide-gray-50">
            {instructorOrders.filter((o) => o.status === 'fizetve').map((order) => (
              <div key={order.id} className="flex items-center justify-between p-5">
                <div>
                  <p className="font-medium text-navy-900 text-sm">{order.itemTitle}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(order.date)}</p>
                </div>
                <div className="flex items-center gap-3">
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
