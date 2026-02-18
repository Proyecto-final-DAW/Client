import { useState } from "react";
import type { OnboardingFormData } from "../../core/domain/models/OnboardingFormData";
import type{ OnboardingResponse } from "../../core/domain/models/OnboardingResponse";
import { onboardingService } from "../adapter";

export function useOnboarding() {
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   async function submitOnboarding(data: OnboardingFormData, token: string): Promise<OnboardingResponse | null> {
      setIsLoading(true);
      setError(null);
      try {
         const response = await onboardingService.submitOnboarding(data, token);
         return response;
      } catch (err) {
         setError(err instanceof Error ? err.message : "Error desconocido");
         return null;
      } finally {
         setIsLoading(false);
      }
   }

   return { submitOnboarding, isLoading, error };
}