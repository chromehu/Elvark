interface DemoBadgeProps {
  className?: string;
}

export function DemoBadge({ className = '' }: DemoBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-cobalt-50 text-cobalt-600 ${className}`}
    >
      Demóadat
    </span>
  );
}
