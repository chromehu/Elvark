interface FilterOption {
  value: string;
  label: string;
}

interface FilterGroupProps {
  label: string;
  options: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

export function FilterGroup({ label, options, selectedValue, onChange }: FilterGroupProps) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-navy-900 mb-3">{label}</h4>
      <div className="space-y-1.5">
        <button
          onClick={() => onChange('')}
          className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
            selectedValue === ''
              ? 'bg-navy-900 text-white font-medium'
              : 'text-gray-600 hover:bg-navy-50'
          }`}
        >
          Mind
        </button>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
              selectedValue === opt.value
                ? 'bg-navy-900 text-white font-medium'
                : 'text-gray-600 hover:bg-navy-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface FilterPanelProps {
  children: React.ReactNode;
}

export function FilterPanel({ children }: FilterPanelProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 space-y-6">
      {children}
    </div>
  );
}
