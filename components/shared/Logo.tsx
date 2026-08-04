interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  variant?: 'light' | 'dark';
}

const sizeMap = {
  sm: { icon: 'w-4 h-4', text: 'text-lg', gap: 'gap-1.5' },
  md: { icon: 'w-5 h-5', text: 'text-xl', gap: 'gap-2' },
  lg: { icon: 'w-7 h-7', text: 'text-3xl', gap: 'gap-2.5' },
};

export function Logo({ size = 'md', showText = true, className = '', variant = 'dark' }: LogoProps) {
  const s = sizeMap[size];
  const textColor = variant === 'light' ? 'text-white' : 'text-navy-900';

  return (
    <div className={`flex items-center ${s.gap} ${className}`}>
      <svg
        className={s.icon}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M4 4h10v2.5H4V4zm0 6.75h7v2.5H4v-2.5zM4 17.5h10V20H4v-2.5z"
          fill="currentColor"
          className="text-navy-800"
        />
        <path
          d="M16 8.5l5 3.5-5 3.5v-7z"
          fill="currentColor"
          className="text-cobalt-500"
        />
      </svg>
      {showText && (
        <span className={`font-bold tracking-tight ${s.text} ${textColor}`}>
          ELVARK
        </span>
      )}
    </div>
  );
}
