import {
  ShieldCheckIcon,
  StarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import { PixelCorners } from '@shared/components/PixelCorners';
import { motion, useReducedMotion } from 'framer-motion';

import type { CharacterState } from '../../../character/core/domain/models/CharacterState';
import {
  RANK_LETTERS,
  styleForRank,
  tierIndexFromState,
} from '../../../character/core/domain/models/RankLabels';

interface ProfileHeroBannerProps {
  name: string;
  profileImage: string | null | undefined;
  characterState: CharacterState | null;
}

const toTitleCase = (raw: string): string =>
  raw.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase());

/**
 * Returns the *real* class the user has earned (vocation or higher)
 * with its frase, or null when they haven't picked one yet. Pre-vocation
 * users (rank F) used to surface the novice placeholder ("ESCUDERO"),
 * but the design intent is "you don't have a class until you pick one"
 * — so we return null and consumers render "—" or hide the field.
 * The novice frase (e.g. "Todo heroe empezo siendo nadie.") is still
 * useful as flavour text and is exposed via `noviceFrase` separately.
 */
const realClassFromState = (
  state: CharacterState
): { name: string; frase: string } | null => {
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
  return null;
};

// Letter rank labels (F→S, arcade-style). Single source of truth in
// `RankLabels.ts`; both this banner and the dashboard hero card read
// from there so a future rename only touches one place.
const TIER_LABELS = RANK_LETTERS;

const TIER_HINTS: Record<number, string> = {
  0: 'Entrena. Pronto elegiras tu primera clase.',
  1: 'Sigue forjando: tu especializacion te espera.',
  2: 'El camino legendario esta mas cerca.',
  3: 'Acercandote a la trascendencia.',
  4: 'Un paso del maestro supremo.',
  5: 'Eres maestro. Solo queda la leyenda.',
  6: 'Eres leyenda.',
};

/**
 * 7-rank visual ladder F→S. Mirrors the OriginStoryIntro popup tile
 * style (letter inside a square, → arrows between, current rank with
 * pulsing green glow, top rank S in gold). Replaced the previous
 * checkbox-row layout because that read as form chrome — the rank
 * ladder should feel like the in-game UI, not a settings page.
 *
 * Reached tiers stay lit (solid green), the current tier pulses, and
 * future tiers fade to a dim green; S keeps its gold treatment in all
 * states because the "leyenda" colour identifies the meta target
 * regardless of how close the player is.
 */
