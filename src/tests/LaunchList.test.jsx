import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LaunchListPage from '../pages/LaunchListPage';

// Mock data
const mockLaunches = [
  {
    id: '1',
    name: 'Falcon Heavy Test Flight',
    date_utc: '2018-02-06T20:45:00.000Z',
    success: true,
    rocket: 'falcon-heavy',
    launchpad: 'ksc-lc-39a',
  },
  {
    id: '2', 
    name: 'Tesla Roadster Mission',
    date_utc: '2019-03-02T07:49:00.000Z',
    success: false,
    rocket: 'falcon9',
    launchpad: 'ccafs-slc-40',
  }
];

// Test wrapper with router
const TestWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('LaunchList Component', () => {
  test('renders launch list with correct data', async () => {
    render(
      <TestWrapper>
        <LaunchListPage launches={mockLaunches} loading={false} />
      </TestWrapper>
    );

    // Check if launches are rendered
    expect(screen.getByText('Falcon Heavy Test Flight')).toBeInTheDocument();
    expect(screen.getByText('Tesla Roadster Mission')).toBeInTheDocument();
    
    // Check success indicators
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  test('shows loading skeleton when loading', () => {
    render(
      <TestWrapper>
        <LaunchListPage launches={[]} loading={true} />
      </TestWrapper>
    );

    // Check for loading skeleton elements
    expect(screen.getAllByTestId('launch-skeleton')).toHaveLength(6);
  });

  test('shows empty state when no launches', () => {
    render(
      <TestWrapper>
        <LaunchListPage launches={[]} loading={false} />
      </TestWrapper>
    );

    expect(screen.getByText(/No launches found/i)).toBeInTheDocument();
  });
});