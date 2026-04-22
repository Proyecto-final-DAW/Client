import type { MacrosPort } from '../../../application/ports/MacrosPort';
import type { OnboardingFormData } from '../../../domain/models/OnboardingFormData';

export class MockMacrosRepository implements MacrosPort {
  async calculateMacros(
    _data: OnboardingFormData,
    _userId: number,
    _token: string
  ): Promise<void> {
    return;
  }
}
