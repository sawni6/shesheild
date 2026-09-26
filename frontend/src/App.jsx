import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LegalChat from './pages/LegalChat';
import EmergencyContacts from './pages/EmergencyContacts';
import SOSHistory from './pages/SOSHistory';
import CommunityReports from './pages/CommunityReports';
import NearbySafePlaces from './pages/NearbySafePlaces';


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/legal-chat"
          element={
            <ProtectedRoute>
              <LegalChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/emergency-contacts"
          element={
            <ProtectedRoute>
              <EmergencyContacts />
            </ProtectedRoute>
          }
        />
      
        <Route
            path="/community-reports"
            element={
           <ProtectedRoute>
           <CommunityReports />
           </ProtectedRoute>
  }
/>
<Route
  path="/nearby-safe-places"
  element={<NearbySafePlaces />}
/>
    
        <Route
            path="/sos-history"
            element={
            <ProtectedRoute>
            <SOSHistory />
           </ProtectedRoute>
  }
/>
      </Routes>
    </AuthProvider>
  );
}

export default App;

