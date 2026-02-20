import { onboardingService } from './adapter';
import OnboardingWizard from './components/OnboardingWizard';
// import { useAuth } from "../../context/hooks/useAuth"; ← ajusta a tu path

export default function OnboardingView() {
  // const { token, updateUser } = useAuth();
  const tempToken = 'tu-jwt-aquí'; // reemplazar con useAuth()

  return (
    <OnboardingWizard
      token={tempToken}
      onboardingService={onboardingService}
      onComplete={() => {
        // TODO: updateUser(userData) when backend ready;
      }}
    />
  );
}
