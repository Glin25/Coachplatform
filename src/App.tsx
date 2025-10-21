// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ResetPassword from './components/auth/ResetPassword';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import ClientDashboard from './components/client/ClientDashboard';
import CoachDashboard from './components/coach/CoachDashboard';
import { useEffect } from 'react';

function AppRoutes() {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // 1) Herken reset-link en stuur door naar /reset mét hash (voorkomt "Auth session missing!")
  useEffect(() => {
    const isRecovery = new URLSearchParams(location.search).get('type') === 'recovery';
    const hasAccessToken =
      typeof window !== 'undefined' &&
      window.location.hash &&
      window.location.hash.includes('access_token');

    if (isRecovery || hasAccessToken) {
      // naar /reset, maar behoud query + hash
      window.history.replaceState(null, '', '/reset' + location.search + window.location.hash);
    }
  }, [location]);

  // 2) Terwijl auth/profiel nog laadt, toon niets (klein skelet kan ook)
  if (loading) return null;

  // 3) Routes
  return (
    <Routes>
      {/* Publieke routes */}
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
      <Route path="/reset" element={<ResetPassword />} />

      {/* Beveiligde root-route */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            {profile?.role === 'coach' ? <CoachDashboard /> : <ClientDashboard />}
          </ProtectedRoute>
        }
      />

      {/* Fallback: alles wat niet bestaat -> naar login of root */}
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
    </Routes>
  );
}

/** App (root) */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}