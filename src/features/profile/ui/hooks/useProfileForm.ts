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
  equipment: string;
  days_per_week: string;
  injuries: string[];
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
  equipment: profile.equipment ?? '',
  days_per_week: profile.days_per_week ?? '',
  injuries: profile.injuries ?? [],
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
  if (form.equipment && form.equipment !== profile.equipment) {
    data.equipment = form.equipment;
  }
  if (form.days_per_week && form.days_per_week !== profile.days_per_week) {
    data.days_per_week = form.days_per_week;
  }
  if (!stringArraysEqual(form.injuries, profile.injuries ?? [])) {
    data.injuries = form.injuries;
  }

  return data;
};

interface UseProfileFormParams {
  profile: ProfileData;
  onSubmit: (data: ProfileUpdateData) => Promise<void>;
}

export const useProfileForm = (props: UseProfileFormParams) => {
  const [form, setForm] = useState<ProfileFormState>(() =>
    toFormState(props.profile)
  );

  const handleChange = (
    field: keyof Omit<ProfileFormState, 'goals' | 'injuries'>,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Multi-select helper for goals[] and injuries[]. The "NONE" injury is
  // mutually exclusive with any other injury — picking it clears the others,
  // and picking another clears NONE.
  const toggleInArray = (
    field: 'goals' | 'injuries',
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
    const data = buildUpdatePayload(form, props.profile);
    if (Object.keys(data).length > 0) {
      await props.onSubmit(data);
    }
  };

  return { form, handleChange, toggleInArray, handleSubmit };
};
