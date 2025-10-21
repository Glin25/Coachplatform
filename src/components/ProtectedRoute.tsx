import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

/**
 * Toont altijd iets:
 * - tijdens laden: een simpel laad-scherm
 * - geen profiel: naar /login
 * - wél profiel: render children
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth() as { profile: any | undefined };

  // Auth-context nog niet klaar -> toon loader i.p.v. niets
  if (profile === undefined) {
    return <div className="p-6 text-sm text-gray-600">Laden…</div>;
  }
  // Niet ingelogd -> naar login
  if (profile === null) {
    return <Navigate to="/login" replace />;
  }
  // Ingelogd
  return <>{children}</>;
}