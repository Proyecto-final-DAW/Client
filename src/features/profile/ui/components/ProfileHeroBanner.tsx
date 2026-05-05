import { UserCircleIcon } from '@heroicons/react/24/solid';
import { motion, useReducedMotion } from 'framer-motion';

import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type { CharacterState } from '../../../character/core/domain/models/CharacterState';

interface ProfileHeroBannerProps {
  name: string;
  profileImage: string | null | undefined;
  characterState: CharacterState | null;
}

// Title-case a free-form name so the banner renders "Antonio" regardless
// of whether the user typed it as "antonio", "Antonio", or "ANTONIO" during
// onboarding. Multi-word names ("ana maria") become "Ana Maria".
const toTitleCase = (raw: string): string =>
  raw.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase());

const displayClass = (
  state: CharacterState
): { name: string; frase: string } => {
  if (state.isMaestroSupremo) {
    return { name: 'Maestro Supremo', frase: '' };
  }
  if (state.legendary && state.legendaryStage === 'TRANSCENDENT') {
    return {
      name: state.legendary.transcendentName.toUpperCase(),
      frase: state.legendary.transcendentFrase,
    };
  }
  if (state.legendary) {
    return {
      name: state.legendary.name.toUpperCase(),
      frase: state.legendary.frase,
    };
  }
  if (state.specialization) {
    return {
      name: state.specialization.name.toUpperCase(),
      frase: state.specialization.frase,
    };
  }
  if (state.vocation) {
    return {
      name: state.vocation.name.toUpperCase(),
      frase: state.vocation.frase,
    };
  }
  return { name: state.novice.name.toUpperCase(), frase: state.novice.frase };
};

const TIER_LABELS = [
  'INICIADO',
  'VOCACION',
  'ESPECIALISTA',
  'LEGENDARIO',
  'TRASCENDENTE',
  'MAESTRO',
  'LEYENDA',
] as const;

const TIER_HINTS: Record<number, string> = {
  0: 'Entrena. Pronto elegirás tu primera clase.',
  1: 'Sigue forjando: tu especialización te espera.',
  2: 'El camino legendario está más cerca.',
  3: 'Acercándote a la trascendencia.',
  4: 'Un paso del maestro supremo.',
  5: 'Eres maestro. Solo queda la leyenda.',
  6: '◆ Eres leyenda.',
};

const tierIndexFromState = (state: CharacterState): number => {
  if (state.isMaestroSupremo && state.isLeyenda) return 6;
  if (state.isMaestroSupremo) return 5;
  if (state.legendaryStage === 'TRANSCENDENT') return 4;
  if (state.legendary) return 3;
  if (state.specialization) return 2;
  if (state.vocation) return 1;
  return 0;
};

/**
 * Identity + class-progression banner. Lives both on the dashboard and on
 * /perfil. Layout:
 *   - Identity row: avatar (with LVL badge) + rank pill + name + class.
 *   - Hint footer: one-line "what's next" so the RPG ladder is implicit.
 *
 * Without character data the banner collapses cleanly: just rank pill
 * (defaults to INICIADO) + real name + the tier-0 hint. No duplicated
 * lines, no empty zones.
 */
export const ProfileHeroBanner = ({
  name,
  profileImage,
  characterState,
}: ProfileHeroBannerProps): React.JSX.Element => {
  const prefersReducedMotion = useReducedMotion();

  const motionProps = prefersReducedMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
      };

  const display = characterState ? displayClass(characterState) : null;
  const heroLevel = characterState?.heroLevel ?? null;
  const tierIndex = characterState ? tierIndexFromState(characterState) : 0;
  const rankLabel = TIER_LABELS[tierIndex];
  const hint = TIER_HINTS[tierIndex];
  const titleName = toTitleCase(name);

  return (
    <motion.section
      {...motionProps}
      className="relative border-2 border-green-500/60 bg-card px-4 py-3 sm:px-5 sm:py-4 shadow-[0_0_0_4px_rgba(10,10,15,0.8),0_0_40px_rgba(34,197,94,0.2)]"
    >
      <PixelCorners size="md" className="border-green-500/60" />

      {/* Identity row */}
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <div className="absolute inset-0 -m-1 border-2 border-green-500/40 [clip-path:polygon(0_8px,8px_0,calc(100%-8px)_0,100%_8px,100%_calc(100%-8px),calc(100%-8px)_100%,8px_100%,0_calc(100%-8px))] pointer-events-none" />
          {profileImage ? (
            <img
              src={profileImage}
              alt={`Avatar de ${name}`}
              className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-border object-cover shadow-[0_0_18px_rgba(34,197,94,0.3)]"
            />
          ) : (
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center border-2 border-border bg-green-500/10 shadow-[0_0_18px_rgba(34,197,94,0.3)]">
              <UserCircleIcon className="h-9 w-9 sm:h-11 sm:w-11 text-green-400" />
            </div>
          )}
          {heroLevel !== null && (
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center justify-center border-2 border-green-700 bg-green-500 px-1.5 py-0.5 font-pixel text-[8px] tracking-widest text-[#0a0a0f] shadow-[0_0_10px_rgba(34,197,94,0.6)]">
              LVL {heroLevel}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {/* Rank pill — first visual signal that the user has a rank, even
              before reading the name. Defaults to INICIADO when no
              character data has loaded. */}
          <span className="inline-flex items-center gap-1 border border-green-500/50 bg-green-500/10 px-2 py-0.5 font-pixel text-[8px] tracking-widest text-green-400 [text-shadow:0_0_8px_rgba(34,197,94,0.4)]">
            ◆ {rankLabel}
          </span>
          {/* Name layout differs by state:
              - With class: h2 = class name, sub-line = real name.
              - Without class: h2 = real name, no sub-line. The previous
                version duplicated the real name on both lines when no
                class existed. */}
          <h2 className="mt-1.5 font-pixel text-sm sm:text-base leading-tight text-green-400 [text-shadow:2px_2px_0_#000,0_0_12px_rgba(34,197,94,0.4)] break-words">
            {display ? display.name : titleName}
          </h2>
          {display && (
            <p className="mt-1 font-pixel-mono text-base leading-tight text-ink-muted">
              {titleName}
              {display.frase && (
                <span className="hidden sm:inline italic text-ink-faint">
                  {' · '}“{display.frase}”
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Single-line hint footer. The RPG ladder is implicit in the rank
          pill above; spelling out 7 dots was more visual noise than
          information at this size. */}
      <p className="mt-3 pt-3 border-t-2 border-border font-pixel-mono text-base leading-tight text-ink-muted">
        {hint}
      </p>
    </motion.section>
  );
};
