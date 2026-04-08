import { useState } from 'react';

import type {
  ProfileData,
  ProfileUpdateData,
} from '../../core/domain/models/ProfileData';
import {
  ACTIVITY_LEVEL_OPTIONS,
  GOAL_OPTIONS,
} from '../../core/domain/models/ProfileData';

interface ProfileFormProps {
  profile: ProfileData;
  onSubmit: (data: ProfileUpdateData) => Promise<void>;
  updating: boolean;
  error: string | null;
  success: boolean;
}

export const ProfileForm = ({
  profile,
  onSubmit,
  updating,
  error,
  success,
}: ProfileFormProps) => {
  const [form, setForm] = useState({
    name: profile.name,
    weight: profile.weight != null ? String(profile.weight) : '',
    height: profile.height != null ? String(profile.height) : '',
    age: profile.age != null ? String(profile.age) : '',
    activity_level: profile.activity_level ?? '',
    goal: profile.goal ?? '',
    sleep_hours: profile.sleep_hours != null ? String(profile.sleep_hours) : '',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    if (Object.keys(data).length > 0) {
      await onSubmit(data);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-emerald-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';
  const labelClass = 'block text-sm font-medium text-zinc-300 mb-2';

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
    >
      <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-zinc-400">
        Datos personales
      </h3>

      <div className="mb-4">
        <label htmlFor="profile-name" className={labelClass}>
          Nombre
        </label>
        <input
          id="profile-name"
          type="text"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="mb-4">
        <label className={labelClass}>Email</label>
        <p className="px-4 py-3 rounded-xl bg-zinc-800/50 text-zinc-500 text-sm">
          {profile.email}
        </p>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="profile-age" className={labelClass}>
            Edad
          </label>
          <input
            id="profile-age"
            type="number"
            min="14"
            max="100"
            value={form.age}
            onChange={(e) => handleChange('age', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="profile-weight" className={labelClass}>
            Peso (kg)
          </label>
          <input
            id="profile-weight"
            type="number"
            step="0.1"
            min="30"
            max="250"
            value={form.weight}
            onChange={(e) => handleChange('weight', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="profile-height" className={labelClass}>
            Altura (cm)
          </label>
          <input
            id="profile-height"
            type="number"
            min="120"
            max="230"
            value={form.height}
            onChange={(e) => handleChange('height', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="profile-activity" className={labelClass}>
            Nivel de actividad
          </label>
          <select
            id="profile-activity"
            value={form.activity_level}
            onChange={(e) => handleChange('activity_level', e.target.value)}
            className={inputClass}
          >
            <option value="">Seleccionar</option>
            {ACTIVITY_LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="profile-goal" className={labelClass}>
            Objetivo
          </label>
          <select
            id="profile-goal"
            value={form.goal}
            onChange={(e) => handleChange('goal', e.target.value)}
            className={inputClass}
          >
            <option value="">Seleccionar</option>
            {GOAL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="profile-sleep" className={labelClass}>
          Horas de sueno
        </label>
        <input
          id="profile-sleep"
          type="number"
          min="4"
          max="12"
          value={form.sleep_hours}
          onChange={(e) => handleChange('sleep_hours', e.target.value)}
          className={inputClass}
        />
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
          <p className="text-sm text-emerald-400">
            Perfil actualizado. Las calorias se han recalculado.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={updating}
        className="w-full rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-emerald-400 disabled:opacity-50"
      >
        {updating ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  );
};
