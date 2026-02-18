import OnboardingWizard from "./components/OnboardingWizard";
import { onboardingService } from "./adapter";
// import { useAuth } from "../../context/hooks/useAuth"; ← ajusta a tu path

export default function OnboardingView() {
   // const { token, updateUser } = useAuth();
   const tempToken = "tu-jwt-aquí"; // reemplazar con useAuth()

   return (
      <OnboardingWizard
         token={tempToken}
         onboardingService={onboardingService}
         onComplete={(userData) => {
            console.log("Onboarding completado:", userData);
            // updateUser(userData);
         }}
      />
   );
}