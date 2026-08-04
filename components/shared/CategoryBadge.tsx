interface CategoryBadgeProps {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ label, color, size = 'sm' }: CategoryBadgeProps) {
  const padding = size === 'sm' ? 'px-2.5 py-1' : 'px-3 py-1.5';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${padding} ${textSize} bg-navy-50 text-navy-700`}
      style={color ? { backgroundColor: `${color}15`, color } : undefined}
    >
      {label}
    </span>
  );
}
