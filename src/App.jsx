import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import LandingPage from './views/LandingPage';
import ToolView from './views/ToolView';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/comunicamais" replace />} />
          <Route path="/comunicamais" element={<LandingPage />} />
          <Route path="/comunicamais/" element={<LandingPage />} />
          <Route path="/comunicamais/app" element={<ToolView />} />
          {/* Fallbacks in case the proxy strips the '/comunicamais' prefix */}
          <Route path="/app" element={<ToolView />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
