import { statConfigFor } from '@features/stats/ui/StatConfig';
import { PixelCorners } from '@shared/components/PixelCorners';
import { useBodyScrollLock } from '@shared/hooks/useBodyScrollLock';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import type { StatKey } from '../../core/domain/models/CharacterClass';
import type { PendingChoiceTier } from '../../core/domain/models/CharacterState';
import { styleForRank } from '../../core/domain/models/RankLabels';

/**
 * Snapshot of the class the user just picked. Captured *before* the
 * server call in the parent because once `pendingChoice` clears the
 * options list is gone and we can't look up the picked card any more.
 */
export interface RevealedClass {
  /** Tier of the choice — drives the rank-letter eyebrow and the
   *  palette overlay (E for vocation, D for specialization, C for
   *  legendary). */
  tier: PendingChoiceTier;
  id: string;
  name: string;
  frase: string;
  /** Headline stat used to colour the icon + name accent. Mirrors the
   *  per-tier selection in `TierUpModal.optionMeta` so the reveal
   *  carries the same colour the user just picked. */
  stat: StatKey | null;
}

interface Props {
  open: boolean;
  /** When null the modal renders nothing — keeps the AnimatePresence
   *  exit animation clean across the `revealedClass !== null` toggle. */
  reveal: RevealedClass | null;
  onClose: () => void;
}

/**
 * Per-tier copy. Each tier has its own celebratory framing — vocation
 * is the "you've chosen your path", specialization is the "you've
 * found your edge", legendary is the "you've earned a legacy" moment.
 */
const TIER_EYEBROW: Record<PendingChoiceTier, string> = {
  1: 'TU CAMINO COMIENZA',
  2: 'TU CAMINO SE AFILA',
  3: 'TU LEYENDA SE ESCRIBE',
};

const TIER_KIND: Record<PendingChoiceTier, string> = {
  1: 'VOCACION ELEGIDA',
  2: 'ESPECIALIZACION ELEGIDA',
  3: 'CLASE LEGENDARIA ELEGIDA',
};

/** Rank letter the user enters with this choice — matches the eyebrow
 *  shown in TierUpModal so the two modals chain visually. */
