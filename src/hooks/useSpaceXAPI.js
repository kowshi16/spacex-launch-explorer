import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';

export const useSpaceXAPI = () => {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cacheRef = useRef({});

  const fetchLaunches = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Check cache first
    if (cacheRef.current.launches) {
      setLaunches(cacheRef.current.launches);
      setLoading(false);
      return;
    }

    try {
      // Fetch launches
      const launchesData = await api.fetchLaunches();

      // Fetch rockets & launchpads
      const [rocketsData, launchpadsData] = await Promise.all([
        api.fetchRockets(),
        api.fetchLaunchpads()
      ]);

      // Create maps
      const rocketMap = Object.fromEntries(
        rocketsData.map(rocket => [rocket.id, rocket.name])
      );
      const launchpadMap = Object.fromEntries(
        launchpadsData.map(launchpad => [launchpad.id, launchpad.name])
      );

      // Enrich launches
      const enrichedLaunches = launchesData.map(launch => ({
        ...launch,
        rocket: { name: rocketMap[launch.rocket] || 'Unknown Rocket' },
        launchpad: { name: launchpadMap[launch.launchpad] || 'Unknown Launchpad' }
      }));

      cacheRef.current.launches = enrichedLaunches;
      setLaunches(enrichedLaunches);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLaunchDetails = useCallback(async (id) => {
    // Check cache first
    if (cacheRef.current[`launch-${id}`]) {
      return cacheRef.current[`launch-${id}`];
    }

    try {
      const launch = await api.fetchLaunchById(id);
      cacheRef.current[`launch-${id}`] = launch;
      return launch;
    } catch (err) {
      throw err;
    }
  }, []);

  const fetchRelatedData = useCallback(async (rocketId, launchpadId, payloadIds = []) => {
    const promises = [];

    if (rocketId && !cacheRef.current[`rocket-${rocketId}`]) {
      promises.push(
        api.fetchRocket(rocketId).then(data => ({ type: 'rocket', data }))
      );
    }

    if (launchpadId && !cacheRef.current[`launchpad-${launchpadId}`]) {
      promises.push(
        api.fetchLaunchpad(launchpadId).then(data => ({ type: 'launchpad', data }))
      );
    }

    payloadIds.forEach(payloadId => {
      if (!cacheRef.current[`payload-${payloadId}`]) {
        promises.push(
          api.fetchPayload(payloadId).then(data => ({ type: 'payload', data, id: payloadId }))
        );
      }
    });

    const results = await Promise.all(promises);

    const relatedData = {
      rocket: cacheRef.current[`rocket-${rocketId}`],
      launchpad: cacheRef.current[`launchpad-${launchpadId}`],
      payloads: {}
    };

    results.forEach(result => {
      if (result.type === 'rocket') {
        cacheRef.current[`rocket-${rocketId}`] = result.data;
        relatedData.rocket = result.data;
      } else if (result.type === 'launchpad') {
        cacheRef.current[`launchpad-${launchpadId}`] = result.data;
        relatedData.launchpad = result.data;
      } else if (result.type === 'payload') {
        cacheRef.current[`payload-${result.id}`] = result.data;
        relatedData.payloads[result.id] = result.data;
      }
    });

    // Add cached payloads
    payloadIds.forEach(id => {
      if (cacheRef.current[`payload-${id}`]) {
        relatedData.payloads[id] = cacheRef.current[`payload-${id}`];
      }
    });

    return relatedData;
  }, []);

  const retry = useCallback(() => {
    setError(null);
    fetchLaunches();
  }, [fetchLaunches]);

  useEffect(() => {
    fetchLaunches();
  }, [fetchLaunches]);

  return {
    launches,
    loading,
    error,
    fetchLaunches,
    fetchLaunchDetails,
    fetchRelatedData,
    retry
  };
};
