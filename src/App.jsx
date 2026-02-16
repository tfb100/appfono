import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import LandingPage from './views/LandingPage';
import ToolView from './views/ToolView';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<ToolView />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
