export function ErrorState({ error, onRetry, title = "Something went wrong" }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-600 mb-6">{error}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}