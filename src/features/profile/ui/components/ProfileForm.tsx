import { XMarkIcon } from '@heroicons/react/24/outline';

import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type {
  ProfileData,
  ProfileUpdateData,
} from '../../core/domain/models/ProfileData';
import {
  ACTIVITY_LEVEL_OPTIONS,
  DAYS_PER_WEEK_OPTIONS,
  EQUIPMENT_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  GOAL_OPTIONS,
  INJURY_OPTIONS,
  SEX_OPTIONS,
} from '../../core/domain/models/ProfileData';
import { useProfileForm } from '../hooks/useProfileForm';
import { FormFeedback } from './FormFeedback';

interface ProfileFormProps {
  profile: ProfileData;
  onSubmit: (data: ProfileUpdateData) => Promise<void>;
  onCancel: () => void;
  updating: boolean;
  error: string | null;
  success: boolean;
}

const inputClass =
  "w-full bg-[#12121a] border-2 border-[#1e1e2e] px-3 py-2.5 font-['Press_Start_2P'] text-[10px] text-[#e4e4e7] placeholder:text-[#52525b] focus:border-green-500/70 focus:outline-none transition-colors [color-scheme:dark]";
const labelClass =
  "block font-['Press_Start_2P'] text-[8px] tracking-widest text-[#a1a1aa] mb-2";
const sectionTitleClass =
  "font-['Press_Start_2P'] text-[10px] tracking-widest text-green-500 [text-shadow:0_0_8px_rgba(34,197,94,0.4)]";

type ChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

const Chip = ({ label, selected, onClick }: ChipProps): React.JSX.Element => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={`font-['Press_Start_2P'] text-[9px] tracking-widest border-2 px-3 py-2 transition-colors ${
      selected
        ? 'border-green-500 bg-green-500/15 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
        : 'border-[#1e1e2e] bg-[#12121a] text-[#a1a1aa] hover:border-green-500/40 hover:text-green-400'
    }`}
  >
    {selected ? '▶ ' : ''}
    {label}
  </button>
);

export const ProfileForm = (props: ProfileFormProps): React.JSX.Element => {
  const { form, handleChange, toggleInArray, handleSubmit } = useProfileForm({
    profile: props.profile,
    onSubmit: props.onSubmit,
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="relative border-2 border-green-500/40 bg-[#0d0d14] p-5 sm:p-6"
    >
      <PixelCorners size="md" className="border-green-500/40" />

      <header className="mb-6 flex items-center justify-between gap-3">
        <p className="font-['Press_Start_2P'] text-[10px] tracking-widest text-green-500">
          ✎ EDITAR PERFIL
        </p>
        <button
          type="button"
          onClick={props.onCancel}
          className="inline-flex items-center gap-2 font-['Press_Start_2P'] text-[9px] tracking-widest border-2 border-[#27272a] bg-[#0d0d14] text-[#a1a1aa] hover:border-[#3f3f46] px-3 py-2 transition-colors"
        >
          <XMarkIcon className="h-3 w-3" />
          CERRAR
        </button>
      </header>

      {/* SECTION 1 — Datos personales */}
      <section className="mb-8 border-b-2 border-[#1e1e2e] pb-6">
        <p className={sectionTitleClass}>▸ DATOS PERSONALES</p>

        <div className="mt-5 mb-4">
          <label htmlFor="profile-name" className={labelClass}>
            NOMBRE
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
          <span className={labelClass}>EMAIL</span>
          <p className="border-2 border-[#1e1e2e] bg-[#0a0a0f] px-3 py-2.5 font-['Press_Start_2P'] text-[10px] text-[#71717a]">
            {props.profile.email}
          </p>
        </div>

        <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="profile-age" className={labelClass}>
              EDAD
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
              PESO (KG)
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
              ALTURA (CM)
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="profile-sex" className={labelClass}>
              SEXO
            </label>
            <select
              id="profile-sex"
              value={form.sex}
              onChange={(e) => handleChange('sex', e.target.value)}
              className={inputClass}
            >
              <option value="">— Seleccionar —</option>
              {SEX_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="profile-activity" className={labelClass}>
              NIVEL DE ACTIVIDAD
            </label>
            <select
              id="profile-activity"
              value={form.activity_level}
              onChange={(e) => handleChange('activity_level', e.target.value)}
              className={inputClass}
            >
              <option value="">— Seleccionar —</option>
              {ACTIVITY_LEVEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Entrenamiento (onboarding) */}
      <section className="mb-6">
        <p className={sectionTitleClass}>▸ ENTRENAMIENTO</p>
        <p className="mt-2 mb-5 font-['VT323'] text-base text-[#a1a1aa]">
          Cambia aqui las preferencias del onboarding. Las recomendaciones de
          rutinas se actualizan al guardar.
        </p>

        <div className="mb-5">
          <span className={labelClass}>OBJETIVOS (puedes elegir varios)</span>
          <div className="flex flex-wrap gap-2">
            {GOAL_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                selected={form.goals.includes(opt.value)}
                onClick={() => toggleInArray('goals', opt.value)}
              />
            ))}
          </div>
        </div>

        <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="profile-experience" className={labelClass}>
              EXPERIENCIA
            </label>
            <select
              id="profile-experience"
              value={form.experience_level}
              onChange={(e) => handleChange('experience_level', e.target.value)}
              className={inputClass}
            >
              <option value="">— Seleccionar —</option>
              {EXPERIENCE_LEVEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="profile-equipment" className={labelClass}>
              EQUIPAMIENTO
            </label>
            <select
              id="profile-equipment"
              value={form.equipment}
              onChange={(e) => handleChange('equipment', e.target.value)}
              className={inputClass}
            >
              <option value="">— Seleccionar —</option>
              {EQUIPMENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="profile-days" className={labelClass}>
            DIAS POR SEMANA
          </label>
          <select
            id="profile-days"
            value={form.days_per_week}
            onChange={(e) => handleChange('days_per_week', e.target.value)}
            className={inputClass}
          >
            <option value="">— Seleccionar —</option>
            {DAYS_PER_WEEK_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className={labelClass}>
            LESIONES (NINGUNA o varias en concreto)
          </span>
          <div className="flex flex-wrap gap-2">
            {INJURY_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                selected={form.injuries.includes(opt.value)}
                onClick={() =>
                  toggleInArray('injuries', opt.value, { exclusive: 'NONE' })
                }
              />
            ))}
          </div>
        </div>
      </section>

      <FormFeedback
        error={props.error}
        success={
          props.success
            ? 'Perfil actualizado. Las calorias se han recalculado.'
            : null
        }
      />

      <button
        type="submit"
        disabled={props.updating}
        className="w-full font-['Press_Start_2P'] text-[10px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-6 py-3 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:mt-0"
      >
        {props.updating ? 'GUARDANDO…' : '▶ GUARDAR CAMBIOS'}
      </button>
    </form>
  );
};
