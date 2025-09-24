import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/helpers';

export const LaunchCard = ({ launch, isFavorite, onToggleFavorite }) => {
  const successBadge = launch.success === true ? 'success' : launch.success === false ? 'failed' : 'unknown';

  const badgeStyles = {
    success: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    unknown: 'bg-gray-100 text-gray-800'
  };

  const badgeText = {
    success: 'Success',
    failed: 'Failed',
    unknown: 'Unknown'
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
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            className={`w-5 h-5 ${isFavorite ? 'text-yellow-500 fill-current' : ''}`}
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(launch.date_local)}
        </div>
        
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Rocket: {launch.rocket?.name || 'Unknown Rocket'}
        </div>
        
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Launchpad: {launch.launchpad?.name || 'Unknown Launchpad'}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${badgeStyles[successBadge]}`}>
          {badgeText[successBadge]}
        </span>
        <Link
          to={`/launch/${launch.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};