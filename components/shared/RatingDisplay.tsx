import { Star } from 'lucide-react';

interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  showCount?: boolean;
}

export function RatingDisplay({
  rating,
  reviewCount,
  size = 'sm',
  showCount = true,
}: RatingDisplayProps) {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-sm' : 'text-base';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`${iconSize} ${
              i <= Math.round(rating) ? 'text-cobalt-500' : 'text-gray-200'
            }`}
            fill={i <= Math.round(rating) ? 'currentColor' : 'none'}
          />
        ))}
      </div>
      <span className={`${textSize} font-semibold text-navy-900`}>
        {rating.toFixed(1)}
      </span>
      {showCount && reviewCount !== undefined && (
        <span className={`${textSize} text-gray-500`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
