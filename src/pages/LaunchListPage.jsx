import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { LaunchCard } from "../components/LaunchCard";
import { LaunchFilters } from "../components/LaunchFilters";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { Button } from "../components/Button";
import { useSpaceXAPI } from "../hooks/useSpaceXAPI";
import { useFavorites } from "../hooks/useFavorites";
import { filterLaunches, sortLaunchesByDate, debounce } from "../utils/helpers";

const ITEMS_PER_PAGE = 12;

export const LaunchListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );
  const [debouncedSearch, setDebouncedSearch] = useState(
    searchParams.get("search") || ""
  );

  const { launches, loading, error, fetchLaunches, retry } = useSpaceXAPI();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Filters from URL params
  const filters = {
    search: debouncedSearch,
    year: searchParams.get("year") || "",
    success: searchParams.get("success") || "all",
    sortOrder: searchParams.get("sort") || "newest",
    favoritesOnly: searchParams.get("favorites") === "true",
    favorites,
  };

  // Debounced search handler
  const debouncedSetSearch = useCallback(
    debounce((value) => {
      setDebouncedSearch(value);
    }, 400),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchValue);
  }, [searchValue, debouncedSetSearch]);

  // Update URL when filters change
  useEffect(() => {
    console.log("Filters:", filters);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (filters.year) params.set("year", filters.year);
    if (filters.success !== "all") params.set("success", filters.success);
    if (filters.sortOrder !== "newest") params.set("sort", filters.sortOrder);
    if (filters.favoritesOnly) params.set("favorites", "true");

    setSearchParams(params, { replace: true });
    setCurrentPage(1); // Reset pagination when filters change
  }, [
    debouncedSearch,
    filters.year,
    filters.success,
    filters.sortOrder,
    filters.favoritesOnly,
    setSearchParams,
  ]);

  // Fetch launches on mount
  useEffect(() => {
    fetchLaunches();
  }, [fetchLaunches]);

  // Filter and sort launches
  const filteredLaunches = useMemo(() => {
    const filtered = filterLaunches(launches, filters);
    return sortLaunchesByDate(filtered, filters.sortOrder);
  }, [launches, filters]);

  // Paginate launches
  const paginatedLaunches = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLaunches.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredLaunches, currentPage]);

  const totalPages = Math.ceil(filteredLaunches.length / ITEMS_PER_PAGE);

  const handleFilterChange = (key, value) => {
    console.log(`handleFilterChange: ${key} = ${value}`); // Debug filter changes
    const params = new URLSearchParams(searchParams);
    switch (key) {
      case "year":
        if (value) params.set("year", value);
        else params.delete("year");
        break;
      case "success":
        if (value !== "all") params.set("success", value);
        else params.delete("success");
        break;
      case "sortOrder":
        if (value !== "newest") params.set("sort", value);
        else params.delete("sort");
        break;
      case "favoritesOnly":
        if (value) params.set("favorites", "true");
        else params.delete("favorites");
        break;
      default:
        break;
    }
    setSearchParams(params, { replace: true });
  };

  // Handle reset all filters
  const resetFilters = () => {
    console.log("Reset Filters Called"); // Debug reset
    setSearchValue("");
    setDebouncedSearch("");
    setSearchParams({}, { replace: true }); // Clear all URL params
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  if (loading) {
    return (
      <div>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-20 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
        <LoadingSkeleton count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Failed to load launches
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={retry} variant="primary">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          SpaceX Launches
        </h1>
        <p className="text-gray-600">
          Explore {launches.length} SpaceX launches and discover mission details
        </p>
      </div>

      <LaunchFilters
        key={`${filters.year}-${filters.success}-${filters.sortOrder}`}
        launches={launches}
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        onResetFilters={resetFilters}
        searchValue={searchValue}
      />

      {filteredLaunches.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No launches found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters to see more results
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 text-sm text-gray-600">
            Showing {paginatedLaunches.length} of {filteredLaunches.length}{" "}
            launches
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedLaunches.map((launch) => (
              <LaunchCard
                key={launch.id}
                launch={launch}
                isFavorite={isFavorite(launch.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-3 mb-8">
              <Button
                variant="secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-6 py-3 bg-gray-100 text-gray-700 cursor-pointer rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
              >
                Previous
              </Button>
              <span className="text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-6 py-3 bg-gray-100 text-gray-700 cursor-pointer rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
