import { PencilIcon } from '@heroicons/react/24/outline';

import { PixelCorners } from '@shared/components/PixelCorners';
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
import {
  ACTIVITY_BADGES,
  DAYS_PER_WEEK_BADGES,
  EQUIPMENT_BADGES,
  EXPERIENCE_BADGES,
  GOAL_BADGES,
  INJURY_BADGES,
  SEX_BADGES,
  type BadgeConfig,
} from '../badges';
import { ProfileBadge } from './ProfileBadge';

interface ProfileDataViewProps {
  profile: ProfileData;
  onEdit: () => void;
}

const dash = '—';

const formatNumber = (value: number | null | undefined, suffix: string) =>
  value != null && value > 0 ? `${value} ${suffix}` : dash;

/** Plain text + value field — kept for items that don't map to a chip
 *  (numbers, names, free-text). */
const TextField = ({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.JSX.Element => (
  <div className="border-2 border-border bg-page p-3">
    <dt className="font-pixel text-[9px] sm:text-[10px] tracking-widest text-ink-faint">
      {label}
    </dt>
    <dd className="mt-2 font-pixel-mono text-lg sm:text-xl text-ink break-words leading-snug">
      {value}
    </dd>
  </div>
);

/** Badge field — renders one or more chips for an enum-list value (or
 *  a single value). Falls back to a "—" plain field when empty. */
const BadgeField = ({
  label,
  values,
  badges,
  labels,
}: {
  label: string;
  values: string[];
  badges: Record<string, BadgeConfig>;
  labels: Record<string, string>;
}): React.JSX.Element => {
  if (values.length === 0) {
    return <TextField label={label} value={dash} />;
  }
  return (
    <div className="border-2 border-border bg-page p-3">
      <dt className="font-pixel text-[9px] sm:text-[10px] tracking-widest text-ink-faint">
        {label}
      </dt>
      <dd className="mt-2 flex flex-wrap gap-2">
        {values.map((value) => (
          <ProfileBadge
            key={value}
            config={badges[value]}
            label={labels[value] ?? value}
          />
        ))}
      </dd>
    </div>
  );
};

/** Card shell — same retro frame used by the sidebar pieces. The two
 *  data sections (personal · entrenamiento) each get their own,
 *  replacing the previous single mega-card with two h3 sub-sections.
 *
 *  Optional `footer` slot fills the bottom of the card with a hint
 *  line. Used by the ENTRENAMIENTO card to absorb the extra vertical
 *  space when the parent stretches it to match the sidebar height —
 *  without a footer the dl would float at the top with empty space
 *  underneath. */
const DataCard = ({
  title,
  onEdit,
  children,
  footer,
  className,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}): React.JSX.Element => (
  <section
    className={`relative flex flex-col border-2 border-green-500/40 bg-card p-5 sm:p-6 ${className ?? ''}`.trim()}
  >
    <PixelCorners size="md" className="border-green-500/40" />
    <header className="mb-5 flex items-center justify-between gap-3">
      <p className="font-pixel text-[11px] sm:text-[12px] tracking-widest text-green-500 [text-shadow:0_0_8px_rgba(34,197,94,0.4)]">
        ◆ {title}
      </p>
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex items-center gap-2 font-pixel text-[10px] tracking-widest border-2 border-green-500/50 bg-green-500/10 text-green-400 hover:border-green-500 hover:bg-green-500/20 px-3 py-2 transition-colors"
      >
        <PencilIcon className="h-3.5 w-3.5" />
        EDITAR
      </button>
    </header>
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</dl>
    {footer && (
      <div className="mt-auto pt-5 border-t-2 border-border-muted">
        {footer}
      </div>
    )}
  </section>
);

/**
 * Two-card profile view: "Datos personales" and "Entrenamiento" sit in
 * separate panels with their own EDITAR button each. Both buttons
 * trigger the same `onEdit` for now — opening the global form — so the
 * underlying flow is unchanged. Splitting visually still helps: the
 * previous single card was a wall of 12 fields under one h2 with no
 * card-level separation, just a sub-heading.
 */
export const ProfileDataView = ({
  profile,
  onEdit,
}: ProfileDataViewProps): React.JSX.Element => {
  // Wrap single-value enums in arrays so they share the BadgeField API
  // with the multi-select fields (goals, equipment, injuries).
  const sexValues = profile.sex ? [profile.sex] : [];
  const activityValues = profile.activity_level ? [profile.activity_level] : [];
  const experienceValues = profile.experience_level
    ? [profile.experience_level]
    : [];
  const daysValues = profile.days_per_week ? [profile.days_per_week] : [];

  // Hide the LESIONES row entirely when the only value is "NONE" (the
  // default for users without injuries). Surfacing "✅ Ninguna" wastes
  // a slot — by far the typical case.
  const hasMeaningfulInjuries =
    profile.injuries.length > 0 &&
    !(profile.injuries.length === 1 && profile.injuries[0] === 'NONE');

  return (
    // gap-12 — wider than the aside's gap-5 — so the two data cards
    // extend the right column vertically to roughly match the left
    // aside (banner + summary + stats panel). Otherwise the right
    // ended ~250px above the aside and the page read as left-biased.
    <div className="flex flex-col gap-12">
      <DataCard title="DATOS PERSONALES" onEdit={onEdit}>
        <TextField label="NOMBRE" value={profile.name || dash} />
        <TextField label="EMAIL" value={profile.email} />
        <TextField label="EDAD" value={formatNumber(profile.age, 'años')} />
        <BadgeField
          label="SEXO"
          values={sexValues}
          badges={SEX_BADGES}
          labels={SEX_LABELS}
        />
        <TextField label="PESO" value={formatNumber(profile.weight, 'kg')} />
        <TextField label="ALTURA" value={formatNumber(profile.height, 'cm')} />
        <BadgeField
          label="NIVEL ACTIVIDAD"
          values={activityValues}
          badges={ACTIVITY_BADGES}
          labels={ACTIVITY_LEVEL_LABELS}
        />
      </DataCard>

      <DataCard
        title="ENTRENAMIENTO"
        onEdit={onEdit}
        // lg:flex-1 stretches the card to consume the extra height left
        // over by the taller sidebar (banner + stats panel) — without
        // it the column would end after the dl and leave a gap below
        // the card. The footer absorbs the extra space gracefully.
        className="lg:flex-1"
        footer={
          <p className="font-pixel-mono text-base leading-snug text-ink-muted">
            Estos datos personalizan las rutinas que te recomendamos. Ajusta
            cualquiera y la app se adapta a tu plan.
          </p>
        }
      >
        <BadgeField
          label="OBJETIVOS"
          values={profile.goals}
          badges={GOAL_BADGES}
          labels={GOAL_LABELS}
        />
        <BadgeField
          label="EXPERIENCIA"
          values={experienceValues}
          badges={EXPERIENCE_BADGES}
          labels={EXPERIENCE_LEVEL_LABELS}
        />
        <BadgeField
          label="EQUIPAMIENTO"
          values={profile.equipment}
          badges={EQUIPMENT_BADGES}
          labels={EQUIPMENT_LABELS}
        />
        <BadgeField
          label="DIAS POR SEMANA"
          values={daysValues}
          badges={DAYS_PER_WEEK_BADGES}
          labels={DAYS_PER_WEEK_LABELS}
        />
        {hasMeaningfulInjuries && (
          <BadgeField
            label="LESIONES"
            values={profile.injuries}
            badges={INJURY_BADGES}
            labels={INJURY_LABELS}
          />
        )}
      </DataCard>
    </div>
  );
};
