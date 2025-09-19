export function FavoriteButton({ isFavorite, onToggle, launchId }) {
  return (
    <button
      onClick={() => onToggle(launchId)}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      className="text-2xl p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
    >
      {isFavorite ? '⭐' : '☆'}
    </button>
  )
}