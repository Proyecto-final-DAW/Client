import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../context/hooks/useAuth';

export const ProtectedRoute = (): React.JSX.Element => {
  const { token, user } = useAuth();
  const location = useLocation();

  if (!token) {
    // Land on the public home (which already has LOGIN/REGISTER CTAs) rather
    // than forcing the login form. This also makes the logout flow work: the
    // re-render after clearing token would otherwise pre-empt navigate('/')
    // and bounce the user to /login.
    return <Navigate to="/" replace />;
  }

  if (!user?.onboarding_completed && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (user?.onboarding_completed && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
