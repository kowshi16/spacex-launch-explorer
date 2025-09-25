import { Link } from "react-router-dom";
import { formatDate } from "../utils/helpers";
import {
  CalendarMonthOutlined,
  East,
  PublicOutlined,
  RocketOutlined,
  Star,
  StarBorder,
} from "@mui/icons-material";

export const LaunchCard = ({ launch, isFavorite, onToggleFavorite }) => {
  const successBadge =
    launch.success === true
      ? "success"
      : launch.success === false
      ? "failed"
      : "unknown";

  const badgeStyles = {
    success: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    unknown: "bg-gray-100 text-gray-800",
  };

  const badgeText = {
    success: "Success",
    failed: "Failed",
    unknown: "Unknown",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <Link
          to={`/launch/${launch.id}`}
          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
        >
          {launch.name}
        </Link>
        <button
          onClick={() => onToggleFavorite(launch.id)}
          className="text-gray-400 cursor-pointer hover:text-yellow-500 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <Star className="w-5 h-5 text-yellow-500" />
          ) : (
            <StarBorder className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <CalendarMonthOutlined className="w-4 h-4 mr-2" />
          {formatDate(launch.date_local)}
        </div>

        <div className="flex items-center">
          <RocketOutlined className="w-4 h-4 mr-2" />
          Rocket: {launch.rocket?.name || "Unknown Rocket"}
        </div>

        <div className="flex items-center">
          <PublicOutlined className="w-4 h-4 mr-2" />
          Launchpad: {launch.launchpad?.name || "Unknown Launchpad"}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span
          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${badgeStyles[successBadge]}`}
        >
          {badgeText[successBadge]}
        </span>
        <Link
          to={`/launch/${launch.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          View Details <East />
        </Link>
      </div>
    </div>
  );
};
