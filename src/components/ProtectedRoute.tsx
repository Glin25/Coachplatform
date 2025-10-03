import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'Client' | 'coach';
}

export default function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="p-6 text-center">Even geduld…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace={true} />;
  }

  if (!profile) {
    return <Navigate to="/login" replace={true} />;
  }

  if (requireRole && profile.role !== requireRole) {
    return <Navigate to="/" replace={true} />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;