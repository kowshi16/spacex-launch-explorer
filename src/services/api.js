const BASE_URL = 'https://api.spacexdata.com/v4';

export const api = {
  async fetchLaunches(signal) {
    const response = await fetch(`${BASE_URL}/launches`, { signal });
    if (!response.ok) throw new Error('Failed to fetch launches');
    return response.json();
  },

  async fetchLaunchById(id, signal) {
    const response = await fetch(`${BASE_URL}/launches/${id}`, { signal });
    if (!response.ok) throw new Error('Failed to fetch launch');
    return response.json();
  },

  async fetchRocket(id, signal) {
    const response = await fetch(`${BASE_URL}/rockets/${id}`, { signal });
    if (!response.ok) throw new Error('Failed to fetch rocket');
    return response.json();
  },

  async fetchLaunchpad(id, signal) {
    const response = await fetch(`${BASE_URL}/launchpads/${id}`, { signal });
    if (!response.ok) throw new Error('Failed to fetch launchpad');
    return response.json();
  },

  async fetchPayload(id, signal) {
    const response = await fetch(`${BASE_URL}/payloads/${id}`, { signal });
    if (!response.ok) throw new Error('Failed to fetch payload');
    return response.json();
  }
};