import { useState, useEffect } from 'react'

export function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleError = (error, errorInfo) => {
      console.error('Error caught by boundary:', error, errorInfo)
      setHasError(true)
      setError(error)
    }

    // Listen for unhandled promise rejections
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      setHasError(true)
      setError(event.reason)
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6">An unexpected error occurred. Please try refreshing the page.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    )
  }

  return children
}