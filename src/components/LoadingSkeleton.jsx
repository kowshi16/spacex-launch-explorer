export function LoadingSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton h-4 w-full" />
      ))}
    </div>
  )
}

export function LaunchCardSkeleton() {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="skeleton h-6 w-3/4 mb-2" />
      <div className="skeleton h-4 w-1/2 mb-2" />
      <div className="skeleton h-4 w-3/5 mb-2" />
      <div className="skeleton h-4 w-2/5" />
    </div>
  )
}