import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { LaunchCard } from "../components/LaunchCard";
import { LaunchFilters } from "../components/LaunchFilters";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { Button } from "../components/Button";
import { useSpaceXAPI } from "../hooks/useSpaceXAPI";
import { useFavorites } from "../hooks/useFavorites";
import { Pagination } from '../components/Pagination'
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
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (filters.year) params.set("year", filters.year);
    if (filters.success !== "all") params.set("success", filters.success);
    if (filters.favoritesOnly) params.set("favorites", "true");

    setSearchParams(params, { replace: true });
    setCurrentPage(1); // Reset pagination when filters change
  }, [
    debouncedSearch,
    filters.year,
    filters.success,
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
    return sortLaunchesByDate(filtered);
  }, [launches, filters]);

  // Paginate launches
  const paginatedLaunches = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLaunches.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredLaunches, currentPage]);

  const totalPages = Math.ceil(filteredLaunches.length / ITEMS_PER_PAGE);

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (key === "year" && value) {
      params.set("year", value);
    } else if (key === "year" && !value) {
      params.delete("year");
    } else if (key === "success" && value !== "all") {
      params.set("success", value);
    } else if (key === "success" && value === "all") {
      params.delete("success");
    } else if (key === "favoritesOnly" && value) {
      params.set("favorites", "true");
    } else if (key === "favoritesOnly" && !value) {
      params.delete("favorites");
    }
    setSearchParams(params, { replace: true });
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  console.log("loading:", loading);
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
        launches={launches}
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            loading={loading}
          />

          {/* Pagination */}
          {/* {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              
              <Button
                variant="secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )} */}
        </>
      )}
    </div>
  );
};
