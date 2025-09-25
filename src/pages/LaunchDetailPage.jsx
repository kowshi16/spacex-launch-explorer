import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSpaceXAPI } from "../hooks/useSpaceXAPI";
import { useFavorites } from "../hooks/useFavorites";
import { formatDate } from "../utils/helpers";
import { DetailPageSkeleton } from "../components/loaders/DetailPageSkeleton";
import {
  ArrowBackIos,
  BoltOutlined,
  CalendarMonthOutlined,
  ErrorOutline,
  FitnessCenter,
  FlashOnOutlined,
  HeightOutlined,
  LocationOnOutlined,
  PieChartOutlined,
  PublicOutlined,
  RocketOutlined,
  SettingsOutlined,
  SmartDisplayOutlined,
  Star,
  StarBorder,
  TaskOutlined,
  Timeline,
} from "@mui/icons-material";

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
      <div>
        <DetailPageSkeleton />
      </div>
    );
  }

  if (error || !launch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <ErrorOutline className="w-8 h-8 text-red-600" />
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
              <FlashOnOutlined className="w-5 h-5" />
              Try Again
            </button>
            <button
              onClick={() => navigate(-1)}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ArrowBackIos className="w-5 h-5" />
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
            <ArrowBackIos className="w-5 h-5" />
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
              <Star className="w-5 h-5 text-white" />
            ) : (
              <StarBorder className="w-5 h-5" />
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
                    <CalendarMonthOutlined className="w-5 h-5" />
                    <span className="font-medium">
                      {formatDate(launch.date_local)}
                    </span>
                  </div>
                  <span
                    className={`${getStatusColor(
                      successStatus
                    )} px-3 py-1 rounded-full font-semibold flex items-center gap-2`}
                  >
                    <BoltOutlined className="w-5 h-5" />
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
                <SmartDisplayOutlined className="w-5 h-5" />
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
                  <RocketOutlined className="w-6 h-6 text-blue-600" />
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
                    <HeightOutlined className="w-5 h-5 text-gray-500" />
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
                    <FitnessCenter className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-500 block">Mass</span>
                      <span className="font-semibold">
                        {relatedData.rocket.mass?.kg?.toLocaleString()}kg
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <PieChartOutlined className="w-5 h-5 text-gray-500" />
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
                    <Timeline className="w-5 h-5 text-gray-500" />
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
                  <PublicOutlined className="w-6 h-6 text-green-600" />
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
                    <LocationOnOutlined className="w-5 h-5 text-gray-500" />
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
                    <SettingsOutlined className="w-5 h-5 text-gray-500" />
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
                    <BoltOutlined className="w-5 h-5 text-gray-500" />
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
                <div className="p-2 bg-white bg-opacity-20 rounded-full">
                  <TaskOutlined className="w-6 h-6 text-pink-600 mb-2" />
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
