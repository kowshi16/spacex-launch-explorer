export function SuccessBadge({ success }) {
  const isSuccess = success === true
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isSuccess 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}
    >
      {isSuccess ? '✓ Success' : '✗ Failed'}
    </span>
  )
}