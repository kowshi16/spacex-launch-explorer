import { LaunchCard } from './LaunchCard'
import { LaunchCardSkeleton } from './LoadingSkeleton'
import { ErrorState } from './ErrorState'

export function LaunchList({ 
  launches, 
  loading, 
  error, 
  onRetry, 
  favorites, 
  onToggleFavorite, 
  onLaunchClick 
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <LaunchCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />
  }

  if (!launches || launches.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No launches found</h3>
        <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {launches.map(launch => (
        <LaunchCard
          key={launch.id}
          launch={launch}
          isFavorite={favorites.has(launch.id)}
          onToggleFavorite={onToggleFavorite}
          onClick={() => onLaunchClick(launch.id)}
        />
      ))}
    </div>
  )
}