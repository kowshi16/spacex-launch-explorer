import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

const TestWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

global.fetch = vi.fn();

describe('Error State Handling', () => {
  test('shows error state when API fails', async () => {
    // Mock failed API call
    fetch.mockRejectedValue(new Error('Network error'));

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Wait for error state to appear
    await waitFor(() => {
      expect(screen.getByText(/error loading launches/i)).toBeInTheDocument();
    });

    // Check if retry button is present
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  test('retry button refetches data', async () => {
    const user = userEvent.setup();
    
    // First call fails
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    // Second call succeeds
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        docs: [{
          id: '1',
          name: 'Test Launch',
          date_utc: '2023-01-01T00:00:00.000Z',
          success: true,
          rocket: 'falcon9',
          launchpad: 'ksc-lc-39a',
        }]
      }),
    });

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText(/error loading launches/i)).toBeInTheDocument();
    });

    // Click retry
    const retryButton = screen.getByRole('button', { name: /try again/i });
    await user.click(retryButton);

    // Wait for successful load
    await waitFor(() => {
      expect(screen.getByText('Test Launch')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledTimes(2);
  });
});