const TIER_RANK_LETTER: Record<PendingChoiceTier, 'E' | 'D' | 'C'> = {
  1: 'E',
  2: 'D',
  3: 'C',
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Big "you just chose X" reveal modal. Pops AFTER the TierUpModal
 * dismisses on a successful choice so the user gets a celebratory beat
 * with the picked class blown up in pixel text — no more "click confirm
 * and the modal silently disappears" the user complained about.
 *
 * Mirrors RankUpModal's visual language so the two celebration modals
 * read as siblings: tight neon halo, pixel corners, scanline sweep,
 * staggered fade-in for eyebrow → icon → hero → flavour → CONTINUAR.
 *
 * Palette: stat-tinted (sword for fuerza, shield for resistencia, …)
 * when the picked class has a headline stat, else falls back to the
 * tier-rank palette (E bronze / D silver / C gold). Keeps every reveal
 * visually distinct based on the class the user actually chose.
 */
export const ClassRevealModal = ({
  open,
  reveal,
  onClose,
}: Props): React.JSX.Element | null => {
  const prefersReducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useBodyScrollLock(open && reveal !== null);

  useEffect(() => {
    if (!open || !reveal) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    headingRef.current?.focus();
    return () => {
      const target = previouslyFocusedRef.current;
      if (target && document.contains(target)) target.focus();
    };
  }, [open, reveal]);

  useEffect(() => {
    if (!open || !reveal) return;
    const handleKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
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
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, reveal, onClose]);

  if (!reveal) return null;

  const rankPalette = styleForRank(TIER_RANK_LETTER[reveal.tier]);
  const statConfig = reveal.stat ? statConfigFor(reveal.stat) : null;
  // Use the stat accent for the personalized colour (the icon, the
  // hero name glow), but keep the rank palette for the outer halo so
  // the user feels they crossed the rank threshold. Two-tone reveal
  // is more vivid than a single colour for every class.
  const accent = statConfig?.accentColor ?? rankPalette.text;
  const Icon = statConfig?.icon ?? null;
  const isLegendary = reveal.tier === 3;

  // Soft, tight radial backdrop centred on the dialog so the page
  // doesn't feel like it lost colour around the edges — mirrors
  // RankUpModal's choice.
  const backdrop = `radial-gradient(circle at center, ${rankPalette.glow.replace(/,\s*[\d.]+\)$/, ',0.16)')} 0%, rgba(0,0,0,0.96) 42%, rgba(0,0,0,0.99) 72%)`;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: isLegendary ? 0.5 : 0.35 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          className="fixed inset-0 z-[66] flex items-center justify-center bg-black/90 p-2 sm:p-4 overscroll-contain"
          style={{ backgroundImage: backdrop }}
        >
          <div className="relative w-full max-w-md sm:max-w-2xl flex justify-center">
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="class-reveal-title"
              aria-describedby="class-reveal-description"
              initial={
                prefersReducedMotion
                  ? false
                  : {
                      opacity: 0,
                      scale: isLegendary ? 0.78 : 0.86,
                      y: isLegendary ? 32 : 20,
                      filter: isLegendary ? 'blur(10px)' : 'blur(6px)',
                    }
              }
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95, y: 14 }}
              transition={{
                duration: isLegendary ? 0.9 : 0.6,
                ease: [0.22, 1.2, 0.36, 1] as const,
              }}
              style={{
                borderColor: rankPalette.border,
                boxShadow: isLegendary
                  ? `0 0 0 3px rgba(10,10,15,0.85), 0 0 44px ${rankPalette.glow}, 0 0 14px ${rankPalette.glow.replace(/,\s*[\d.]+\)$/, ',0.45)')} inset, 0 16px 36px rgba(0,0,0,0.8)`
                  : `0 0 0 3px rgba(10,10,15,0.85), 0 0 30px ${rankPalette.glow}, 0 0 10px ${rankPalette.glow.replace(/,\s*[\d.]+\)$/, ',0.3)')} inset, 0 14px 30px rgba(0,0,0,0.8)`,
              }}
              // Internal scroll only when the modal could exceed the
              // viewport (mobile / tablet); from `lg:` upwards the
              // content always fits naturally.
              className="relative w-full max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] overflow-y-auto lg:max-h-none lg:overflow-visible border-2 bg-card px-4 py-6 sm:px-8 sm:py-10 text-center [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black/40"
            >
              <PixelCorners size="lg" className="" />

              {/* Scanline sweep — same cheap "CRT awakens" beat as the
                  rank-up modal, kept so the two reveals read as a
                  visual family. */}
              {!prefersReducedMotion && (
                <motion.div
                  aria-hidden="true"
                  initial={{ opacity: 0, y: '-30%' }}
                  animate={{ opacity: [0, 0.55, 0], y: ['-20%', '120%'] }}
                  transition={{
                    duration: 1.3,
                    delay: 0.1,
                    ease: 'easeInOut',
                    times: [0, 0.5, 1],
                  }}
                  className="pointer-events-none absolute inset-x-0 h-12 mix-blend-screen"
                  style={{
                    background: `linear-gradient(to bottom, transparent 0%, ${rankPalette.glow} 50%, transparent 100%)`,
                    filter: 'blur(5px)',
                  }}
                />
              )}

              {/* Tier eyebrow — small label naming the celebration kind
                  ("TU CAMINO COMIENZA" / etc.). */}
              <motion.p
                initial={prefersReducedMotion ? false : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="font-pixel text-[9px] sm:text-[11px] tracking-[0.4em]"
                style={{
                  color: rankPalette.text,
                  textShadow: `0 0 12px ${rankPalette.glow}`,
                }}
              >
                {TIER_EYEBROW[reveal.tier]}
              </motion.p>

              {/* Rank tag — the rank letter the user just claimed. */}
              <motion.p
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.18 }}
                className="mt-1 font-pixel text-[8px] sm:text-[10px] tracking-[0.5em] text-ink-muted"
              >
                RANGO {TIER_RANK_LETTER[reveal.tier]}
              </motion.p>

              {/* Stat icon — accent-coloured, glowing. Hidden when the
                  class has no headline stat (apex / future-proofing). */}
              {Icon && (
                <motion.div
                  initial={
                    prefersReducedMotion
                      ? false
                      : { opacity: 0, scale: 0.5, rotate: -8 }
                  }
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.25,
                    ease: [0.22, 1.4, 0.36, 1] as const,
                  }}
                  className="mx-auto mt-5 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-sm border-2"
                  style={{
                    borderColor: `color-mix(in srgb, ${accent} 65%, transparent)`,
                    backgroundColor: `color-mix(in srgb, ${accent} 14%, transparent)`,
                    boxShadow: `0 0 22px color-mix(in srgb, ${accent} 50%, transparent)`,
                  }}
                >
                  <Icon
                    className="h-10 w-10 sm:h-12 sm:w-12"
                    style={{
                      color: accent,
                      filter: `drop-shadow(0 0 8px color-mix(in srgb, ${accent} 60%, transparent))`,
                    }}
                  />
                </motion.div>
              )}

              {/* HERO name — the chosen class, in the largest pixel font
                  the dialog will hold without wrapping the longest
                  legendaries ("CABALLERO APOCALIPTICO", 21 chars).
                  Scales aggressively because the user wanted "una pasada"
                  — the name takes the spotlight. */}
              <motion.h2
                ref={headingRef}
                tabIndex={-1}
                id="class-reveal-title"
                initial={
                  prefersReducedMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 14,
                        scale: 0.86,
                        filter: 'blur(10px)',
                      }
                }
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.85,
                  delay: 0.35,
                  ease: [0.22, 1.4, 0.36, 1] as const,
                }}
                style={{
                  color: accent,
                  textShadow: `0 0 28px color-mix(in srgb, ${accent} 70%, transparent), 0 0 12px color-mix(in srgb, ${accent} 50%, transparent), 3px 3px 0 #000`,
                }}
                className="mt-5 sm:mt-6 font-pixel outline-none leading-[1.05] text-xl sm:text-3xl md:text-4xl lg:text-5xl break-words"
              >
                {reveal.name.toUpperCase()}
              </motion.h2>

              {/* Sub-eyebrow — names the kind of choice ("VOCACION
                  ELEGIDA", etc.) so the reveal works as a confirmation
                  of the action the user just took. */}
              <motion.p
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.55 }}
                className="mt-4 font-pixel text-[10px] sm:text-xs tracking-widest"
                style={{
                  color: accent,
                  textShadow: `0 0 8px color-mix(in srgb, ${accent} 55%, transparent)`,
                }}
              >
                {TIER_KIND[reveal.tier]}
              </motion.p>

              {/* Decorative 3-dot separator in the rank palette. */}
              <motion.div
                aria-hidden="true"
                initial={
                  prefersReducedMotion ? false : { opacity: 0, scaleX: 0.4 }
                }
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.45, delay: 0.6 }}
                className="mx-auto mt-4 flex items-center justify-center gap-1.5"
              >
                <span
                  className="h-1 w-1"
                  style={{ backgroundColor: rankPalette.border }}
                />
                <span
                  className="h-1 w-7"
                  style={{ backgroundColor: rankPalette.text }}
                />
                <span
                  className="h-1 w-1"
                  style={{ backgroundColor: rankPalette.border }}
                />
              </motion.div>

              {/* Class frase — italic VT323, same treatment as the
                  TierUpModal cards so the reveal feels continuous with
                  the picker the user just left. */}
              <motion.p
                id="class-reveal-description"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.7 }}
                className="mx-auto mt-4 max-w-md font-pixel-mono text-base sm:text-lg italic leading-snug text-ink/90"
              >
                “{reveal.frase}”
              </motion.p>

              <motion.button
                type="button"
                onClick={onClose}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.9 }}
                // Use the vibrant stat accent (same colour as the
                // hero name and the icon glow) for the CONTINUAR fill
                // so the button reads as the lit-up "victory" CTA the
                // rest of the modal builds up to. The earlier
                // `rankPalette.bg` (E = #9a3412, C = #a16207, …) is
                // the *deep* shade of each rank and rendered the
                // button matte — looked disabled next to the glowing
                // title. The border darkens the accent for the
                // pressable 3D effect, the halo keeps the rank-tinted
                // glow so the tier identity still reads.
                style={{
                  backgroundColor: accent,
                  borderColor: `color-mix(in srgb, ${accent} 60%, black)`,
                  color: '#0a0a0f',
                  boxShadow: `0 0 22px color-mix(in srgb, ${accent} 55%, transparent), 0 0 14px ${rankPalette.glow}`,
                }}
                className="mt-7 font-pixel text-[11px] sm:text-sm tracking-widest px-8 sm:px-12 py-3.5 sm:py-4 border-b-4 hover:brightness-110 active:border-b-0 active:mt-[29px] sm:active:mt-[33px] transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                CONTINUAR
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
