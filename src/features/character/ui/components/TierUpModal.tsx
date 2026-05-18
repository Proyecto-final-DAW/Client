import { statConfigFor } from '@features/stats/ui/StatConfig';
import { PixelCorners } from '@shared/components/PixelCorners';
import { useBodyScrollLock } from '@shared/hooks/useBodyScrollLock';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import type {
  PendingChoice,
  PendingChoiceTier,
} from '../../core/domain/models/CharacterState';
import { ClassChoiceCard } from './ClassChoiceCard';

type Props = {
  open: boolean;
  pendingChoice: PendingChoice;
  choosing: boolean;
  /** Surfaced by the parent when `onConfirm` rejects (network blip,
   *  server validation, etc.). Without showing it inline the modal
   *  silently re-enabled itself and the user had no idea why their
   *  click did nothing. */
  error?: string | null;
  onConfirm: (classId: string) => void | Promise<void>;
  onClose: () => void;
};

const TIER_TITLE: Record<PendingChoiceTier, string> = {
  1: 'ELIGE TU VOCACION',
  2: 'ELIGE TU ESPECIALIZACION',
  3: 'ELIGE TU LEGENDARIA',
};

const TIER_FLAVOR: Record<PendingChoiceTier, string> = {
  1: 'Tu disciplina ha hablado por si sola. Es momento de nombrarla.',
  2: 'Has cruzado el umbral. Tu camino se bifurca.',
  3: 'Has alcanzado lo que pocos alcanzan. Elige como seras recordado.',
};

/**
 * Rank letter the user crosses INTO after confirming the choice at this
 * tier. The previous eyebrow on tier 3 said "EL CAMINO A RANGO S",
 * which was misleading: the choice itself only takes you to rank C
 * (the legendary's NORMAL stage); S is reached later, automatically,
 * once every stat hits 99. Showing the literal rank the user is about
 * to claim ("RANGO E / D / C") removes the confusion the user flagged.
 */
