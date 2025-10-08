import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ResetPassword from "./components/auth/ResetPassword"; // <— voeg toe bij de imports
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { ClientDashboard } from './components/client/ClientDashboard';
import { CoachDashboard } from './components/coach/CoachDashboard';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function AppRoutes() {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 1) Reset-link herkennen en hash bewaren (voorkomt "Auth session missing!")
  useEffect(() => {
  const isRecovery = new URLSearchParams(location.search).get('type') === 'recovery';
  const hasAccessToken =
    typeof window !== 'undefined' &&
    window.location.hash &&
    window.location.hash.includes('access_token');

  if (isRecovery || hasAccessToken) {
    navigate(
      {
        pathname: '/reset',
        search: location.search,
        hash: typeof window !== 'undefined' ? window.location.hash : '',
      },
      { replace: true }
    );
  }
}, [location, navigate]);

  // 2) Laat een simpele spinner zien tijdens laden
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 3) Routes
  return (
    <Routes>
      {/* Publieke routes */}
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
      <Route path="/reset" element={<ResetPassword />} /> {/* openbaar */}

      {/* Beveiligde root-route */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            {profile?.role === 'coach' ? <CoachDashboard /> : <ClientDashboard />}
          </ProtectedRoute>
        }
      />

      {/* Fallback: alles wat niet bestaat -> naar login of naar / */}
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
    </Routes>
  );
}

/** ---------- App (root) ---------- */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}