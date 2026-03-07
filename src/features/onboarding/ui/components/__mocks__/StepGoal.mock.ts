// __mocks__/StepGoal.mock.ts
import type {
  OnboardingFormData,
  FormErrors,
} from '../../core/domain/models/OnboardingFormData';

export const defaultProps = {
  data: {
    goal: '',
  } as Partial<OnboardingFormData>,
  errors: {} as FormErrors,
  onChange: vi.fn(),
};

export const selectedProps = {
  ...defaultProps,
  data: { goal: 'lose_fat' } as Partial<OnboardingFormData>,
};

export const errorProps = {
  ...defaultProps,
  errors: { goal: 'Selecciona un objetivo' } as FormErrors,
};
