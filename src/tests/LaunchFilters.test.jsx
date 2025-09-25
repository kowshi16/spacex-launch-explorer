import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

const TestWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

// Mock fetch for API calls
global.fetch = vi.fn();

const mockLaunchesResponse = {
  docs: [
    {
      id: '1',
      name: 'Starlink Mission',
      date_utc: '2023-01-15T10:30:00.000Z',
      success: true,
      rocket: 'falcon9',
      launchpad: 'ksc-lc-39a',
    },
    {
      id: '2',
      name: 'Crew Dragon Demo',
      date_utc: '2022-05-20T14:15:00.000Z', 
      success: false,
      rocket: 'falcon9',
      launchpad: 'ccafs-slc-40',
    }
  ]
};

describe('Search and Filter Functionality', () => {
  beforeEach(() => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockLaunchesResponse,
    });
  });

  afterEach(() => {
    fetch.mockClear();
  });

  test('filters launches by mission name search', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Wait for launches to load
    await waitFor(() => {
      expect(screen.getByText('Starlink Mission')).toBeInTheDocument();
    });

    // Search for specific mission
    const searchInput = screen.getByPlaceholderText(/search missions/i);
    await user.type(searchInput, 'Starlink');

    // Check filtered results
    expect(screen.getByText('Starlink Mission')).toBeInTheDocument();
    expect(screen.queryByText('Crew Dragon Demo')).not.toBeInTheDocument();
  });

  test('filters launches by success status', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Starlink Mission')).toBeInTheDocument();
    });

    // Filter by successful launches only
    const successFilter = screen.getByRole('button', { name: /success/i });
    await user.click(successFilter);

    expect(screen.getByText('Starlink Mission')).toBeInTheDocument();
    expect(screen.queryByText('Crew Dragon Demo')).not.toBeInTheDocument();
  });

  test('filters launches by year', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <App />  
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Starlink Mission')).toBeInTheDocument();
    });

    // Filter by year 2023
    const yearSelect = screen.getByRole('combobox', { name: /filter by year/i });
    await user.selectOptions(yearSelect, '2023');

    expect(screen.getByText('Starlink Mission')).toBeInTheDocument();
    expect(screen.queryByText('Crew Dragon Demo')).not.toBeInTheDocument();
  });
});