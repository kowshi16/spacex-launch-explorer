import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';

export const useSpaceXAPI = () => {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef();
  const cacheRef = useRef({});

  const fetchLaunches = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Check cache first
    if (cacheRef.current.launches) {
      setLaunches(cacheRef.current.launches);
      setLoading(false);
      return;
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      // Fetch launches
      const launchesData = await api.fetchLaunches(abortControllerRef.current.signal);

      // Fetch all rockets and launchpads
      const [rocketsData, launchpadsData] = await Promise.all([
        api.fetchRockets(abortControllerRef.current.signal),
        api.fetchLaunchpads(abortControllerRef.current.signal)
      ]);

      // Create maps for quick lookup
      const rocketMap = Object.fromEntries(
        rocketsData.map(rocket => [rocket.id, rocket.name])
      );
      const launchpadMap = Object.fromEntries(
        launchpadsData.map(launchpad => [launchpad.id, launchpad.name])
      );

      // Enrich launches with rocket and launchpad names
      const enrichedLaunches = launchesData.map(launch => ({
        ...launch,
        rocket: { name: rocketMap[launch.rocket] || 'Unknown Rocket' },
        launchpad: { name: launchpadMap[launch.launchpad] || 'Unknown Launchpad' }
      }));

      cacheRef.current.launches = enrichedLaunches;
      setLaunches(enrichedLaunches);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLaunchDetails = useCallback(async (id) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Check cache first
    if (cacheRef.current[`launch-${id}`]) {
      return cacheRef.current[`launch-${id}`];
    }

    abortControllerRef.current = new AbortController();
    
    try {
      const launch = await api.fetchLaunchById(id, abortControllerRef.current.signal);
      cacheRef.current[`launch-${id}`] = launch;
      return launch;
    } catch (err) {
      if (err.name !== 'AbortError') {
        throw err;
      }
    }
  }, []);

  const fetchRelatedData = useCallback(async (rocketId, launchpadId, payloadIds = []) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    
    try {
      const promises = [];
      
      if (rocketId && !cacheRef.current[`rocket-${rocketId}`]) {
        promises.push(
          api.fetchRocket(rocketId, abortControllerRef.current.signal)
            .then(data => ({ type: 'rocket', data }))
        );
      }
      
      if (launchpadId && !cacheRef.current[`launchpad-${launchpadId}`]) {
        promises.push(
          api.fetchLaunchpad(launchpadId, abortControllerRef.current.signal)
            .then(data => ({ type: 'launchpad', data }))
        );
      }
      
      payloadIds.forEach(payloadId => {
        if (!cacheRef.current[`payload-${payloadId}`]) {
          promises.push(
            api.fetchPayload(payloadId, abortControllerRef.current.signal)
              .then(data => ({ type: 'payload', data, id: payloadId }))
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
    } catch (err) {
      if (err.name !== 'AbortError') {
        throw err;
      }
    }
  }, []);

  const retry = useCallback(() => {
    setError(null);
    fetchLaunches();
  }, [fetchLaunches]);

  useEffect(() => {
    fetchLaunches();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
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