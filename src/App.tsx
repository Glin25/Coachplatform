// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Auth pagina's
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";

// Route-beschermer
import ProtectedRoute from "./components/ProtectedRoute";

// Dashboards
import CoachDashboard from "./components/coach/CoachDashboard";
import ClientDashboard from "./components/client/ClientDashboard";

function AppRoutes() {
  const { user, profile, loading } = useAuth();

  // Laat een kleine loader zien terwijl auth/profile wordt opgehaald
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Login is altijd beschikbaar. Als je al ingelogd bent -> naar "/" */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />

      {/* Register is altijd beschikbaar. Als je al ingelogd bent -> naar "/" */}
      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <RegisterPage />}
      />

      {/* Hoofdpagina: achter ProtectedRoute; toont coach of client dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            {profile?.role === "coach" ? (
              <CoachDashboard />
            ) : (
              <ClientDashboard />
            )}
          </ProtectedRoute>
        }
      />

      {/* Fallback voor alle onbekende paden -> terug naar login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
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
export default App;