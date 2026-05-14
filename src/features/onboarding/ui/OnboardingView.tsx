import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../../context/hooks/useAuth';
import { macrosService, onboardingService, statsInitService } from './adapter';
import { OnboardingWizard } from './components/OnboardingWizard';

export const OnboardingView = (): React.JSX.Element => {
  const { token, user, updateUser, setSession } = useAuth();
  const navigate = useNavigate();

  // If the user is not authenticated, the onboarding flow can't proceed.
  if (!user || !token) {
    navigate('/login', { replace: true });
    return <></>;
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
      macrosService={macrosService}
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
