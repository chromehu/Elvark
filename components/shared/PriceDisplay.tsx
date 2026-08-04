import { formatHUF } from '@/lib/format';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { price: 'text-base', original: 'text-xs' },
  md: { price: 'text-lg', original: 'text-sm' },
  lg: { price: 'text-2xl', original: 'text-base' },
};

export function PriceDisplay({ price, originalPrice, size = 'md' }: PriceDisplayProps) {
  const s = sizeMap[size];

  if (price === 0) {
    return <span className={`${s.price} font-bold text-green-600`}>Ingyenes</span>;
  }

  return (
    <div className="flex items-baseline gap-2">
      <span className={`${s.price} font-bold text-navy-900`}>{formatHUF(price)}</span>
      {originalPrice && originalPrice > price && (
        <span className={`${s.original} text-gray-400 line-through`}>
          {formatHUF(originalPrice)}
        </span>
      )}
    </div>
  );
}