const RankLadder = ({
  tierIndex,
}: {
  tierIndex: number;
}): React.JSX.Element => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className="flex items-center justify-center gap-0.5 sm:gap-1.5">
      {TIER_LABELS.map((letter, i) => {
        const isCurrent = i === tierIndex;
        const isReached = i < tierIndex;
        const palette = styleForRank(letter);

        // Per-rank colour styling via inline `style` (not Tailwind
        // classes) so we can vary opacity for reached/current/future
        // states with `color-mix` — Tailwind's JIT can't see classes
        // built from runtime concat, so the previous template-string
        // approach silently produced missing styles. Hex/rgba lets us
        // dim each rank's own colour cleanly.
        let tileStyle: React.CSSProperties = {};
        if (isCurrent) {
          tileStyle = {
            color: palette.text,
            borderColor: palette.border,
            backgroundColor: `color-mix(in srgb, ${palette.bg} 28%, transparent)`,
          };
        } else if (isReached) {
          tileStyle = {
            color: `color-mix(in srgb, ${palette.text} 70%, transparent)`,
            borderColor: `color-mix(in srgb, ${palette.border} 55%, transparent)`,
            backgroundColor: `color-mix(in srgb, ${palette.bg} 12%, transparent)`,
          };
        } else {
          // Future rank — keep its hue but heavily desaturated so the
          // ladder still hints at the progression target while reading
          // as "not there yet".
          tileStyle = {
            color: `color-mix(in srgb, ${palette.text} 30%, transparent)`,
            borderColor: `color-mix(in srgb, ${palette.border} 25%, transparent)`,
            backgroundColor: `color-mix(in srgb, ${palette.bg} 5%, transparent)`,
          };
        }

        return (
          <div
            key={letter}
            className="flex items-center gap-0.5"
            aria-label={`Rango ${letter}${
              isCurrent ? ' (actual)' : isReached ? ' (alcanzado)' : ''
            }`}
          >
            {i > 0 && (
              <span
                aria-hidden="true"
                className="font-pixel text-[10px] text-green-500/40"
              >
                →
              </span>
            )}
            <motion.div
              animate={
                isCurrent && !prefersReducedMotion
                  ? {
                      boxShadow: [
                        `0 0 10px ${palette.glow}`,
                        `0 0 22px ${palette.glow}`,
                        `0 0 10px ${palette.glow}`,
                      ],
                    }
                  : undefined
              }
              transition={
                isCurrent && !prefersReducedMotion
                  ? {
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
                  : undefined
              }
              style={tileStyle}
              // Tiles bumped from h-8 w-6 → h-9 w-7 so the letter
              // sits with a touch more breathing room on each side
              // and doesn't read as cramped. Press Start 2P's
              // glyphs include a ~2-px ascender padding inside the
              // line box that `leading-none` alone doesn't strip,
              // so the letter optically floats above centre. The
              // `pt-[2px]` nudge brings F-E-D-C-B-A-S into the
              // visual middle of each tile. 7 × 28px tiles + 6 ×
              // ~10px arrows still fit comfortably inside the lg
              // sidebar column.
              className="flex h-9 w-7 items-center justify-center pt-[2px] border-2 font-pixel text-sm leading-none"
            >
              {letter}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Identity + class-progression banner. Lives on the dashboard (as the
 * protagonist of the fold) and on /perfil. The class name is the largest
 * thing in the panel — bigger than the user's real name — because the
 * RPG identity is what the app sells. The 7-dot rank ladder makes the
 * full T0→T6 journey legible at a glance.
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

  const realClass = characterState ? realClassFromState(characterState) : null;
  const heroLevel = characterState?.heroLevel ?? null;
  const tierIndex = characterState ? tierIndexFromState(characterState) : 0;
  const rankLabel = TIER_LABELS[tierIndex];
  const hint = TIER_HINTS[tierIndex];
  const titleName = toTitleCase(name);
  const noviceFrase = characterState?.novice.frase ?? '';

  /**
   * Length-based font size for NOMBRE / CLASE values so they always
   * fit on a single line without measuring the DOM. Press Start 2P
   * is monospace, so width scales linearly with character count —
   * `len <= 8` keeps the default look; longer names step down in
   * size instead of clipping with `…`. Numbers tuned against the
   * column width on the left aside (~190px usable for the value).
   */
  const valueFontClass = (text: string): string => {
    const len = text.length;
    if (len <= 8) return 'text-xs sm:text-sm';
    if (len <= 11) return 'text-[11px] sm:text-xs';
    if (len <= 14) return 'text-[10px] sm:text-[11px]';
    return 'text-[9px] sm:text-[10px]';
  };
  // Name renders in title-case ("Blue") because uppercase ("BLUE") on
  // a Press Start 2P column read as a header label and clashed with
  // the all-caps NOMBRE/CLASE/RANGO eyebrows next to it. Class stays
  // uppercase — RPG class names are a label style, not a personal
  // identifier.
  const nameDisplay = titleName;
  const classUpper = realClass ? realClass.name.toUpperCase() : '—';
  // Falls back to the novice frase pre-vocation so the lore line is
  // still visible at rank F — the user has no class yet but they do
  // have a story.
  const frase = realClass?.frase || noviceFrase;

  return (
    <motion.section
      {...motionProps}
      className="relative border-2 border-green-500/60 bg-card px-5 py-5 sm:px-7 sm:py-6 shadow-[0_0_0_4px_rgba(10,10,15,0.8),0_0_50px_rgba(34,197,94,0.28)]"
    >
      <PixelCorners size="md" className="border-green-500/60" />

      {/* Identity block — avatar centred on top, cartilla underneath
          at full width. The earlier side-by-side layout fought the
          left aside's narrow column (~256px in the lg grid): the
          avatar took 80-96px + gap, leaving ~150px for the data,
          which was less than "Carlo Magno" needed at any readable
          font size and forced the name to wrap. Stacking gives the
          cartilla the entire banner width so any name up to ~20
          characters fits on one line. The LVL badge stays pinned
          below the avatar; the dl below it is centred and wide. */}
      <div className="flex flex-col items-center gap-6 sm:gap-7">
        <div className="relative shrink-0">
          <div className="absolute inset-0 -m-1 border-2 border-green-500/40 [clip-path:polygon(0_8px,8px_0,calc(100%-8px)_0,100%_8px,100%_calc(100%-8px),calc(100%-8px)_100%,8px_100%,0_calc(100%-8px))] pointer-events-none" />
          {profileImage ? (
            <img
              src={profileImage}
              alt={`Avatar de ${name}`}
              className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-border object-cover shadow-[0_0_20px_rgba(34,197,94,0.35)]"
            />
          ) : (
            <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center border-2 border-border bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.35)]">
              <UserCircleIcon className="h-11 w-11 sm:h-14 sm:w-14 text-green-400" />
            </div>
          )}
          {heroLevel !== null && (
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center justify-center border-2 border-green-700 bg-green-500 px-2.5 py-0.5 font-pixel text-[10px] tracking-widest text-[#0a0a0f] shadow-[0_0_12px_rgba(34,197,94,0.7)] whitespace-nowrap">
              LVL {heroLevel}
            </span>
          )}
        </div>

        <div className="min-w-0 w-full">
          {/* CSS grid with `auto 1fr` columns: the label column sizes
              to fit "NOMBRE" / "CLASE" / "RANGO" + their icons (no
              hard-coded width to overflow), and the value column
              takes whatever's left. `gap-x-4` puts a guaranteed 16
              px between label and value so "NOMBREBlue" can't paint
              as one word, and `valueFontClass` already steps a long
              name down to fit the remaining space. Stays a 3-row
              layout instead of stacking — keeps the cartilla short
              enough that the avatar's height matches the data
              column. */}
          {/* `items-center` (not items-baseline) so the small icon
              + 10-px label on the left share a vertical centre with
              the larger value on the right. With baseline alignment
              the labels' shorter line-box made the icons sit
              visually above the value's mid-line, which read as
              "icons floating high". */}
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 sm:gap-y-4 items-center">
            <dt className="flex items-center gap-1.5 font-pixel text-[9px] sm:text-[10px] tracking-widest text-green-500/70">
              <UserCircleIcon className="h-3.5 w-3.5 text-green-500/80" />
              NOMBRE
            </dt>
            <dd
              title={nameDisplay}
              // No `truncate` — the user's name has to render in
              // full ("Carlo Magno" can't disappear behind an
              // ellipsis just because it's 11 chars). break-words +
              // wrapping lets a long name flow onto a second line
              // instead of getting clipped; valueFontClass already
              // steps the size down so most names fit on one line.
              className={`min-w-0 break-words font-pixel ${valueFontClass(nameDisplay)} text-green-400 [text-shadow:0_0_10px_rgba(34,197,94,0.45)] leading-snug`}
            >
              {nameDisplay}
            </dd>

            <dt className="flex items-center gap-1.5 font-pixel text-[9px] sm:text-[10px] tracking-widest text-green-500/70">
              <ShieldCheckIcon className="h-3.5 w-3.5 text-green-500/80" />
              CLASE
            </dt>
            <dd
              title={classUpper}
              className={`min-w-0 truncate font-pixel ${valueFontClass(classUpper)} text-ink leading-snug`}
            >
              {classUpper}
            </dd>

            <dt className="flex items-center gap-1.5 font-pixel text-[9px] sm:text-[10px] tracking-widest text-green-500/70">
              <StarIcon className="h-3.5 w-3.5 text-green-500/80" />
              RANGO
            </dt>
            <dd
              className="font-pixel text-sm sm:text-base"
              style={{ color: styleForRank(rankLabel).text }}
            >
              {rankLabel}
            </dd>
          </dl>
        </div>
      </div>

      {/* Frase — always visible, on its own line. The previous version
          hid it on mobile and inlined it after the name on desktop, so
          most users never saw the lore line. Now it gets the breathing
          room it needs. */}
      {frase && (
        <p className="mt-4 font-pixel-mono text-base italic leading-snug text-ink [text-shadow:0_0_10px_rgba(34,197,94,0.15)]">
          “{frase}”
        </p>
      )}

      {/* Rank ladder — the 7-tier journey at a glance. */}
      <div className="mt-5 pt-5 border-t-2 border-border">
        <p className="mb-3 font-pixel text-[9px] sm:text-[10px] tracking-widest text-green-500">
          PROGRESO DEL HEROE
        </p>
        <RankLadder tierIndex={tierIndex} />
        <p className="mt-4 font-pixel-mono text-base sm:text-lg leading-snug text-ink-muted">
          {hint}
        </p>
      </div>
    </motion.section>
  );
};
