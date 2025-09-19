export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  loading = false 
}) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const start = Math.max(1, currentPage - 2)
      const end = Math.min(totalPages, start + maxVisible - 1)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-8 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>
      
      {getPageNumbers().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={loading}
          className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed transition-colors ${
            page === currentPage
              ? 'bg-blue-600 text-white border-blue-600 font-semibold'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  )
}