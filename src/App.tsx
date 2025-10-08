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
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase reset: kan via ?type=recovery of via #access_token
    const isRecovery = new URLSearchParams(location.search).get("type") === "recovery";
    const hasAccessToken =
      typeof window !== "undefined" &&
      window.location.hash &&
      window.location.hash.includes("access_token");

    if (isRecovery || hasAccessToken) {
      // HEEL BELANGRIJK: behoud zowel search als hash bij de redirect,
      // anders raakt de access_token kwijt en krijg je "Auth session missing!"
      navigate(
        {
          pathname: "/reset",
          search: location.search,
          hash: window.location.hash,
        },
        { replace: true }
      );
    }
  }, [location, navigate]);

  /* ... rest van je component ... */
}

  // ✅ Spinner tonen tijdens laden
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // ✅ Routes
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />

      {/* Openbare reset route */}
      <Route path="/reset" element={<ResetPassword />} />

      {/* Beveiligde route */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            {profile?.role === "coach" ? <CoachDashboard /> : <ClientDashboard />}
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}