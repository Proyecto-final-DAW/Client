import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type { PendingChoice } from '../../core/domain/models/CharacterState';
import { ClassChoiceCard } from './ClassChoiceCard';

type Props = {
  open: boolean;
  pendingChoice: PendingChoice;
  choosing: boolean;
  onConfirm: (classId: string) => void | Promise<void>;
  onClose: () => void;
};

const TIER_TITLE: Record<1 | 2 | 3, string> = {
  1: 'ELIGE TU VOCACION',
  2: 'ELIGE TU ESPECIALIZACION',
  3: 'ELIGE TU LEGENDARIA',
};

const TIER_DESCRIPTION: Record<1 | 2 | 3, string> = {
  1: 'Tu disciplina ha hablado por si sola. Es momento de nombrarla.',
  2: 'Has cruzado el umbral. Tu camino se bifurca.',
  3: 'Has alcanzado lo que pocos alcanzan. Elige como seras recordado.',
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const TierUpModal = ({
  open,
  pendingChoice,
  choosing,
  onConfirm,
  onClose,
}: Props): React.JSX.Element => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const initialFocusRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const tier = pendingChoice.tier;
  const options = pendingChoice.options;
  const recommendedId = pendingChoice.recommendedId;

  // Reset selection whenever the tier-up offer changes (so dismissing one tier
  // and receiving the next doesn't carry over a stale selection).
  useEffect(() => {
    setSelectedId(null);
  }, [tier, recommendedId]);

  // Capture the previously focused element when the modal opens, restore on close.
  useEffect(() => {
    if (!open) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    initialFocusRef.current?.focus();
    return () => {
      previouslyFocusedRef.current?.focus();
    };
  }, [open]);

  // ESC closes; Tab cycles within the dialog.
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
        transition: { duration: 0.2 },
      };

  const dialogMotion = prefersReducedMotion
    ? {
        initial: false,
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, scale: 0.92 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          {...overlayMotion}
          onMouseDown={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tier-up-title"
            aria-describedby="tier-up-description"
            {...dialogMotion}
            className="relative w-full max-w-3xl border-2 border-green-500/60 bg-card p-6 shadow-[0_0_0_4px_rgba(10,10,15,0.8),0_0_80px_rgba(34,197,94,0.4)]"
          >
            <PixelCorners size="md" className="border-green-500/60" />

            <header className="mb-5 text-center">
              <p className="font-pixel text-[9px] tracking-widest text-green-500">
                TIER {tier} ALCANZADO
              </p>
              <h2
                id="tier-up-title"
                className="mt-3 font-pixel text-base leading-relaxed text-green-400 [text-shadow:0_0_18px_rgba(34,197,94,0.55)] sm:text-lg"
              >
                {TIER_TITLE[tier]}
              </h2>
              <p
                id="tier-up-description"
                className="mt-3 font-pixel text-base italic text-ink-muted"
              >
                {TIER_DESCRIPTION[tier]}
              </p>
            </header>

            <div
              className={`grid gap-3 ${
                options.length >= 3
                  ? 'sm:grid-cols-2 lg:grid-cols-3'
                  : 'sm:grid-cols-2'
              }`}
            >
              {options.map((option) => (
                <ClassChoiceCard
                  key={option.id}
                  name={option.name}
                  frase={option.frase}
                  recommended={option.id === recommendedId}
                  selected={selectedId === option.id}
                  onSelect={() => setSelectedId(option.id)}
                />
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                ref={initialFocusRef}
                type="button"
                onClick={onClose}
                disabled={choosing}
                className="font-pixel text-[9px] tracking-widest border-2 border-border-muted bg-card px-4 py-3 text-ink-muted transition-colors hover:border-[#3f3f46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                MAS TARDE
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!selectedId || choosing}
                className="font-pixel text-[9px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-6 py-3 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:mt-0"
              >
                {choosing ? 'ELIGIENDO…' : '▶ CONFIRMAR'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
