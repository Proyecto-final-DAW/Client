import type {
  OnboardingFormData,
  FormErrors,
} from '../../../core/domain/models/OnboardingFormData';

export const defaultProps = {
  data: { goal: null } as Partial<OnboardingFormData>,
  errors: {} as FormErrors,
  onChange: (_field: keyof OnboardingFormData, _value: string) => {},
};

export const selectedProps = {
  ...defaultProps,
  data: { goal: 'lose_fat' as const } as Partial<OnboardingFormData>,
};

export const errorProps = {
  ...defaultProps,
  errors: { goal: 'Selecciona un objetivo' } as FormErrors,
};
