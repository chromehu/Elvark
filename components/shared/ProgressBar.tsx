interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const heightMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3.5',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showLabel = false,
  size = 'md',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm text-navy-700">{label ?? 'Folyamat'}</span>
          <span className="text-sm font-semibold text-navy-900">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={`w-full ${heightMap[size]} bg-navy-100 rounded-full overflow-hidden`}
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-gradient-to-r from-cobalt-600 to-teal-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
