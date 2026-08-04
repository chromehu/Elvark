import { Search } from 'lucide-react';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchField({
  value,
  onChange,
  placeholder = 'Keresés...',
  className = '',
}: SearchFieldProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-navy-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cobalt-400 focus:border-transparent transition-all"
      />
    </div>
  );
}
