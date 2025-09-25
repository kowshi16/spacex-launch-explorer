import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LaunchListPage } from "./pages/LaunchListPage";
import { LaunchDetailPage } from "./pages/LaunchDetailPage";
import { Layout } from "./layout/Layout";

function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route path="/" element={<LaunchListPage />} />
          <Route path="/launch/:id" element={<LaunchDetailPage />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
