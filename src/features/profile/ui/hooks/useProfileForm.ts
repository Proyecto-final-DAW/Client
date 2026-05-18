import { useState } from 'react';

import type {
  ProfileData,
  ProfileUpdateData,
} from '../../core/domain/models/ProfileData';

type ProfileFormState = {
  name: string;
  weight: string;
  height: string;
  age: string;
  sex: string;
  activity_level: string;
  goals: string[];
  experience_level: string;
  equipment: string[];
  days_per_week: string;
  injuries: string[];
  /** Free-text follow-up shown only when "OTRA" is in `injuries`. */
  injury_notes: string;
};

const toFormState = (profile: ProfileData): ProfileFormState => ({
  name: profile.name,
  weight: profile.weight != null ? String(profile.weight) : '',
  height: profile.height != null ? String(profile.height) : '',
  age: profile.age != null ? String(profile.age) : '',
  sex: profile.sex ?? '',
  activity_level: profile.activity_level ?? '',
  goals: profile.goals ?? [],
  experience_level: profile.experience_level ?? '',
  equipment: profile.equipment ?? [],
  days_per_week: profile.days_per_week ?? '',
  injuries: profile.injuries ?? [],
  injury_notes: profile.injury_notes ?? '',
});

const stringArraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((v, i) => v === sortedB[i]);
};

const buildUpdatePayload = (
  form: ProfileFormState,
  profile: ProfileData
): ProfileUpdateData => {
  const data: ProfileUpdateData = {};

  if (form.name.trim() && form.name.trim() !== profile.name) {
    data.name = form.name.trim();
  }
  if (
    form.weight &&
    Number(form.weight) > 0 &&
    Number(form.weight) !== profile.weight
  ) {
    data.weight = Number(form.weight);
  }
  if (
    form.height &&
    Number(form.height) > 0 &&
    Number(form.height) !== profile.height
  ) {
    data.height = Number(form.height);
  }
  if (form.age && Number(form.age) > 0 && Number(form.age) !== profile.age) {
    data.age = Number(form.age);
  }
  if (form.sex && form.sex !== profile.sex) {
    data.sex = form.sex as 'MALE' | 'FEMALE' | 'NON_BINARY';
  }
  if (form.activity_level && form.activity_level !== profile.activity_level) {
    data.activity_level = form.activity_level;
  }
  if (!stringArraysEqual(form.goals, profile.goals ?? [])) {
    data.goals = form.goals;
  }
  if (
    form.experience_level &&
    form.experience_level !== profile.experience_level
  ) {
    data.experience_level = form.experience_level;
  }
  if (!stringArraysEqual(form.equipment, profile.equipment ?? [])) {
    data.equipment = form.equipment;
  }
  if (form.days_per_week && form.days_per_week !== profile.days_per_week) {
    data.days_per_week = form.days_per_week;
  }
  if (!stringArraysEqual(form.injuries, profile.injuries ?? [])) {
    data.injuries = form.injuries;
  }
  // Send injury_notes when:
  //   - "OTHER" is selected AND the text differs from saved (covers
  //     both first-time fill-in and edits to an existing note).
  //   - "OTHER" was deselected — clear the column with empty string
  //     so the persisted note doesn't outlive the chip selection.
  const trimmedNotes = form.injury_notes.trim();
  const savedNotes = (profile.injury_notes ?? '').trim();
  const hasOther = form.injuries.includes('OTHER');
  if (hasOther && trimmedNotes !== savedNotes) {
    data.injury_notes = trimmedNotes;
  } else if (!hasOther && savedNotes !== '') {
    data.injury_notes = '';
  }

  return data;
};

interface UseProfileFormParams {
  profile: ProfileData;
  onSubmit: (data: ProfileUpdateData) => Promise<void>;
}

type NumericFieldKey = 'age' | 'weight' | 'height';

// Same ranges and messages used in the onboarding validators so a user
// editing their profile sees the same UX as during signup. Native HTML
// validation (`min`/`max`) was triggering the browser's default tooltip
// ("El valor debe ser inferior o igual a 230") which clashes visually
// with the rest of the pixel theme — we validate in JS instead and
// render the error with the same red treatment used in onboarding.
const validateNumericField = (
  field: NumericFieldKey,
  value: string
): string | null => {
  if (!value) return null;
  const num = Number(value);
  if (Number.isNaN(num)) return 'Introduce un numero valido';
  if (field === 'age') {
    if (num < 14 || num > 100) return 'La edad debe estar entre 14 y 100';
  } else if (field === 'weight') {
    if (num < 30 || num > 250) return 'El peso debe estar entre 30 y 250 kg';
  } else if (field === 'height') {
    if (num < 120 || num > 230)
      return 'La altura debe estar entre 120 y 230 cm';
  }
  return null;
};

export const useProfileForm = (props: UseProfileFormParams) => {
  const [form, setForm] = useState<ProfileFormState>(() =>
    toFormState(props.profile)
  );
  const [errors, setErrors] = useState<
    Partial<Record<NumericFieldKey, string>>
  >({});

  const handleChange = (
    field: keyof Omit<ProfileFormState, 'goals' | 'injuries' | 'equipment'>,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'age' || field === 'weight' || field === 'height') {
      const message = validateNumericField(field, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (message) next[field] = message;
        else delete next[field];
        return next;
      });
    }
  };

  // Multi-select helper for array fields. Pass `exclusive` when one value
  // (e.g. "NONE" injury) is mutually exclusive with the rest.
  const toggleInArray = (
    field: 'goals' | 'injuries' | 'equipment',
    value: string,
    options: { exclusive?: string } = {}
  ) => {
    setForm((prev) => {
      const current = prev[field];
      const isSelected = current.includes(value);
      let next: string[];
      if (isSelected) {
        next = current.filter((v) => v !== value);
      } else if (options.exclusive && value === options.exclusive) {
        next = [value];
      } else if (options.exclusive) {
        next = [...current.filter((v) => v !== options.exclusive), value];
      } else {
        next = [...current, value];
      }
      return { ...prev, [field]: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Re-run validation on submit so a user that ignored the inline
    // error (or pasted a bad value without changing focus) still gets
    // blocked here. Without this, the request would reach the server
    // and bounce on the API-side Zod schema with a less friendly error.
    const submitErrors: Partial<Record<NumericFieldKey, string>> = {};
    (['age', 'weight', 'height'] as const).forEach((field) => {
      const msg = validateNumericField(field, form[field]);
      if (msg) submitErrors[field] = msg;
    });
    if (Object.keys(submitErrors).length > 0) {
      setErrors(submitErrors);
      return;
    }
    const data = buildUpdatePayload(form, props.profile);
    if (Object.keys(data).length > 0) {
      await props.onSubmit(data);
    }
  };

  return { form, errors, handleChange, toggleInArray, handleSubmit };
};
