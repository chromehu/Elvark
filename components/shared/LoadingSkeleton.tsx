export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-48 bg-gray-200 rounded-xl" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-5 bg-gray-200 rounded w-4/5" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex justify-between pt-2">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-6 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}
