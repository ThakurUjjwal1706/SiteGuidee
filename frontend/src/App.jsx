import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import ProjectList from './pages/ProjectList';
import CostEstimator from './pages/CostEstimator';
import AppScheduler from './pages/AppScheduler';
import AICopilot from './pages/AICopilot';
import MapDashboard from './pages/MapDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Dashboard Routes with Sidebar & Navbar */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="projects" element={<ProjectList />} />
          <Route path="cost-estimator" element={<CostEstimator />} />
          <Route path="scheduler" element={<AppScheduler />} />
          <Route path="ai-copilot" element={<AICopilot />} />
          <Route path="map" element={<MapDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
