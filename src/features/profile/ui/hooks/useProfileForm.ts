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
  activity_level: string;
  goal: string;
  sleep_hours: string;
};

const toFormState = (profile: ProfileData): ProfileFormState => ({
  name: profile.name,
  weight: profile.weight != null ? String(profile.weight) : '',
  height: profile.height != null ? String(profile.height) : '',
  age: profile.age != null ? String(profile.age) : '',
  activity_level: profile.activity_level ?? '',
  goal: profile.goal ?? '',
  sleep_hours: profile.sleep_hours != null ? String(profile.sleep_hours) : '',
});

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
  if (form.activity_level && form.activity_level !== profile.activity_level) {
    data.activity_level = form.activity_level;
  }
  if (form.goal && form.goal !== profile.goal) {
    data.goal = form.goal;
  }
  if (
    form.sleep_hours &&
    Number(form.sleep_hours) > 0 &&
    Number(form.sleep_hours) !== profile.sleep_hours
  ) {
    data.sleep_hours = Number(form.sleep_hours);
  }

  return data;
};

interface UseProfileFormParams {
  profile: ProfileData;
  onSubmit: (data: ProfileUpdateData) => Promise<void>;
}

export const useProfileForm = ({ profile, onSubmit }: UseProfileFormParams) => {
  const [form, setForm] = useState<ProfileFormState>(() => toFormState(profile));

  const handleChange = (field: keyof ProfileFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = buildUpdatePayload(form, profile);
    if (Object.keys(data).length > 0) {
      await onSubmit(data);
    }
  };

  return { form, handleChange, handleSubmit };
};
