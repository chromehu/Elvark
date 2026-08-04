interface StatusBadgeProps {
  status: string;
  label: string;
}

const statusColorMap: Record<string, string> = {
  piszkozat: 'bg-gray-100 text-gray-600',
  'jovahagyasra-var': 'bg-amber-100 text-amber-700',
  kozzeteva: 'bg-green-100 text-green-700',
  elutasitva: 'bg-red-100 text-red-700',
  archivalva: 'bg-gray-100 text-gray-500',
  meghirdetve: 'bg-green-100 text-green-700',
  betelt: 'bg-orange-100 text-orange-700',
  folyamatban: 'bg-blue-100 text-blue-700',
  befejezve: 'bg-gray-100 text-gray-600',
  lemondva: 'bg-red-100 text-red-700',
  'fizetesre-var': 'bg-amber-100 text-amber-700',
  fizetve: 'bg-green-100 text-green-700',
  visszateritve: 'bg-red-100 text-red-700',
  sikertelen: 'bg-red-100 text-red-700',
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const colorClass = statusColorMap[status] ?? 'bg-gray-100 text-gray-600';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}
    >
      {label}
    </span>
  );
}
