import { useMemo } from "react";
import { getUniqueYears } from "../utils/helpers";

export const LaunchFilters = ({
  launches,
  filters,
  onFilterChange,
  onSearchChange,
  onResetFilters,
  searchValue,
}) => {
  const years = useMemo(() => getUniqueYears(launches), [launches]);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-4 sm:p-6 mb-8 max-w-7xl mx-auto border border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative">
          <label htmlFor="search" className="block text-sm font-semibold text-gray-900 mb-1.5">
            Search Missions
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by mission name..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white hover:border-purple-300"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Year Filter */}
        <div className="relative">
          <label htmlFor="year" className="block text-sm font-semibold text-gray-900 mb-1.5">
            Filter by Year
          </label>
          <div className="relative">
            <select
              id="year"
              key={`year-${filters.year}`}
              value={filters.year}
              onChange={(e) => onFilterChange('year', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white hover:border-purple-300 appearance-none"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Success Filter */}
        <div className="relative">
          <label htmlFor="success" className="block text-sm font-semibold text-gray-900 mb-1.5">
            Filter by Launch Status
          </label>
          <div className="relative">
            <select
              id="success"
              key={`success-${filters.success}`}
              value={filters.success}
              onChange={(e) => onFilterChange('success', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white hover:border-purple-300 appearance-none"
            >
              <option value="all">All</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Sort Filter */}
        <div className="relative">
          <label htmlFor="sort" className="block text-sm font-semibold text-gray-900 mb-1.5">
            Sort by Date
          </label>
          <div className="relative">
            <select
              id="sort"
              key={`sort-${filters.sortOrder}`}
              value={filters.sortOrder}
              onChange={(e) => onFilterChange('sortOrder', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white hover:border-purple-300 appearance-none"
            >
              <option value="newest">Newest to Oldest</option>
              <option value="oldest">Oldest to Newest</option>
            </select>
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m4 4l-4 4m-4-12V4" />
            </svg>
          </div>
        </div>

        {/* Favorites Filter */}
        <div className="relative">
          <label htmlFor="favorites" className="block text-sm font-semibold text-gray-900 mb-1.5">
            Favorites
          </label>
          <div className="relative flex items-center h-10">
            <input
              id="favorites"
              type="checkbox"
              checked={filters.favoritesOnly}
              onChange={(e) => onFilterChange('favoritesOnly', e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 cursor-pointer border-gray-200 rounded transition-all"
            />
            <label htmlFor="favorites" className="ml-2 text-sm text-gray-700">Show Favorites</label>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => {
            console.log('Reset Filters Clicked'); // Debug reset
            onResetFilters();
          }}
          className="px-6 py-3 bg-purple-600 cursor-pointer text-white text-sm font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};
