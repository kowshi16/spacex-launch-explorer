import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Button } from '../components/Button';
import { useSpaceXAPI } from '../hooks/useSpaceXAPI';
import { useFavorites } from '../hooks/useFavorites';
import { formatDate } from '../utils/helpers';

export const LaunchDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [launch, setLaunch] = useState(null);
  const [relatedData, setRelatedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
      <div>
        <div className="mb-4">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            ← Back
          </Button>
        </div>
        <LoadingSkeleton type="detail" />
      </div>
    );
  }

  if (error || !launch) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load launch details</h3>
        <p className="text-gray-600 mb-4">{error || 'Launch not found'}</p>
        <div className="space-x-4">
          <Button onClick={handleRetry} variant="primary">
            Try Again
          </Button>
          <Button onClick={() => navigate(-1)} variant="secondary">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const successStatus = launch.success === true ? 'success' : launch.success === false ? 'failed' : 'unknown';
  const statusStyles = {
    success: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    unknown: 'bg-gray-100 text-gray-800'
  };

  const statusText = {
    success: 'Successful',
    failed: 'Failed',
    unknown: 'Unknown'
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Navigation */}
      <div className="mb-6 flex justify-between items-center">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          ← Back to Launches
        </Button>
        <button
          onClick={() => toggleFavorite(launch.id)}
          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded-md"
          aria-label={isFavorite(launch.id) ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            className={`w-5 h-5 ${isFavorite(launch.id) ? 'text-yellow-500 fill-current' : ''}`}
            fill={isFavorite(launch.id) ? 'currentColor' : 'none'}
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
          <span>{isFavorite(launch.id) ? 'Remove Favorite' : 'Add to Favorites'}</span>
        </button>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{launch.name}</h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(launch.date_local)}
              </div>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusStyles[successStatus]}`}>
                {statusText[successStatus]}
              </span>
            </div>
          </div>
        </div>

        {launch.details && (
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{launch.details}</p>
          </div>
        )}

        {launch.links?.webcast && (
          <div className="mt-4">
            <a
              href={launch.links.webcast}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Watch Launch Video
            </a>
          </div>
        )}
      </div>

      {/* Rocket and Launchpad Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Rocket Info */}
        {relatedData.rocket && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rocket Details</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-gray-900">{relatedData.rocket.name}</h3>
                <p className="text-gray-600">{relatedData.rocket.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Height:</span>
                  <p className="font-medium">{relatedData.rocket.height?.meters}m</p>
                </div>
                <div>
                  <span className="text-gray-500">Mass:</span>
                  <p className="font-medium">{relatedData.rocket.mass?.kg?.toLocaleString()}kg</p>
                </div>
                <div>
                  <span className="text-gray-500">Stages:</span>
                  <p className="font-medium">{relatedData.rocket.stages}</p>
                </div>
                <div>
                  <span className="text-gray-500">Success Rate:</span>
                  <p className="font-medium">{relatedData.rocket.success_rate_pct}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Launchpad Info */}
        {relatedData.launchpad && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Launchpad Details</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-gray-900">{relatedData.launchpad.full_name}</h3>
                <p className="text-gray-600">{relatedData.launchpad.details}</p>
              </div>
              <div className="text-sm">
                <div className="mb-2">
                  <span className="text-gray-500">Location:</span>
                  <p className="font-medium">{relatedData.launchpad.locality}, {relatedData.launchpad.region}</p>
                </div>
                <div className="mb-2">
                  <span className="text-gray-500">Status:</span>
                  <p className="font-medium capitalize">{relatedData.launchpad.status}</p>
                </div>
                <div>
                  <span className="text-gray-500">Total Launches:</span>
                  <p className="font-medium">{relatedData.launchpad.launch_attempts}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payloads */}
      {launch.payloads && launch.payloads.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payloads</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orbit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mass (kg)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {launch.payloads.map(payloadId => {
                  const payload = relatedData.payloads?.[payloadId];
                  return (
                    <tr key={payloadId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payload?.name || 'Loading...'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payload?.type || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payload?.orbit || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payload?.mass_kg ? payload.mass_kg.toLocaleString() : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}; 