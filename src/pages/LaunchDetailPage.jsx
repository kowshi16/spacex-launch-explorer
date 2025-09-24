import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSpaceXAPI } from "../hooks/useSpaceXAPI";
import { useFavorites } from "../hooks/useFavorites";
import { formatDate } from "../utils/helpers";

export const LaunchDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [launch, setLaunch] = useState(null);
  const [relatedData, setRelatedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  const { fetchLaunchDetails, fetchRelatedData } = useSpaceXAPI();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const loadLaunchDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const launchData = await fetchLaunchDetails(id);
        setLaunch(launchData);

        // Fetch related data
        if (launchData) {
          const related = await fetchRelatedData(
            launchData.rocket,
            launchData.launchpad,
            launchData.payloads || []
          );
          setRelatedData(related);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadLaunchDetails();
  }, [id, fetchLaunchDetails, fetchRelatedData]);

  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="h-9 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="space-y-6">
            <div className="h-80 bg-gray-200 rounded-3xl animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded-3xl animate-pulse"></div>
              <div className="h-64 bg-gray-200 rounded-3xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !launch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Failed to load launch details
          </h2>
          <p className="text-gray-600 mb-6">{error || "Launch not found"}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Try Again
            </button>
            <button
              onClick={() => navigate(-1)}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const successStatus =
    launch.success === true
      ? "success"
      : launch.success === false
      ? "failed"
      : "unknown";
  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "success":
        return "Successful";
      case "failed":
        return "Failed";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation Header */}
        <div className="mb-8 flex justify-between items-center transition-opacity duration-500 opacity-100">
          <button
            onClick={() => navigate(-1)}
            className="border border-gray-300 cursor-pointer text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Launches
          </button>
          <button
            onClick={() => toggleFavorite(launch.id)}
            className={`cursor-pointer ${
              isFavorite(launch.id)
                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                : "border border-yellow-500 text-yellow-600 hover:bg-yellow-50"
            } px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2`}
          >
            {isFavorite(launch.id) ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.978 2.89a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.89c-.784-.57-.38-1.81.587-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            )}
            {isFavorite(launch.id) ? "Remove Favorite" : "Add to Favorites"}
          </button>
        </div>

        {/* Hero Section */}
        <div className="mb-8 overflow-hidden shadow-2xl rounded-3xl bg-gradient-to-r from-indigo-700 to-purple-800 relative transition-transform duration-500 scale-100 hover:scale-[1.01]">
          {/* Launch Patch Background */}
          {launch.links?.patch?.large && !imageError && (
            <div className="absolute top-8 right-8 opacity-20">
              <img
                src={launch.links.patch.large}
                alt={`${launch.name} patch`}
                className="w-40 h-40 object-contain"
                onError={() => setImageError(true)}
              />
            </div>
          )}

          <div className="relative z-10 p-8 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-4xl font-bold mb-4">{launch.name}</h1>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium">
                      {formatDate(launch.date_local)}
                    </span>
                  </div>
                  <span
                    className={`${getStatusColor(
                      successStatus
                    )} px-3 py-1 rounded-full font-semibold flex items-center gap-2`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    {getStatusText(successStatus)}
                  </span>
                </div>
              </div>

              {launch.links?.patch?.large && !imageError && (
                <div className="hidden lg:block">
                  <img
                    src={launch.links.patch.large}
                    alt={`${launch.name} mission patch`}
                    className="w-28 h-28 object-contain rounded-xl bg-white bg-opacity-20 p-2 shadow-lg"
                    onError={() => setImageError(true)}
                  />
                </div>
              )}
            </div>

            {launch.details && (
              <p className="text-gray-100 leading-relaxed mb-6 max-w-4xl">
                {launch.details}
              </p>
            )}

            {launch.links?.webcast && (
              <a
                href={launch.links.webcast}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3l3.59 3.59A4.5 4.5 0 019 9.5l6.5 6.5a4.5 4.5 0 011.91 2.41L21 21m-6-8l6 6m-9-9l6 6"
                  />
                </svg>
                Watch Launch Video
              </a>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 transition-opacity duration-500 opacity-100">
          {/* Rocket Details */}
          {relatedData.rocket && (
            <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Rocket Details
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {relatedData.rocket.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {relatedData.rocket.description}
                  </p>
                </div>

                <hr className="border-gray-200" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M5 5h2m0 0h2m-2 0V3m0 2v2m0-2V7"
                      />
                    </svg>
                    <div>
                      <span className="text-sm text-gray-500 block">
                        Height
                      </span>
                      <span className="font-semibold">
                        {relatedData.rocket.height?.meters}m
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 6l3 1m-3-1l-3 9a5.002 5.002 0 006.001 0M18 8l3 9m-3-9l-6-2m0-2v11m0 5c-2.21 0-3.98-1.79-3.98-4s1.77-4 3.98-4 4 1.79 4 4-1.79 4-4 4zm-4 0c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z"
                      />
                    </svg>
                    <div>
                      <span className="text-sm text-gray-500 block">Mass</span>
                      <span className="font-semibold">
                        {relatedData.rocket.mass?.kg?.toLocaleString()}kg
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                      />
                    </svg>
                    <div>
                      <span className="text-sm text-gray-500 block">
                        Stages
                      </span>
                      <span className="font-semibold">
                        {relatedData.rocket.stages}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <div>
                      <span className="text-sm text-gray-500 block">
                        Success Rate
                      </span>
                      <span className="font-semibold text-green-600">
                        {relatedData.rocket.success_rate_pct}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Launchpad Details */}
          {relatedData.launchpad && (
            <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 002 2 2 2 0 004 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Launchpad Details
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {relatedData.launchpad.full_name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {relatedData.launchpad.details}
                  </p>
                </div>

                <hr className="border-gray-200" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <span className="text-sm text-gray-500 block">
                        Location
                      </span>
                      <span className="font-semibold">
                        {relatedData.launchpad.locality},{" "}
                        {relatedData.launchpad.region}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <span className="text-sm text-gray-500 block">
                        Status
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full font-medium capitalize ${
                          relatedData.launchpad.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {relatedData.launchpad.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <div>
                      <span className="text-sm text-gray-500 block">
                        Total Launches
                      </span>
                      <span className="font-semibold">
                        {relatedData.launchpad.launch_attempts}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payloads Table */}
        {launch.payloads && launch.payloads.length > 0 && (
          <div className="mb-8 bg-white rounded-3xl shadow-xl overflow-hidden transition-opacity duration-500 opacity-100">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                    />
                  </svg>
                </div>
                Mission Payloads
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                      Orbit
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                      Mass (kg)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {launch.payloads.map((payloadId, index) => {
                    const payload = relatedData.payloads?.[payloadId];
                    return (
                      <tr
                        key={payloadId}
                        className={`hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-gray-50/50" : ""
                        }`}
                      >
                        <td className="px-6 py-4 font-medium">
                          {payload?.name || (
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {payload?.type ? (
                            <span className="border border-gray-300 px-2 py-1 rounded-full text-sm font-medium">
                              {payload.type}
                            </span>
                          ) : payload ? (
                            "-"
                          ) : (
                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {payload?.orbit ? (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                              {payload.orbit}
                            </span>
                          ) : payload ? (
                            "-"
                          ) : (
                            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {payload?.mass_kg ? (
                            <span className="font-semibold text-gray-900">
                              {payload.mass_kg.toLocaleString()}
                            </span>
                          ) : payload ? (
                            "-"
                          ) : (
                            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Links Section */}
        {(launch.links?.article || launch.links?.wikipedia) && (
          <div className="mt-8 bg-white rounded-3xl shadow-xl p-6 transition-opacity duration-500 opacity-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Additional Resources
            </h2>
            <div className="flex flex-wrap gap-3">
              {launch.links?.article && (
                <a
                  href={launch.links.article}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-indigo-500 text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                >
                  Read Article
                </a>
              )}
              {launch.links?.wikipedia && (
                <a
                  href={launch.links.wikipedia}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray-500 text-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Wikipedia
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
