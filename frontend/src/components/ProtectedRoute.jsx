import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProtectedRoute() {
  const { user, loadingAuth } = useApp();
  const location = useLocation();
  if (loadingAuth) return <main className="auth-loading"><div className="auth-loading-card">Restoring your secure MindXray session…</div></main>;
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
