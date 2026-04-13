import type {
  ProfileData,
  ProfileUpdateData,
} from '../../core/domain/models/ProfileData';
import {
  ACTIVITY_LEVEL_OPTIONS,
  GOAL_OPTIONS,
} from '../../core/domain/models/ProfileData';
import { useProfileForm } from '../hooks/useProfileForm';
import { FormFeedback } from './FormFeedback';

interface ProfileFormProps {
  profile: ProfileData;
  onSubmit: (data: ProfileUpdateData) => Promise<void>;
  updating: boolean;
  error: string | null;
  success: boolean;
}

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-emerald-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';
const labelClass = 'block text-sm font-medium text-zinc-300 mb-2';

export const ProfileForm = ({
  profile,
  onSubmit,
  updating,
  error,
  success,
}: ProfileFormProps) => {
  const { form, handleChange, handleSubmit } = useProfileForm({
    profile,
    onSubmit,
  });

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

      <FormFeedback
        error={error}
        success={
          success ? 'Perfil actualizado. Las calorias se han recalculado.' : null
        }
      />

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
