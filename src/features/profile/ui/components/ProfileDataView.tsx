import { PencilIcon } from '@heroicons/react/24/outline';

import { PixelCorners } from '../../../../shared/components/PixelCorners';
import {
  ACTIVITY_LEVEL_LABELS,
  DAYS_PER_WEEK_LABELS,
  EQUIPMENT_LABELS,
  EXPERIENCE_LEVEL_LABELS,
  GOAL_LABELS,
  INJURY_LABELS,
  SEX_LABELS,
  type ProfileData,
} from '../../core/domain/models/ProfileData';

interface ProfileDataViewProps {
  profile: ProfileData;
  onEdit: () => void;
}

const dash = '—';

const formatNumber = (value: number | null | undefined, suffix: string) =>
  value != null && value > 0 ? `${value} ${suffix}` : dash;

const formatList = (
  values: string[] | null | undefined,
  labels: Record<string, string>
): string => {
  if (!values || values.length === 0) return dash;
  return values.map((v) => labels[v] ?? v).join(', ');
};

const formatLabel = (
  value: string | null | undefined,
  labels: Record<string, string>
): string => (value ? (labels[value] ?? value) : dash);

const Section = ({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: string }[];
}): React.JSX.Element => (
  <div>
    <p className="mb-3 font-['Press_Start_2P'] text-[10px] tracking-widest text-green-500 [text-shadow:0_0_8px_rgba(34,197,94,0.4)]">
      ▸ {title}
    </p>
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="border-2 border-[#1e1e2e] bg-[#0a0a0f] p-3"
        >
          <dt className="font-['Press_Start_2P'] text-[8px] tracking-widest text-[#71717a]">
            {item.label}
          </dt>
          <dd className="mt-2 font-['VT323'] text-lg text-[#e4e4e7] break-words">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  </div>
);

export const ProfileDataView = ({
  profile,
  onEdit,
}: ProfileDataViewProps): React.JSX.Element => {
  const personal = [
    { label: 'NOMBRE', value: profile.name || dash },
    { label: 'EMAIL', value: profile.email },
    { label: 'EDAD', value: formatNumber(profile.age, 'años') },
    { label: 'SEXO', value: formatLabel(profile.sex, SEX_LABELS) },
    { label: 'PESO', value: formatNumber(profile.weight, 'kg') },
    { label: 'ALTURA', value: formatNumber(profile.height, 'cm') },
    {
      label: 'NIVEL ACTIVIDAD',
      value: formatLabel(profile.activity_level, ACTIVITY_LEVEL_LABELS),
    },
  ];

  const training = [
    {
      label: 'OBJETIVOS',
      value: formatList(profile.goals, GOAL_LABELS),
    },
    {
      label: 'EXPERIENCIA',
      value: formatLabel(profile.experience_level, EXPERIENCE_LEVEL_LABELS),
    },
    {
      label: 'EQUIPAMIENTO',
      value: formatLabel(profile.equipment, EQUIPMENT_LABELS),
    },
    {
      label: 'DIAS POR SEMANA',
      value: formatLabel(profile.days_per_week, DAYS_PER_WEEK_LABELS),
    },
    {
      label: 'LESIONES',
      value: formatList(profile.injuries, INJURY_LABELS),
    },
  ];

  return (
    <section className="relative border-2 border-green-500/40 bg-[#0d0d14] p-5 sm:p-6">
      <PixelCorners size="md" className="border-green-500/40" />

      <header className="mb-6 flex items-center justify-between gap-3">
        <p className="font-['Press_Start_2P'] text-[10px] tracking-widest text-green-500">
          ◆ MI PERFIL
        </p>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-2 font-['Press_Start_2P'] text-[9px] tracking-widest border-2 border-[#27272a] bg-[#0d0d14] text-[#a1a1aa] hover:border-green-500/50 hover:text-green-400 px-3 py-2 transition-colors"
        >
          <PencilIcon className="h-3 w-3" />
          EDITAR
        </button>
      </header>

      <div className="flex flex-col gap-6">
        <Section title="DATOS PERSONALES" items={personal} />
        <Section title="ENTRENAMIENTO" items={training} />
      </div>
    </section>
  );
};
