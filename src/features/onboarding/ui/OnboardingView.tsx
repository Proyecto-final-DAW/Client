import { Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '../../../context/hooks/useAuth';
import { onboardingService, statsInitService } from './adapter';
import { OnboardingWizard } from './components/OnboardingWizard';

export const OnboardingView = (): React.JSX.Element => {
  const { token, user, updateUser, setSession } = useAuth();
  const navigate = useNavigate();

  // Calling `navigate(...)` during render is a side-effect React (and
  // StrictMode) flags as an anti-pattern — it re-runs on every render
  // and double-invokes in dev. The `<Navigate>` element is the
  // declarative equivalent: emits the redirect during commit, runs once.
  // ProtectedRoute already gates this branch, so this is just a defensive
  // belt for the rare case the OnboardingView mounts before auth resolves.
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <OnboardingWizard
      userId={user.id}
      token={token}
      // Name was captured at registration; pre-fill so the wizard does not
      // re-prompt and the submit payload still carries it (server requires
      // the field even though it is unchanged).
      initialName={user.name}
      onboardingService={onboardingService}
      statsInitService={statsInitService}
      onComplete={(response) => {
        const nextUser = response.user;

        if (response.token) {
          setSession(response.token, nextUser);
        } else {
          updateUser(nextUser);
        }
        navigate('/templates', { replace: true });
      }}
    />
  );
};
