// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import SensorDashboard from './components/SensorDashboard';
import FlowchartEditor from './components/FlowchartEditor';
import { useAuth } from './AuthContext.jsx';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />} 
      />
      <Route 
        path="/auth" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />} 
      />
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <SensorDashboard /> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/flowchart" 
        element={isAuthenticated ? <FlowchartEditor /> : <Navigate to="/auth" replace />} 
      />
    </Routes>
  );
}

export default App;

