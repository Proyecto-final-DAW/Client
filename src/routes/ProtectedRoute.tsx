import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../context/hooks/useAuth';

export const ProtectedRoute = (): React.JSX.Element => {
  const { token, user } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.onboarding_completed && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (user?.onboarding_completed && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
