import { renderHook, waitFor, act } from '@testing-library/react';
import { useSpaceXData } from '../hooks/useSpaceXData';
import { useFavorites } from '../hooks/useFavorites';

// Mock fetch
global.fetch = vi.fn();

describe('Custom Hooks', () => {
  describe('useSpaceXData', () => {
    afterEach(() => {
      fetch.mockClear();
    });

    test('fetches data successfully', async () => {
      const mockData = { docs: [{ id: '1', name: 'Test Launch' }] };
      
      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const { result } = renderHook(() => useSpaceXData('/launches'));

      // Initially loading
      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(null);

      // Wait for data to load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBe(null);
    });

    test('handles fetch errors', async () => {
      fetch.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useSpaceXData('/launches'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBe(null);
      expect(result.current.error).toBeTruthy();
    });

    test('caches responses', async () => {
      const mockData = { docs: [{ id: '1', name: 'Test Launch' }] };
      
      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      // First render
      const { result: result1 } = renderHook(() => useSpaceXData('/launches'));
      
      await waitFor(() => {
        expect(result1.current.loading).toBe(false);
      });

      // Second render with same endpoint
      const { result: result2 } = renderHook(() => useSpaceXData('/launches'));

      // Should return cached data immediately
      expect(result2.current.loading).toBe(false);
      expect(result2.current.data).toEqual(mockData);
      
      // Should only call fetch once due to caching
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('useFavorites', () => {
    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear();
    });

    test('manages favorites correctly', () => {
      const { result } = renderHook(() => useFavorites());

      expect(result.current.favorites).toEqual([]);
      expect(result.current.isFavorite('launch-1')).toBe(false);

      // Add favorite
      act(() => {
        result.current.toggleFavorite('launch-1');
      });

      expect(result.current.favorites).toContain('launch-1');
      expect(result.current.isFavorite('launch-1')).toBe(true);

      // Remove favorite
      act(() => {
        result.current.toggleFavorite('launch-1');
      });

      expect(result.current.favorites).not.toContain('launch-1');
      expect(result.current.isFavorite('launch-1')).toBe(false);
    });

    test('persists favorites to localStorage', () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.toggleFavorite('launch-1');
        result.current.toggleFavorite('launch-2');
      });

      // Check localStorage
      const stored = JSON.parse(localStorage.getItem('spacex-favorites') || '[]');
      expect(stored).toEqual(['launch-1', 'launch-2']);
    });

    test('loads favorites from localStorage on init', () => {
      // Pre-populate localStorage
      localStorage.setItem('spacex-favorites', JSON.stringify(['launch-1', 'launch-2']));

      const { result } = renderHook(() => useFavorites());

      expect(result.current.favorites).toEqual(['launch-1', 'launch-2']);
      expect(result.current.isFavorite('launch-1')).toBe(true);
      expect(result.current.isFavorite('launch-2')).toBe(true);
    });
  });
});