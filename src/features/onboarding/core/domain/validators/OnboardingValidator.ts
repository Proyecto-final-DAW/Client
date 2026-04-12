import type {
  OnboardingFormData,
  FormErrors,
} from '../models/OnboardingFormData';

function calculateAge(birthDateStr: string): number {
  const today = new Date();
  const birth = new Date(birthDateStr);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

export function validateStep1(data: OnboardingFormData): FormErrors {
  const errors: FormErrors = {};
  const trimmedName = data.name.trim();

  if (!trimmedName) {
    errors.name = 'El nombre es obligatorio';
  } else if (trimmedName.length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres';
  } else if (trimmedName.length > 100) {
    errors.name = 'El nombre no puede superar los 100 caracteres';
  }

  if (!data.birthDate) {
    errors.birthDate = 'La fecha de nacimiento es obligatoria';
  } else if (!isValidDate(data.birthDate)) {
    errors.birthDate = 'Fecha no válida';
  } else {
    const age = calculateAge(data.birthDate);
    if (age < 14) errors.birthDate = 'Debes tener al menos 14 años';
    else if (age > 100) errors.birthDate = 'Fecha de nacimiento no válida';
  }

  return errors;
}

export function validateStep2(data: OnboardingFormData): FormErrors {
  const errors: FormErrors = {};

  const weight = parseFloat(data.weight);
  if (!data.weight) errors.weight = 'El peso es obligatorio';
  else if (isNaN(weight)) errors.weight = 'Introduce un número válido';
  else if (weight < 30 || weight > 250)
    errors.weight = 'El peso debe estar entre 30 y 250 kg';

  const height = parseFloat(data.height);
  if (!data.height) errors.height = 'La altura es obligatoria';
  else if (isNaN(height)) errors.height = 'Introduce un número válido';
  else if (height < 120 || height > 230)
    errors.height = 'La altura debe estar entre 120 y 230 cm';

  if (!data.sex) errors.sex = 'Selecciona tu sexo biológico';

  return errors;
}

export function validateStep3(data: OnboardingFormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.activityLevel)
    errors.activityLevel = 'Selecciona tu nivel de actividad';
  return errors;
}

export function validateStep4(data: OnboardingFormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.goals || data.goals.length === 0)
    errors.goals = 'Selecciona al menos un objetivo';
  return errors;
}

export function validateStep5(data: OnboardingFormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.experienceLevel)
    errors.experienceLevel = 'Selecciona tu experiencia';
  if (!data.equipment) errors.equipment = 'Selecciona tu equipamiento';
  if (!data.daysPerWeek) errors.daysPerWeek = 'Selecciona los días por semana';
  return errors;
}

export function validateStep6(data: OnboardingFormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.injury) errors.injury = 'Selecciona una opción';
  return errors;
}

export function validateStep(
  step: number,
  data: OnboardingFormData
): FormErrors {
  switch (step) {
    case 1:
      return validateStep1(data);
    case 2:
      return validateStep2(data);
    case 3:
      return validateStep3(data);
    case 4:
      return validateStep4(data);
    case 5:
      return validateStep5(data);
    case 6:
      return validateStep6(data);
    default:
      return {};
  }
}
