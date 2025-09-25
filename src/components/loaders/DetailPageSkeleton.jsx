export function DetailPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="skeleton h-6 w-1/4 mb-4" />
        <div className="flex space-x-4">
          <div className="skeleton h-4 w-1/6" />
          <div className="skeleton h-4 w-1/6" />
        </div>
        <div className="skeleton h-10 w-40 mt-4" />
      </div>

      {/* Rocket + Launchpad Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
          <div className="skeleton h-5 w-1/3" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-3/4" />
          <div className="flex space-x-4">
            <div className="skeleton h-4 w-1/4" />
            <div className="skeleton h-4 w-1/4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
          <div className="skeleton h-5 w-1/3" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
          <div className="skeleton h-4 w-2/3" />
          <div className="skeleton h-4 w-1/2" />
        </div>
      </div>

      {/* Mission Payloads */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="skeleton h-5 w-1/4 mb-4" />
        <div className="skeleton h-10 w-full" />
      </div>

      {/* Additional Resources */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="skeleton h-5 w-1/3 mb-4" />
        <div className="skeleton h-8 w-32" />
      </div>
    </div>
  );
}
