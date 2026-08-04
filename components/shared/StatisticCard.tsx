import { LucideIcon } from 'lucide-react';

interface StatisticCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: string;
  color?: string;
}

export function StatisticCard({
  icon: Icon,
  label,
  value,
  trend,
  color = '#365288',
}: StatisticCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5">
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {trend && (
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-navy-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}
