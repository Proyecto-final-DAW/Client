import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { PixelCorners } from '@shared/components/PixelCorners';
import { statConfigFor } from '@features/stats/ui/StatConfig';
import type {
  PendingChoice,
  PendingChoiceTier,
} from '../../core/domain/models/CharacterState';
import { ClassChoiceCard } from './ClassChoiceCard';

type Props = {
  open: boolean;
  pendingChoice: PendingChoice;
  choosing: boolean;
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

const TIER_INSTRUCTION: Record<PendingChoiceTier, string> = {
  1: 'Elige tu vocacion. Define como entrenaras de aqui en adelante.',
  2: 'Elige tu especializacion dentro de tu vocacion.',
  3: 'Elige tu rama legendaria. Es permanente.',
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
        statLine: config ? `STAT DOMINANTE: ${config.name.toUpperCase()}` : undefined,
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

  const overlayMotion = prefersReducedMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.25 },
      };

  const dialogMotion = prefersReducedMotion
    ? {
        initial: false,
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, scale: 0.88, y: 24 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 12 },
        transition: { duration: 0.5, ease: [0.22, 1.2, 0.36, 1] as const },
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          {...overlayMotion}
          onMouseDown={handleBackdropClick}
          // Heavier dim + radial green glow behind the dialog so the
          // modal reads as the only thing on screen — the previous
          // flat 80% black felt like a generic confirm box.
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 overflow-y-auto"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, rgba(34,197,94,0.10) 0%, rgba(0,0,0,0.95) 60%)',
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tier-up-title"
            aria-describedby="tier-up-description"
            {...dialogMotion}
            className="relative my-4 sm:my-8 w-full max-w-5xl max-h-[calc(100vh-2rem)] overflow-y-auto border-2 border-green-500/70 bg-card p-5 sm:p-10 shadow-[0_0_0_4px_rgba(10,10,15,0.85),0_0_120px_rgba(34,197,94,0.55),0_30px_80px_rgba(0,0,0,0.85)] [scrollbar-width:thin] [scrollbar-color:rgba(34,197,94,0.45)_rgba(15,15,20,0.4)] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black/40 [&::-webkit-scrollbar-thumb]:bg-green-500/45"
          >
            <PixelCorners size="lg" className="border-green-500/70" />

            {/* Decorative top frame: pulsing tier badge centered on a
                horizontal "achievement" line. The previous header was
                a paragraph stack; this carries the cinematic moment. */}
            <header className="mb-7 flex flex-col items-center text-center">
              <div className="mb-4 flex w-full items-center gap-3">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-green-500/50 to-green-500/80" />
                <motion.span
                  initial={prefersReducedMotion ? false : { scale: 0.6, opacity: 0 }}
                  animate={
                    prefersReducedMotion
                      ? { scale: 1, opacity: 1 }
                      : {
                          scale: [0.6, 1.15, 1],
                          opacity: 1,
                          boxShadow: [
                            '0 0 14px rgba(34,197,94,0.4)',
                            '0 0 32px rgba(34,197,94,0.7)',
                            '0 0 14px rgba(34,197,94,0.4)',
                          ],
                        }
                  }
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : {
                          duration: 1.6,
                          repeat: Infinity,
                          repeatType: 'reverse',
                          ease: 'easeInOut',
                        }
                  }
                  className="inline-flex items-center gap-2 border-2 border-green-500/70 bg-green-500/10 px-4 py-2 font-pixel text-[10px] tracking-widest text-green-300"
                >
                  ◆ TIER {tier} ALCANZADO ◆
                </motion.span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent via-green-500/50 to-green-500/80" />
              </div>

              <motion.h2
                ref={headingRef}
                tabIndex={-1}
                id="tier-up-title"
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, y: 14, filter: 'blur(8px)' }
                }
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1.4, 0.36, 1] }}
                className="font-pixel text-lg sm:text-2xl leading-snug text-green-400 [text-shadow:0_0_22px_rgba(34,197,94,0.65),2px_2px_0_#000]"
              >
                {TIER_TITLE[tier]}
              </motion.h2>

              <motion.p
                id="tier-up-description"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.32 }}
                className="mt-4 max-w-2xl font-pixel-mono text-base sm:text-lg italic leading-snug text-ink/90"
              >
                “{TIER_FLAVOR[tier]}”
              </motion.p>

              <motion.p
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="mt-3 font-pixel text-[10px] tracking-widest text-green-500"
              >
                {TIER_INSTRUCTION[tier]}
              </motion.p>
            </header>

            <motion.div
              variants={gridVariants}
              initial="hidden"
              animate="visible"
              // Mobile-first: 2 columns from the smallest breakpoint
              // when there are 3+ options (T1 vocations are 6 cards →
              // 2×3 grid on phone, ~330px scroll instead of the
              // previous 1100px tower). 2-card pendingChoices stack
              // 1-col at narrow widths since each can use the full
              // width comfortably.
              className={`grid gap-3 sm:gap-4 ${
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

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                animate={
                  selectedId && !choosing && !prefersReducedMotion
                    ? {
                        boxShadow: [
                          `0 0 18px ${confirmAccent ?? '#22c55e'}66`,
                          `0 0 36px ${confirmAccent ?? '#22c55e'}99`,
                          `0 0 18px ${confirmAccent ?? '#22c55e'}66`,
                        ],
                      }
                    : undefined
                }
                transition={
                  selectedId && !choosing
                    ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
                    : undefined
                }
                style={
                  selectedId && confirmAccent
                    ? {
                        backgroundColor: confirmAccent,
                        borderColor: confirmAccent,
                        color: '#0a0a0f',
                      }
                    : undefined
                }
                className="font-pixel text-[11px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-8 py-4 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:mt-0 sm:min-w-[16rem]"
              >
                {choosing
                  ? 'ELIGIENDO…'
                  : selectedCard
                    ? `▶ FORJAR · ${selectedCard.name.toUpperCase()}`
                    : '▶ ELIGE UNA CLASE'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
