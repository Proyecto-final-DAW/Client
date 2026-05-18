import { PixelCorners } from '@shared/components/PixelCorners';
import { useBodyScrollLock } from '@shared/hooks/useBodyScrollLock';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import type { CharacterState } from '../../core/domain/models/CharacterState';
import {
  type RankLetter,
  styleForRank,
} from '../../core/domain/models/RankLabels';

type Props = {
  open: boolean;
  rank: RankLetter;
  state: CharacterState;
  onClose: () => void;
};

interface RankMeta {
  /** Tiny tag above the hero name — just the rank letter so the title
   *  carries the meaning. Earlier copies repeated the class name here
   *  ("RANGO S · LEYENDA") which the user flagged as redundant. */
  eyebrow: string;
  /** Hero title — the class/title name that just unlocked. */
  name: string;
  /** Sub-eyebrow under the name describing the *kind* of ascent. */
  kind: string;
  /** Lore line from the catalog. */
  flavour: string;
}

const resolveMeta = (
  rank: RankLetter,
  state: CharacterState
): RankMeta | null => {
  switch (rank) {
    case 'B':
      return {
        eyebrow: 'RANGO B',
        name:
          state.legendary?.transcendentName ??
          state.legendary?.name ??
          'Trascendente',
        kind: 'Tu legendaria evoluciona',
        flavour:
          state.legendary?.transcendentFrase ??
          'Has cruzado el umbral donde la disciplina se vuelve segunda piel.',
      };
    case 'A':
      return {
        eyebrow: 'RANGO A',
        name: 'Maestro Supremo',
        kind: 'El cuerpo obedece al espiritu',
        flavour: 'Trascendiste el cuerpo. Trascendiste el alma. Ahora ERES.',
      };
    case 'S':
      return {
        eyebrow: '✦ RANGO S ✦',
        name: 'Leyenda',
        kind: 'Has alcanzado el techo absoluto',
        flavour: 'Cantaran tu nombre cuando ya no quede nadie para escucharlo.',
      };
    default:
      return null;
  }
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const RankUpModal = ({
  open,
  rank,
  state,
  onClose,
}: Props): React.JSX.Element | null => {
  const meta = resolveMeta(rank, state);
  const palette = styleForRank(rank);
  const prefersReducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const isApex = rank === 'S';

  useBodyScrollLock(open && meta !== null);

  useEffect(() => {
    if (!open || !meta) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    headingRef.current?.focus();
    return () => {
      const target = previouslyFocusedRef.current;
      if (target && document.contains(target)) target.focus();
    };
  }, [open, meta]);

  useEffect(() => {
    if (!open || !meta) return;
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
  }, [open, meta, onClose]);

  if (!meta) return null;

  // Soft, tight tint over the page. Stops well short of the viewport
  // edges so the ambient colour only frames the dialog rather than
  // washing the whole screen — the user called the wider gradient
  // "feo lo del fondo".
  const backdrop = `radial-gradient(circle at center, ${palette.glow.replace(/,\s*[\d.]+\)$/, ',0.12)')} 0%, rgba(0,0,0,0.95) 40%, rgba(0,0,0,0.98) 70%)`;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: isApex ? 0.5 : 0.3 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          // Overlay just centres + dims; scroll lives inside the
          // dialog so desktop stays scrollbar-free when the modal fits.
          // Small lateral margin on phone so the dialog's pixel
          // corners and neon halo stay inside the viewport — `p-0`
          // clipped them. `sm:p-4` keeps the wider frame on tablet+.
          className="fixed inset-0 z-[65] flex items-center justify-center bg-black/85 p-2 sm:p-4 overscroll-contain"
          style={{ backgroundImage: backdrop }}
        >
          {/* Stage wrapper — caps width at the dialog max so the soft
              neon (rendered as the dialog's box-shadow below) stays
              tight around the box. The user explicitly rejected
              full-screen rotating auras / pillars / matrix streaks
              ("los efectos giratorios de atras los quitaria"); the
              dialog's own glow halo is the only ambient effect now. */}
          <div className="relative w-full max-w-md sm:max-w-2xl flex justify-center">
            {/* THE DIALOG ITSELF */}
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="rank-up-title"
              aria-describedby="rank-up-description"
              initial={
                prefersReducedMotion
                  ? false
                  : {
                      opacity: 0,
                      scale: isApex ? 0.78 : 0.88,
                      y: isApex ? 28 : 18,
                      filter: isApex ? 'blur(10px)' : 'blur(6px)',
                    }
              }
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{
                duration: isApex ? 0.85 : 0.55,
                ease: [0.22, 1.2, 0.36, 1] as const,
              }}
              style={{
                borderColor: palette.border,
                // Single tight neon halo + a slim inset highlight. No
                // animated auras, no rotating conics — the user asked
                // for "una capa de neon y sombra mas chiquita" and got
                // it. S keeps a slightly stronger glow so the apex
                // unlock still feels heavier than B/A without bleeding
                // into the page.
                boxShadow: isApex
                  ? `0 0 0 3px rgba(10,10,15,0.85), 0 0 40px ${palette.glow}, 0 0 14px ${palette.glow.replace(/,\s*[\d.]+\)$/, ',0.45)')} inset, 0 16px 36px rgba(0,0,0,0.8)`
                  : `0 0 0 3px rgba(10,10,15,0.85), 0 0 28px ${palette.glow}, 0 0 10px ${palette.glow.replace(/,\s*[\d.]+\)$/, ',0.25)')} inset, 0 14px 30px rgba(0,0,0,0.8)`,
              }}
              // Internal scroll only on mobile/tablet (when the modal
              // could be taller than the viewport — landscape phone,
              // keyboard up). From `lg:` upwards no clamp, no scroll:
              // the rank-up modal is short and fits any desktop.
              // Padding shrinks on phone so the eyebrow + title +
              // subtitle + flavour + CONTINUAR fit a 932px iPhone Pro
              // Max canvas without the bottom button being clipped.
              className="relative w-full max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] overflow-y-auto lg:max-h-none lg:overflow-visible border-2 bg-card px-4 py-5 sm:px-8 sm:py-9 text-center [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black/40"
            >
              <PixelCorners size="lg" className="" />

              {/* Scanline sweep — cheap "CRT awakens" effect on open. */}
              {!prefersReducedMotion && (
                <motion.div
                  aria-hidden="true"
                  initial={{ opacity: 0, y: '-30%' }}
                  animate={{ opacity: [0, 0.55, 0], y: ['-20%', '120%'] }}
                  transition={{
                    duration: 1.2,
                    delay: 0.1,
                    ease: 'easeInOut',
                    times: [0, 0.5, 1],
                  }}
                  className="pointer-events-none absolute inset-x-0 h-12 mix-blend-screen"
                  style={{
                    background: `linear-gradient(to bottom, transparent 0%, ${palette.glow} 50%, transparent 100%)`,
                    filter: 'blur(5px)',
                  }}
                />
              )}

              {/* Tiny eyebrow — just the rank tag. */}
              <motion.p
                initial={prefersReducedMotion ? false : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="font-pixel text-[9px] sm:text-[11px] tracking-[0.45em]"
                style={{
                  color: palette.text,
                  textShadow: `0 0 14px ${palette.glow}`,
                }}
              >
                {meta.eyebrow}
              </motion.p>

              {/* HERO — the class/title name. Compact enough to live on
                  one line at every viewport: the longest values are
                  "MAESTRO SUPREMO" (15 chars) and the transcendent
                  forms (≤14 chars). Mobile starts at 3xl so a 375px
                  screen fits the whole word without wrapping; desktop
                  scales up to 6xl, still substantially larger than the
                  body copy but no longer rivalling the viewport. */}
              <motion.h2
                ref={headingRef}
                tabIndex={-1}
                id="rank-up-title"
                initial={
                  prefersReducedMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 14,
                        scale: 0.9,
                        filter: isApex ? 'blur(12px)' : 'blur(8px)',
                      }
                }
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                transition={{
                  duration: isApex ? 0.85 : 0.6,
                  delay: 0.15,
                  ease: [0.22, 1.4, 0.36, 1],
                }}
                style={{
                  color: palette.text,
                  textShadow: isApex
                    ? `0 0 32px ${palette.glow}, 0 0 12px ${palette.glow}, 3px 3px 0 #000`
                    : `0 0 22px ${palette.glow}, 2px 2px 0 #000`,
                }}
                className="mt-2 sm:mt-3 font-pixel outline-none leading-[1.05] text-2xl sm:text-5xl md:text-6xl"
              >
                {meta.name.toUpperCase()}
              </motion.h2>

              {/* Sub-eyebrow describing the *kind* of ascent. */}
              <motion.p
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.4 }}
                className="mt-4 font-pixel text-[10px] sm:text-xs tracking-widest"
                style={{
                  color: palette.text,
                  textShadow: `0 0 8px ${palette.glow}`,
                }}
              >
                {meta.kind.toUpperCase()}
              </motion.p>

              {/* Decorative separator — 3-dot pixel row in the rank colour. */}
              <motion.div
                aria-hidden="true"
                initial={
                  prefersReducedMotion ? false : { opacity: 0, scaleX: 0.4 }
                }
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.45, delay: 0.5 }}
                className="mx-auto mt-4 flex items-center justify-center gap-1.5"
              >
                <span
                  className="h-1 w-1"
                  style={{ backgroundColor: palette.border }}
                />
                <span
                  className="h-1 w-7"
                  style={{ backgroundColor: palette.text }}
                />
                <span
                  className="h-1 w-1"
                  style={{ backgroundColor: palette.border }}
                />
              </motion.div>

              {/* Flavour line. */}
              <motion.p
                id="rank-up-description"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="mx-auto mt-4 max-w-md font-pixel-mono text-xs sm:text-sm italic leading-snug text-ink/90"
              >
                “{meta.flavour}”
              </motion.p>

              <motion.button
                type="button"
                onClick={onClose}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.7 }}
                style={{
                  backgroundColor: palette.bg,
                  borderColor: palette.border,
                  color: '#0a0a0f',
                  boxShadow: `0 0 22px ${palette.glow}`,
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
