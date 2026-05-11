import { PixelCorners } from '@shared/components/PixelCorners';
import { motion } from 'framer-motion';

import type { OnboardingFormData } from '../../core/domain/models/OnboardingFormData';

interface StepPreviewProps {
  data: OnboardingFormData;
}

const GOAL_LABEL: Record<string, string> = {
  LOSE_FAT: 'Perder grasa',
  GAIN_MUSCLE: 'Ganar musculo',
  MAINTAIN: 'Mantener',
  HEALTH: 'Salud general',
};

const ACTIVITY_LABEL: Record<string, string> = {
  SEDENTARY: 'Sedentario',
  LIGHT: 'Ligero',
  MODERATE: 'Moderado',
  ACTIVE: 'Activo',
  VERY_ACTIVE: 'Muy activo',
};

const EXPERIENCE_LABEL: Record<string, string> = {
  BEGINNER: 'Principiante',
  INTERMEDIATE: 'Intermedio',
  ADVANCED: 'Avanzado',
};

const EQUIPMENT_LABEL: Record<string, string> = {
  FULL_GYM: 'Gimnasio completo',
  HOME_WEIGHTS: 'Pesas en casa',
  BODYWEIGHT: 'Peso corporal',
};

/**
 * Final wizard step — closes the emotional loop before the user submits.
 * Shows the chosen profile + the starting class (always Escudero/T0,
 * since every player begins there) so the user *sees* what they're
 * about to become rather than just "press SUBMIT into the void".
 *
 * No form fields, no validation — pressing SIGUIENTE on this step
 * triggers the actual submit.
 */
export const StepPreview = ({ data }: StepPreviewProps): React.JSX.Element => {
  const goalsText =
    data.goals.length > 0
      ? data.goals.map((g) => GOAL_LABEL[g] ?? g).join(', ')
      : '—';
  const equipText =
    data.equipment.length > 0
      ? data.equipment.map((e) => EQUIPMENT_LABEL[e] ?? e).join(', ')
      : '—';
  const otherInjurySelected = data.injuries.includes('OTHER');
  const injuryNotes = (data.injuryNotes ?? '').trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-5"
    >
      <header className="text-center">
        <p className="font-pixel text-[8px] sm:text-[9px] tracking-widest text-green-500">
          ◆ TU LEYENDA EMPIEZA AQUI
        </p>
        <h2 className="mt-2 font-pixel text-base sm:text-lg text-green-400 [text-shadow:2px_2px_0_#000,0_0_14px_rgba(34,197,94,0.45)]">
          REVISA Y CONFIRMA
        </h2>
      </header>

      {/* Profile summary — the *only* card on this step. The character
          reveal (ESCUDERO LVL 1 + frase) lives in the post-onboarding
          OriginStoryIntro popup so the wizard finale stays focused on
          "did I fill this right?" rather than mixing data review with
          lore reveal. */}
      <section className="border-2 border-green-500/40 bg-card p-6 sm:p-8 shadow-[0_0_18px_rgba(34,197,94,0.15)]">
        <PixelCorners size="md" className="border-green-500/40" />
        <p className="font-pixel text-[10px] sm:text-[11px] tracking-widest text-green-500 mb-6 text-center">
          ◆ TU PERFIL
        </p>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5 text-center">
          <div>
            <dt className="font-pixel text-[10px] tracking-widest text-ink-faint">
              EDAD / SEXO
            </dt>
            <dd className="mt-2 font-pixel-mono text-xl leading-tight text-ink">
              {data.birthDate ? new Date(data.birthDate).getFullYear() : '—'}
              {' · '}
              {data.sex === 'MALE'
                ? 'Hombre'
                : data.sex === 'FEMALE'
                  ? 'Mujer'
                  : '—'}
            </dd>
          </div>
          <div>
            <dt className="font-pixel text-[10px] tracking-widest text-ink-faint">
              CUERPO
            </dt>
            <dd className="mt-2 font-pixel-mono text-xl leading-tight text-ink">
              {data.weight || '—'} kg · {data.height || '—'} cm
            </dd>
          </div>
          <div>
            <dt className="font-pixel text-[10px] tracking-widest text-ink-faint">
              ACTIVIDAD
            </dt>
            <dd className="mt-2 font-pixel-mono text-xl leading-tight text-ink">
              {data.activityLevel ? ACTIVITY_LABEL[data.activityLevel] : '—'}
            </dd>
          </div>
          <div>
            <dt className="font-pixel text-[10px] tracking-widest text-ink-faint">
              EXPERIENCIA
            </dt>
            <dd className="mt-2 font-pixel-mono text-xl leading-tight text-ink">
              {data.experienceLevel
                ? EXPERIENCE_LABEL[data.experienceLevel]
                : '—'}
            </dd>
          </div>
          <div>
            <dt className="font-pixel text-[10px] tracking-widest text-ink-faint">
              FRECUENCIA
            </dt>
            <dd className="mt-2 font-pixel-mono text-xl leading-tight text-ink">
              {data.daysPerWeek ? `${data.daysPerWeek} dias/semana` : '—'}
            </dd>
          </div>
          <div>
            <dt className="font-pixel text-[10px] tracking-widest text-ink-faint">
              EQUIPAMIENTO
            </dt>
            <dd className="mt-2 font-pixel-mono text-xl leading-tight text-ink">
              {equipText}
            </dd>
          </div>
          {/* OBJETIVOS spans both columns — the value is a comma list
              that grows with goals selected. Divider above visually
              separates "what you want" from the body/training metadata. */}
          <div className="sm:col-span-2 mt-2 pt-5 border-t-2 border-border-muted">
            <dt className="font-pixel text-[10px] tracking-widest text-ink-faint">
              OBJETIVOS
            </dt>
            <dd className="mt-2 font-pixel-mono text-xl leading-tight text-ink">
              {goalsText}
            </dd>
          </div>
          {otherInjurySelected && injuryNotes !== '' && (
            <div className="sm:col-span-2">
              <dt className="font-pixel text-[10px] tracking-widest text-ink-faint">
                OTRA LESION
              </dt>
              <dd className="mt-2 font-pixel-mono text-xl leading-tight text-ink">
                {injuryNotes}
              </dd>
            </div>
          )}
        </dl>
      </section>

      <p className="text-center font-pixel-mono text-lg leading-snug text-ink-muted">
        Pulsa <span className="text-green-400">EMPEZAR</span> para entrar al
        juego. Tu primera clase la elegiras tras unos entrenos.
      </p>
    </motion.div>
  );
};
