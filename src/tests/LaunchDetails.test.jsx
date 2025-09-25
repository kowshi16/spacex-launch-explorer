import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import LaunchDetailPage from '../pages/LaunchDetailPage';

global.fetch = vi.fn();

const mockLaunchData = {
  id: '1',
  name: 'Falcon Heavy Test Flight',
  date_utc: '2018-02-06T20:45:00.000Z',
  details: 'Test flight of Falcon Heavy rocket',
  success: true,
  rocket: 'falcon-heavy',
  launchpad: 'ksc-lc-39a',
  payloads: ['payload-1', 'payload-2'],
};

const mockRocketData = {
  id: 'falcon-heavy',
  name: 'Falcon Heavy',
  description: 'Heavy-lift launch vehicle',
};

const mockLaunchpadData = {
  id: 'ksc-lc-39a',
  name: 'Kennedy Space Center LC-39A',
  locality: 'Cape Canaveral',
};

const mockPayloadData = {
  id: 'payload-1',
  name: 'Tesla Roadster',
  type: 'Satellite',
  orbit: 'heliocentric',
};

describe('LaunchDetailPage Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders launch details with related data', async () => {
    // Mock multiple API calls
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockLaunchData,
      })
      .mockResolvedValueOnce({
        ok: true, 
        json: async () => mockRocketData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockLaunchpadData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPayloadData,
      });

    render(
      <MemoryRouter initialEntries={['/launch/1']}>
        <LaunchDetailPage />
      </MemoryRouter>
    );

    // Wait for all data to load
    await waitFor(() => {
      expect(screen.getByText('Falcon Heavy Test Flight')).toBeInTheDocument();
    });

    // Check launch details
    expect(screen.getByText(/test flight of falcon heavy/i)).toBeInTheDocument();
    
    // Check rocket info
    expect(screen.getByText('Falcon Heavy')).toBeInTheDocument();
    
    // Check launchpad info
    expect(screen.getByText('Kennedy Space Center LC-39A')).toBeInTheDocument();
    
    // Check payload info
    expect(screen.getByText('Tesla Roadster')).toBeInTheDocument();
  });

  test('shows loading skeleton while fetching data', () => {
    // Mock pending promise
    fetch.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={['/launch/1']}>
        <LaunchDetailPage />
      </MemoryRouter>
    );

    // Check for loading skeletons
    expect(screen.getByTestId('launch-detail-skeleton')).toBeInTheDocument();
  });
});