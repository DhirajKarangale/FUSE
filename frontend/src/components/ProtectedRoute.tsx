import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../redux/hookStore';
import { routeAuth } from '../utils/Routes';

export default function ProtectedRoute() {
  const user = useAppSelector((state) => state.user);
  const isAuthenticated = !!user?.email;
  return isAuthenticated ? <Outlet /> : <Navigate to={routeAuth} replace />;
}