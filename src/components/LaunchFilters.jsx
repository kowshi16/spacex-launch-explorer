import React, { useMemo } from 'react';
import { getUniqueYears } from '../utils/helpers';

export const LaunchFilters = ({ 
  launches, 
  filters, 
  onFilterChange, 
  onSearchChange,
  searchValue 
}) => {
  const years = useMemo(() => getUniqueYears(launches), [launches]);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Missions
          </label>
          <input
            id="search"
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by mission name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Year Filter */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
            Launch Year
          </label>
          <select
            id="year"
            value={filters.year}
            onChange={(e) => onFilterChange('year', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Success Filter */}
        <div>
          <label htmlFor="success" className="block text-sm font-medium text-gray-700 mb-1">
            Launch Status
          </label>
          <select
            id="success"
            value={filters.success}
            onChange={(e) => onFilterChange('success', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Launches</option>
            <option value="success">Successful</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Favorites Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            View Options
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.favoritesOnly}
              onChange={(e) => onFilterChange('favoritesOnly', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Show Only Favorites</span>
          </label>
        </div>
      </div>
    </div>
  );
};