import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false, disallowAdmin = false }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <div className="container section">Loading...</div>;
  if (adminOnly) {
    if (!isAdmin) return <Navigate to="/auth" replace />;
    return children;
  }
  if (disallowAdmin && isAdmin) return <Navigate to="/admin" replace />;
  if (!user) return <Navigate to="/auth" replace />;

  return children;
}