const TIER_RANK_LETTER: Record<PendingChoiceTier, 'E' | 'D' | 'C'> = {
  1: 'E',
  2: 'D',
  3: 'C',
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface CardMeta {
  id: string;
  name: string;
  frase: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  accent?: string;
  statLine?: string;
}

/**
 * Picks a representative stat per option so each card can show a
 * matching pixel-art icon and a "STAT DOMINANTE: …" subtitle. The
 * stat differs by tier:
 *   - T1 vocation    → `dominantStat`
 *   - T2 spec        → `secondaryStat` (the one the spec leans into,
 *                       on top of the lineage's dominant)
 *   - T3 legendary   → first entry of `requiredStats` (the headline
 *                       requirement; rest read in the spec sheet)
 *
 * Uses `statConfigFor` so the server `endurance` ↔ client `resistance`
 * bridge stays in one place (StatConfig.tsx).
 */
const optionMeta = (pendingChoice: PendingChoice): CardMeta[] => {
  if (pendingChoice.tier === 1) {
    return pendingChoice.options.map((option) => {
      const config = statConfigFor(option.dominantStat);
      return {
        id: option.id,
        name: option.name,
        frase: option.frase,
        icon: config?.icon,
        accent: config?.accentColor,
        statLine: config
          ? `STAT DOMINANTE: ${config.name.toUpperCase()}`
          : undefined,
      };
    });
  }
  if (pendingChoice.tier === 2) {
    return pendingChoice.options.map((option) => {
      const config = statConfigFor(option.secondaryStat);
      return {
        id: option.id,
        name: option.name,
        frase: option.frase,
        icon: config?.icon,
        accent: config?.accentColor,
        statLine: config ? `REFUERZA: ${config.name.toUpperCase()}` : undefined,
      };
    });
  }
  return pendingChoice.options.map((option) => {
    const headline = option.requiredStats[0];
    const config = headline ? statConfigFor(headline) : undefined;
    return {
      id: option.id,
      name: option.name,
      frase: option.frase,
      icon: config?.icon,
      accent: config?.accentColor,
      statLine: config ? `EXIGE: ${config.name.toUpperCase()}` : undefined,
    };
  });
};

export const TierUpModal = ({
  open,
  pendingChoice,
  choosing,
  error,
  onConfirm,
  onClose,
}: Props): React.JSX.Element => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const tier = pendingChoice.tier;
  const recommendedId = pendingChoice.recommendedId;
  const cards = optionMeta(pendingChoice);
  const selectedCard = cards.find((c) => c.id === selectedId);

  // Lock the page behind the modal so the dashboard's own scrollbar
  // doesn't stack next to the dialog's internal scroll. Without this
  // the user saw two parallel scrollbars (one for the page, one for
  // the modal's overflow-y-auto) when the dialog content overflowed.
  useBodyScrollLock(open);

  // Reset selection whenever the tier-up offer changes (so dismissing
  // one tier and receiving the next doesn't carry over a stale pick).
  useEffect(() => {
    setSelectedId(null);
  }, [tier, recommendedId]);

  useEffect(() => {
    if (!open) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    // Focus the heading rather than the cancel button. The previous
    // pattern made pressing Enter the moment the modal opened
    // dismiss the celebration immediately — hostile for a tier-up
    // screen the user just *earned*. Heading has tabIndex=-1 so it
    // can receive programmatic focus without entering the tab order.
    headingRef.current?.focus();
    return () => {
      const target = previouslyFocusedRef.current;
      // Trigger element may have unmounted (e.g. dashboard re-render
      // hid the CTA that opened the modal). Falls back to body if
      // the previous element is gone.
      if (target && document.contains(target)) {
        target.focus();
      } else {
        document.body.focus();
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !choosing) {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusables =
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, choosing, onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (choosing) return;
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (!selectedId) return;
    await onConfirm(selectedId);
  };

  // Tier 3 (LEGENDARIA) is the climax of the class arc — the user
  // unlocks it once and the next auto-tiers (TRANSCENDENT → SUPREMO →
  // LEYENDA / S-rank) cascade silently. So the modal at this tier
  // gets the gold-leaf treatment: warm amber palette, larger glow,
  // longer entrance, and a slow rotating aura ring behind the card.
  // Tiers 1 and 2 stay on the green palette so the visual hierarchy
  // matches the lore weight.
  const isLegendary = tier === 3;
  const accentRgb = isLegendary ? '251,191,36' : '34,197,94'; // amber-400 / green-500
  const accentHex = isLegendary ? '#fbbf24' : '#22c55e';
  const accentDeep = isLegendary ? '#b45309' : '#15803d'; // amber-700 / green-700

  const overlayMotion = prefersReducedMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: isLegendary ? 0.45 : 0.25 },
      };

  const dialogMotion = prefersReducedMotion
    ? {
        initial: false,
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: {
          opacity: 0,
          scale: isLegendary ? 0.78 : 0.88,
          y: isLegendary ? 36 : 24,
          filter: isLegendary ? 'blur(8px)' : undefined,
        },
        animate: {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: isLegendary ? 'blur(0px)' : undefined,
        },
        exit: { opacity: 0, scale: 0.95, y: 12 },
        transition: {
          duration: isLegendary ? 0.85 : 0.5,
          ease: [0.22, 1.2, 0.36, 1] as const,
        },
      };

  // Card container stagger — children fade up sequentially so the
  // grid feels assembled rather than dropped in. Reduced-motion users
  // get the final state without animation.
  const gridVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.25 },
    },
  };
  const cardVariants = prefersReducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 16, scale: 0.96 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.42, ease: [0.22, 1.2, 0.36, 1] as const },
        },
      };

  const confirmAccent = selectedCard?.accent;

  // Portal directly to <body> so the modal escapes any parent
  // stacking context (DashboardLayout wraps everything in a
  // `relative` div with sticky header / sidebar). Without the portal,
  // z-[60] is relative to the layout's context — the modal looks like
  // it's "inside" the body strip rather than overlaying everything.
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          {...overlayMotion}
          onMouseDown={handleBackdropClick}
          // Heavier dim + radial accent glow behind the dialog so the
          // modal reads as the only thing on screen — the previous
          // flat 80% black felt like a generic confirm box. The tier-3
          // overlay swaps in an amber gradient (warm + ceremonial)
          // because the legendary unlock is the lore-weighted moment
          // of the arc; tiers 1/2 stay on the green palette to keep
          // the everyday "level up" colour for everyday milestones.
          // Overlay just centres + dims; the dialog itself owns scroll
          // when the content doesn't fit (mobile portrait, 6 stacked
          // vocations). That keeps desktop clean — when the dialog
          // fits in the viewport, no scrollbar at all — while still
          // letting phones scroll through the full card list. The
          // previous "overflow-y-auto on the overlay" version always
          // showed a thin scrollbar in desktop because the radial
          // backdrop + padding nudged the layout 1-2px past viewport
          // height even when the dialog visually fit.
          // Small lateral margin on phone so the dialog's pixel
          // corners and neon halo are fully visible — `p-0` clipped
          // them against the screen edges. From `sm:` we keep the
          // wider frame.
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-2 sm:p-4 overscroll-contain"
          style={{
            // Tight tint that fades to opaque well before the screen
            // edges — only frames the dialog. The earlier wider
            // gradient was the "feo de fondo" the user flagged.
            backgroundImage: isLegendary
              ? 'radial-gradient(circle at center, rgba(251,191,36,0.14) 0%, rgba(0,0,0,0.97) 42%, rgba(0,0,0,1) 70%)'
              : 'radial-gradient(circle at center, rgba(34,197,94,0.08) 0%, rgba(0,0,0,0.96) 40%, rgba(0,0,0,1) 70%)',
          }}
        >
          {/* Stage wrapper — caps width so the dialog's halo stays
              tight to the box. `block` (no flex) so the inner dialog's
              `w-full` always stretches edge-to-edge of the wrapper at
              every viewport — `flex justify-center` was deferring to
              the dialog's intrinsic width on phones where some inner
              text wrapped narrow, which made the modal sit as a thin
              column with black bars to either side. */}
          <div className="relative w-full max-w-4xl">
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="tier-up-title"
              aria-describedby="tier-up-description"
              {...dialogMotion}
              style={{
                borderColor: `rgba(${accentRgb},0.7)`,
                // Tight neon halo + a slim inset highlight. Tier 3
                // (legendary) still gets a brighter outer glow than
                // tiers 1/2 so the lore weight reads, but nowhere near
                // the 160px of the earlier pass.
                boxShadow: isLegendary
                  ? `0 0 0 3px rgba(10,10,15,0.85), 0 0 44px rgba(${accentRgb},0.7), 0 0 14px rgba(${accentRgb},0.4) inset, 0 16px 36px rgba(0,0,0,0.8)`
                  : `0 0 0 3px rgba(10,10,15,0.85), 0 0 30px rgba(${accentRgb},0.5), 0 14px 30px rgba(0,0,0,0.8)`,
                scrollbarColor: `rgba(${accentRgb},0.45) rgba(15,15,20,0.4)`,
              }}
              // Mobile / tablet: clamp height to the viewport (dvh
              // tracks the dynamic viewport so the bottom isn't
              // clipped by the browser chrome) and enable internal
              // scroll. Desktop (lg+): drop the cap entirely so the
              // modal sits at its natural height with no scrollbar —
              // the user explicitly wanted the green scrollbar gone
              // on full-size screens because the dialog already fits.
              className="relative w-full max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] overflow-y-auto lg:max-h-none lg:overflow-visible border-2 bg-card p-3 sm:p-6 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black/40"
            >
              <PixelCorners
                size="lg"
                className={
                  isLegendary ? 'border-amber-400/70' : 'border-green-500/70'
                }
              />

              {/* Compact header — title + a single-line flavour. The
                previous "TIER 1 ALCANZADO" decorative ribbon plus
                horizontal lines added ~80px of vertical chrome that
                pushed the cards off the available body height. The
                tier number is already implicit in the title copy
                ("ELIGE TU VOCACION" = T1), so the ribbon was pure
                decoration. */}
              <header className="mb-4 sm:mb-5 flex flex-col items-center text-center">
                {/* Rank eyebrow — names the rank letter the user is
                  about to claim with this choice. T1 -> E, T2 -> D,
                  T3 -> C. Painted in the modal's accent (amber for the
                  legendary tier, green for the rest) so it carries the
                  same colour weight as the title without competing. */}
                <motion.p
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, scale: 0.85 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.55, delay: 0.05 }}
                  className={`mb-3 font-pixel text-[10px] sm:text-xs tracking-[0.4em] ${
                    isLegendary
                      ? 'text-amber-300 [text-shadow:0_0_18px_rgba(251,191,36,0.65)]'
                      : 'text-green-400 [text-shadow:0_0_14px_rgba(34,197,94,0.55)]'
                  }`}
                >
                  RANGO {TIER_RANK_LETTER[tier]}
                </motion.p>

                <motion.h2
                  ref={headingRef}
                  tabIndex={-1}
                  id="tier-up-title"
                  initial={
                    prefersReducedMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 10,
                          filter: isLegendary ? 'blur(10px)' : 'blur(6px)',
                        }
                  }
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    duration: isLegendary ? 0.75 : 0.5,
                    ease: [0.22, 1.4, 0.36, 1],
                  }}
                  style={{
                    color: isLegendary ? '#fcd34d' : undefined,
                    textShadow: isLegendary
                      ? '0 0 28px rgba(251,191,36,0.85), 0 0 8px rgba(252,211,77,0.6), 2px 2px 0 #000'
                      : undefined,
                  }}
                  className={`font-pixel leading-snug outline-none [text-shadow:0_0_22px_rgba(34,197,94,0.65),2px_2px_0_#000] ${
                    isLegendary
                      ? 'text-xl sm:text-3xl text-amber-300'
                      : 'text-base sm:text-xl text-green-400'
                  }`}
                >
                  {TIER_TITLE[tier]}
                </motion.h2>

                <motion.p
                  id="tier-up-description"
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.18 }}
                  className={`mt-2 max-w-2xl font-pixel-mono text-sm sm:text-base italic leading-snug ${
                    isLegendary ? 'text-amber-100/90' : 'text-ink/90'
                  }`}
                >
                  “{TIER_FLAVOR[tier]}”
                </motion.p>
              </header>

              <motion.div
                variants={gridVariants}
                initial="hidden"
                animate="visible"
                // 3+ cards (vocations / specs / 3-option tiers) → 2
                // columns on phone so the modal fits within one screen
                // (~932px on iPhone 14 Pro Max) instead of running 6
                // cards vertically and cutting off the bottom button.
                // 2-card tiers (legendaries: each spec offers a pair)
                // stack vertically on phone because two side-by-side at
                // 170px wide each crammed the frase into 5 lines. The
                // card itself ships a compact mobile layout (smaller
                // icon + shorter typography) so the 2-column grid still
                // reads cleanly.
                className={`grid gap-2 sm:gap-3 ${
                  cards.length >= 3
                    ? 'grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2'
                }`}
              >
                {cards.map((card) => (
                  <motion.div key={card.id} variants={cardVariants}>
                    <ClassChoiceCard
                      name={card.name}
                      frase={card.frase}
                      icon={card.icon}
                      accent={card.accent}
                      statLine={card.statLine}
                      recommended={card.id === recommendedId}
                      selected={selectedId === card.id}
                      onSelect={() => setSelectedId(card.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {error && (
                <p
                  role="alert"
                  className="mt-4 font-pixel-mono text-base text-red-400 border-2 border-red-500/40 bg-red-500/10 px-4 py-3"
                >
                  ✕ {error}
                </p>
              )}

              <div className="mt-4 sm:mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={choosing}
                  className="font-pixel text-[9px] tracking-widest border-2 border-border-muted bg-card px-5 py-3 text-ink-muted transition-colors hover:border-[#52525b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  MAS TARDE
                </button>
                <motion.button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!selectedId || choosing}
                  // Soft accent shift on selection: 55% class colour
                  // mixed with the modal accent base (green / amber)
                  // so the button still tints toward the picked class
                  // without becoming the bright raw yellow / pink of
                  // the original implementation. For tier 3 the base is
                  // amber, so legendary picks read as a single warm
                  // gradient instead of jumping back to green.
                  style={
                    selectedId && confirmAccent
                      ? {
                          backgroundColor: `color-mix(in srgb, ${confirmAccent} 55%, ${accentHex})`,
                          borderColor: `color-mix(in srgb, ${confirmAccent} 55%, ${accentDeep})`,
                          color: '#0a0a0f',
                          boxShadow: `0 0 18px color-mix(in srgb, ${confirmAccent} 50%, transparent)`,
                        }
                      : isLegendary
                        ? {
                            backgroundColor: accentHex,
                            borderColor: accentDeep,
                            color: '#0a0a0f',
                            boxShadow: `0 0 22px rgba(${accentRgb},0.55)`,
                          }
                        : undefined
                  }
                  className={`font-pixel text-[11px] tracking-widest text-[#0a0a0f] px-8 py-4 border-b-4 active:border-b-0 active:mt-1 transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:mt-0 sm:min-w-[16rem] ${
                    isLegendary
                      ? 'hover:brightness-110 focus-visible:outline-amber-300'
                      : 'bg-green-500 hover:bg-green-400 border-green-700 hover:border-green-600 focus-visible:outline-green-400'
                  }`}
                >
                  {choosing
                    ? 'ELIGIENDO…'
                    : selectedCard
                      ? `FORJAR ${selectedCard.name.toUpperCase()}`
                      : 'ELIGE UNA CLASE'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
