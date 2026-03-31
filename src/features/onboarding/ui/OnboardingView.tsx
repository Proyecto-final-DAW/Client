import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../../context/hooks/useAuth';
import { onboardingService } from './adapter';
import OnboardingWizard from './components/OnboardingWizard';

export default function OnboardingView() {
  const { token, user, updateUser } = useAuth();
  const navigate = useNavigate();

  return (
    <OnboardingWizard
      token={token ?? ''}
      onboardingService={onboardingService}
      onComplete={(userData) => {
        updateUser({ ...user!, ...userData, onboarding_completed: true });
        navigate('/dashboard', { replace: true });
      }}
    />
  );
}
