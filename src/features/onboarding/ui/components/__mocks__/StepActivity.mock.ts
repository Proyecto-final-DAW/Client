import type {
  OnboardingFormData,
  FormErrors,
} from '../../../core/domain/models/OnboardingFormData';

export const defaultProps = {
  data: { activityLevel: undefined } as Partial<OnboardingFormData>,
  errors: {} as FormErrors,
  onChange: (_field: keyof OnboardingFormData, _value: string) => {},
};

export const selectedProps = {
  ...defaultProps,
  data: { activityLevel: 'moderate' as const } as Partial<OnboardingFormData>,
};

export const errorProps = {
  ...defaultProps,
  errors: { activityLevel: 'Selecciona un nivel de actividad' } as FormErrors,
};
