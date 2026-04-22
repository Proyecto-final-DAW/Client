import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../../context/hooks/useAuth';
import { macrosService, onboardingService, statsInitService } from './adapter';
import { OnboardingWizard } from './components/OnboardingWizard';

export const OnboardingView = (): React.JSX.Element => {
  const { token, user, updateUser } = useAuth();
  const navigate = useNavigate();

  return (
    <OnboardingWizard
      userId={user!.id}
      token={token ?? ''}
      onboardingService={onboardingService}
      statsInitService={statsInitService}
      macrosService={macrosService}
      onComplete={(userData) => {
        updateUser({ ...user!, ...userData, onboarding_completed: true });
        navigate('/dashboard', { replace: true });
      }}
    />
  );
};
