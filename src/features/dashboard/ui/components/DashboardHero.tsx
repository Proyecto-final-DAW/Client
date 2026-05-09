import {
  ShieldCheckIcon,
  StarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import { motion, useReducedMotion } from 'framer-motion';

import { PixelCorners } from '@shared/components/PixelCorners';
import type { CharacterState } from '../../../character/core/domain/models/CharacterState';
import {
  rankLetterFromTier,
  tierIndexFromState,
} from '../../../character/core/domain/models/RankLabels';

interface DashboardHeroProps {
  name: string;
  profileImage: string | null | undefined;
  characterState: CharacterState | null;
}

const toTitleCase = (raw: string): string =>
  raw.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase());

/**
 * Returns the *real* class label, or null when the user is still
 * pre-vocation (Tier 0). Mirrors `realClassFromState` in
 * ProfileHeroBanner so both screens read consistently — the previous
 * fallback to `state.novice.name` ("ESCUDERO") contradicted the design
 * rule "no class until you pick one" that /perfil already follows, so
 * a brand-new user saw `CLASE: ESCUDERO` here and `CLASE: —` there.
 */
const classNameOf = (state: CharacterState): string | null => {
  if (state.isMaestroSupremo) return 'Maestro Supremo';
  if (state.legendary && state.legendaryStage === 'TRANSCENDENT')
    return state.legendary.transcendentName;
  if (state.legendary) return state.legendary.name;
  if (state.specialization) return state.specialization.name;
  if (state.vocation) return state.vocation.name;
  return null;
};

const fraseOf = (state: CharacterState): string => {
  if (state.isMaestroSupremo) return 'Has ascendido mas alla de todo limite.';
  if (state.legendary && state.legendaryStage === 'TRANSCENDENT')
    return state.legendary.transcendentFrase;
  if (state.legendary) return state.legendary.frase;
  if (state.specialization) return state.specialization.frase;
  if (state.vocation) return state.vocation.frase;
  return state.novice.frase;
};

/**
 * Short forward-looking hint per tier — fills the dead space below
 * the frase and gives the user something to chase. Each line names
 * the *next* milestone, so the card always points the player at the
 * very next thing they can earn.
 */
const TIER_HINTS: Record<number, string> = {
  0: 'Sigue entrenando. Pronto elegiras tu primera vocacion.',
  1: 'Forja tu camino: una especializacion te espera.',
  2: 'El sendero legendario esta cerca.',
  3: 'Acercandote a la trascendencia.',
  4: 'Un paso del maestro supremo.',
  5: 'Eres maestro. Solo queda la leyenda.',
  6: '◆ Eres leyenda.',
};

/**
 * Dashboard hero card — identity-only.
 *
 * A substantial card (not a slim strip) carrying the character's
 * presence: large avatar with halo, name as protagonist, class +
 * tier subline, and the class frase as an italic quote that gives
 * the page personality. Stats, streak and CTA each live in their own
 * sibling cards below — splitting was the right call (each card has
 * one job), but the previous "identity strip" was so slim that the
 * card itself read as empty. Filling it with the frase + breathing
 * room around the avatar is what makes it feel like a hero panel.
 */
