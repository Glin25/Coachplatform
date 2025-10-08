import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ResetPassword from "./components/auth/ResetPassword"; // <— voeg toe bij de imports
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { ClientDashboard } from './components/client/ClientDashboard';
import { CoachDashboard } from './components/coach/CoachDashboard';

function AppRoutes() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />

      {/* 🔹 HIER STAAT DE NIEUWE ROUTE (OPENBAAR) */}
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