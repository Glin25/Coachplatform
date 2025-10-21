import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ResetPassword from './components/auth/ResetPassword';

import ClientDashboard from './components/client/ClientDashboard';
import CoachDashboard from './components/coach/CoachDashboard';
import { useEffect } from 'react';

function AppRoutes() {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // Reset-link herkennen en doorzetten naar /reset mét hash (voorkomt "Auth session missing!")
  useEffect(() => {
    const isRecovery = new URLSearchParams(location.search).get('type') === 'recovery';
    const hasAccessToken =
      typeof window !== 'undefined' &&
      window.location.hash &&
      window.location.hash.includes('access_token');

    if (isRecovery || hasAccessToken) {
      window.history.replaceState(null, '', '/reset' + location.search + window.location.hash);
    }
  }, [location]);

  if (loading) return <div style={{ padding: 24 }}>Bezig met laden…</div>;

  return (
    <Routes>
      {/* Publieke routes */}
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
      <Route path="/reset" element={<ResetPassword />} />

      {/* Beveiligde root */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            {profile?.role === 'coach' ? <CoachDashboard /> : <ClientDashboard />}
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}