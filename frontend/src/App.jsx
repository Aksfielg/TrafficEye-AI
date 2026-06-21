import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Upload from './pages/Upload';
import Results from './pages/Results';
import Dashboard from './pages/Dashboard';
import History from './pages/History';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app/*" element={
          <Layout>
            <Routes>
              <Route path="upload" element={<Upload />} />
              <Route path="results" element={<Results />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="history" element={<History />} />
              <Route path="*" element={<Navigate to="upload" replace />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
