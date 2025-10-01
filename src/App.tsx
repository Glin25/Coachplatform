// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import ClientDashboard from './components/client/ClientDashboard';
import CoachDashboard from './components/coach/CoachDashboard';

function AppRoutes() {
  const { user, profile, loading } = useAuth();

  // Een kleine, onschuldige loader terwijl auth/profile wordt opgehaald
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-600" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Login & Register (alleen tonen als je nog niet bent ingelogd) */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <RegisterPage />}
      />

      {/* Hoofdroute: beschermd, en kiest dashboard op basis van profielrol */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            {/* Extra veilige check: pas dashboard tonen als profile er daadwerkelijk is */}
            {profile ? (
              profile.role === 'coach' ? (
                <CoachDashboard />
              ) : (
                <ClientDashboard />
              )
            ) : (
              // Fallback wanneer user wel bestaat maar profile nog nét niet binnen is
              <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-600" />
              </div>
            )}
          </ProtectedRoute>
        }
      />

      {/* Alles wat niet matcht gaat naar home (en daarmee ProtectedRoute) */}
      <Route path="*" element={<Navigate to="/" replace />} />
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