export const DashboardHero = (
  props: DashboardHeroProps
): React.JSX.Element => {
  const prefersReducedMotion = useReducedMotion();
  const motionProps = prefersReducedMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
      };

  const titleName = toTitleCase(props.name);
  const heroLevel = props.characterState?.heroLevel ?? null;
  const charClass = props.characterState
    ? classNameOf(props.characterState)
    : null;
  const frase = props.characterState ? fraseOf(props.characterState) : null;
  const tierIndex = props.characterState
    ? tierIndexFromState(props.characterState)
    : 0;
  const rankLetter = rankLetterFromTier(tierIndex);

  return (
    <motion.section
      {...motionProps}
      className="relative overflow-hidden border-2 border-green-500/60 bg-card shadow-[0_0_0_4px_rgba(10,10,15,0.85),0_0_60px_rgba(34,197,94,0.35)]"
    >
      <PixelCorners size="md" className="border-green-500/60" />

      {/* Soft horizontal halo — places the avatar in a "spotlight"
          rather than against a flat black panel. Decorative-only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left_center,rgba(34,197,94,0.22)_0%,rgba(34,197,94,0.04)_45%,transparent_70%)]"
      />

      <div className="relative flex flex-col items-center gap-5 px-5 py-6 sm:flex-row sm:items-center sm:gap-7 sm:px-10 sm:py-8 lg:px-12">
        {/* Avatar — sized so the card has actual presence; the LVL
            badge anchors to the bottom-centre so it travels with the
            avatar and reads like a class card. */}
        <div className="relative shrink-0">
          <div
            aria-hidden="true"
            className="absolute inset-0 -m-4 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.4)_0%,transparent_70%)] blur-md"
          />
          <div className="relative">
            <div className="absolute inset-0 -m-1.5 border-2 border-green-500/50 [clip-path:polygon(0_10px,10px_0,calc(100%-10px)_0,100%_10px,100%_calc(100%-10px),calc(100%-10px)_100%,10px_100%,0_calc(100%-10px))] pointer-events-none" />
            {props.profileImage ? (
              <img
                src={props.profileImage}
                alt={`Avatar de ${props.name}`}
                className="h-36 w-36 sm:h-44 sm:w-44 border-2 border-border object-cover shadow-[0_0_30px_rgba(34,197,94,0.5)]"
              />
            ) : (
              <div className="flex h-36 w-36 sm:h-44 sm:w-44 items-center justify-center border-2 border-border bg-green-500/10 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                <UserCircleIcon className="h-20 w-20 sm:h-24 sm:w-24 text-green-400" />
              </div>
            )}
            {heroLevel !== null && (
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center justify-center border-2 border-green-700 bg-green-500 px-3 py-1 font-pixel text-[10px] sm:text-xs tracking-widest text-[#0a0a0f] shadow-[0_0_14px_rgba(34,197,94,0.85)] whitespace-nowrap">
                LVL {heroLevel}
              </span>
            )}
          </div>
        </div>

        {/* Identity column — character-sheet "cartilla" layout. The
            previous "HOLA, PEDRO" greeting + class subline read as a
            welcome screen; this lays the same data out as labelled
            fields (NOMBRE / CLASE / RANGO) like an RPG status menu.
            `lg:pl-6` nudges the cartilla rightward to compensate for
            the avatar's halo glow overflowing its flex box — without
            it the block reads as left-biased even though the dl is
            geometrically centered. */}
        <div className="min-w-0 flex-1 lg:pl-6">
          {/* Cartilla — clean label / value rows. `mx-auto` centers
              the block in the middle column; max-w-md (448px,
              up from 384) makes the cartilla wider so it occupies
              more of the column visually and stops reading as
              left-biased — the avatar's halo + LVL badge weighed
              the left side enough that a smaller cartilla looked
              shoved to the side. */}
          <dl className="mx-auto w-full max-w-md space-y-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <dt className="flex items-center gap-2 w-24 sm:w-28 shrink-0 font-pixel text-[10px] sm:text-[11px] tracking-widest text-green-500/70">
                <UserCircleIcon className="h-3.5 w-3.5 text-green-500/80" />
                NOMBRE
              </dt>
              <dd className="font-pixel text-xs sm:text-sm text-green-400 [text-shadow:0_0_10px_rgba(34,197,94,0.4)] break-words">
                {titleName.toUpperCase()}
              </dd>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <dt className="flex items-center gap-2 w-24 sm:w-28 shrink-0 font-pixel text-[10px] sm:text-[11px] tracking-widest text-green-500/70">
                <ShieldCheckIcon className="h-3.5 w-3.5 text-green-500/80" />
                CLASE
              </dt>
              <dd className="font-pixel text-xs sm:text-sm text-ink">
                {(charClass ?? '—').toUpperCase()}
              </dd>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <dt className="flex items-center gap-2 w-24 sm:w-28 shrink-0 font-pixel text-[10px] sm:text-[11px] tracking-widest text-green-500/70">
                <StarIcon className="h-3.5 w-3.5 text-green-500/80" />
                RANGO
              </dt>
              <dd className="font-pixel text-xs sm:text-sm text-yellow-400">
                {rankLetter}
              </dd>
            </div>
          </dl>

          {/* Frase — the lore line, the thing that makes the user
              *want to stay*. Italic VT323 contrasts the pixel display
              type so the quote reads as voice, not interface. Extra
              top margin separates it from the data rows so it reads
              as character voice, not yet another field. */}
          {frase && (
            <p className="mt-5 max-w-xl font-pixel-mono text-base sm:text-lg italic leading-snug text-ink/90 [text-shadow:0_0_10px_rgba(34,197,94,0.18)]">
              “{frase}”
            </p>
          )}
        </div>

        {/* PROXIMO panel — its own framed mini-card on the right.
            `self-stretch` matches the row height; `justify-center`
            centers the eyebrow+body vertically inside, so the panel
            no longer reads as "left-aligned text floating in empty
            space". `lg:w-60` is slightly narrower than the previous
            w-64 to feel less blocky next to the rich left column. */}
        <aside className="hidden lg:flex lg:w-60 shrink-0 self-stretch flex-col justify-center gap-2 border-2 border-green-500/30 bg-page/40 p-4">
          <p className="font-pixel text-[9px] tracking-[0.18em] text-green-500/80">
            ▶ PROXIMO
          </p>
          <p className="font-pixel-mono text-base lg:text-lg leading-snug text-ink-muted">
            {TIER_HINTS[tierIndex]}
          </p>
        </aside>
      </div>

      {/* Mobile / sm fallback — inline hint at the bottom of the card
          when the right-side aside is hidden. Keeps the "you have a
          next step" signal on every viewport. */}
      <div className="relative px-5 pb-5 sm:px-10 sm:pb-6 lg:hidden">
        <div className="border-t border-green-500/20 pt-3 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
          <span className="font-pixel text-[8px] sm:text-[9px] tracking-[0.18em] text-green-500/80">
            ▶ PROXIMO
          </span>
          <span className="font-pixel-mono text-base sm:text-lg leading-snug text-ink-muted">
            {TIER_HINTS[tierIndex]}
          </span>
        </div>
      </div>
    </motion.section>
  );
};
