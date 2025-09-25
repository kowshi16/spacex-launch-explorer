# 🚀 SpaceX Launch Explorer

A React application for exploring SpaceX launches with detailed information about rockets, launchpads, and payloads.

## 🛠️ How to Run/Build

### Prerequisites
- Node.js 18+
- npm or yarn

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Build for Production
```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🏗️ My Decisions

### State Management
**Decision**: Used local state with `useState` and custom hooks instead of Redux or Context API.

**Reasoning**: 
- App complexity didn't justify Redux overhead
- Custom hooks provide clean separation of concerns
- Local state is sufficient for component-specific data
- Custom `useSpaceXData` hook handles all API logic with built-in caching

**Implementation**:
- `useFavorites` - manages localStorage persistence for starred launches
- `useSpaceXAPI` - handles data fetching with caching and error states
- `useLocalStorage` - store values in the local storage

### Data Fetching Strategy
**Decision**: On-demand loading with client-side caching.

**Reasoning**:
- Launches list loads immediately for quick initial experience
- Related data (rockets, launchpads, payloads) fetched only when viewing details
- In-memory cache prevents redundant API calls during navigation

### Performance Optimizations
**Decision**: Strategic use of `useMemo` and `useCallback` only where beneficial.

**Reasoning**:
- `useMemo` for expensive operations (filtering/sorting large launch lists)
- `useCallback` for event handlers passed to child components
- Avoided premature optimization - only memoized when necessary

### UI/UX Approach
**Decision**: Skeleton loaders instead of spinners, client-side filtering, pagination over infinite scroll.

**Reasoning**:
- Skeleton loaders provide better perceived performance
- Client-side filtering is faster for datasets of this size
- Pagination is more accessible than infinite scroll
- Responsive-first design with mobile considerations

## 🔮 What I'd Do Next With More Time

### Performance Enhancements
- **Virtual Scrolling**: Handle thousands of launches efficiently
- **Service Worker**: Offline functionality and background data sync
- **Bundle Splitting**: Code-split by routes for faster initial load
- **React Query**: Replace custom hooks with more sophisticated caching/synchronization

### Advanced Features
- **URL State Sync**: Persist filters and search in URL parameters (`?year=2020&success=true`)
- **Advanced Search**: Full-text search across mission details and descriptions
- **Launch Comparison**: Side-by-side comparison of multiple launches
- **Data Visualization**: Charts showing launch statistics and trends over time
- **Push Notifications**: Alerts for upcoming launches

### User Experience
- **TypeScript Migration**: Better developer experience and type safety
- **Dark Mode**: Toggle with system preference detection
- **Advanced Animations**: Smooth page transitions with Framer Motion
- **Keyboard Shortcuts**: Power user navigation (`/` for search, `f` for favorites)
- **Export Functionality**: Download filtered launch data as CSV/JSON

### Technical Improvements
- **Error Boundaries**: Component-level error handling with recovery
- **E2E Testing**: Playwright tests for critical user journeys
- **Performance Monitoring**: Core Web Vitals tracking and alerts
- **Accessibility Audit**: Full WCAG 2.1 AA compliance
- **API Rate Limiting**: More sophisticated request queuing and retry logic

### Scalability Considerations
- **State Management**: Migrate to Zustand or Redux Toolkit for complex state
- **Micro-frontends**: Component federation for team scalability
- **CDN Integration**: Optimize asset delivery and caching
- **Progressive Web App**: Installable app with offline capabilities