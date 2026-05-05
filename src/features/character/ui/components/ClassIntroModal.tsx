import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';

import { PixelCorners } from '../../../../shared/components/PixelCorners';

type Props = {
  open: boolean;
  noviceName: string;
  onClose: () => void;
};

const TIER_STEPS: { tier: string; label: string; hint: string }[] = [
  {
    tier: 'T0',
    label: 'NOVATO',
    hint: 'Donde empiezas. Entrena para ganar XP.',
  },
  {
    tier: 'T1',
    label: 'VOCACION',
    hint: 'Tu primera clase: descubre tu camino.',
  },
  {
    tier: 'T2',
    label: 'ESPECIALIZACION',
    hint: 'Refina tu estilo y tus stats clave.',
  },
  {
    tier: 'T3',
    label: 'LEGENDARIA',
    hint: 'Solo para los que mantienen la racha.',
  },
];

export const ClassIntroModal = ({
  open,
  noviceName,
  onClose,
}: Props): React.JSX.Element => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    return () => {
      previouslyFocusedRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
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
            aria-labelledby="class-intro-title"
            {...dialogMotion}
            className="relative w-full max-w-lg border-2 border-green-500/60 bg-card p-6 shadow-[0_0_0_4px_rgba(10,10,15,0.8),0_0_80px_rgba(34,197,94,0.4)]"
          >
            <PixelCorners size="md" className="border-green-500/60" />

            <header className="mb-5 text-center">
              <p className="font-pixel text-[9px] tracking-widest text-green-500">
                BIENVENIDO HEROE
              </p>
              <h2
                id="class-intro-title"
                className="mt-3 font-pixel text-base leading-relaxed text-green-400 [text-shadow:0_0_18px_rgba(34,197,94,0.55)] sm:text-lg"
              >
                EMPIEZAS COMO {noviceName.toUpperCase()}
              </h2>
              <p className="mt-3 font-pixel text-base italic leading-tight text-ink-muted">
                Tu camino se forja entrenando.
              </p>
            </header>

            <ol className="flex flex-col gap-2">
              {TIER_STEPS.map((step, index) => (
                <li
                  key={step.tier}
                  className={`relative flex items-start gap-3 border-2 p-3 ${
                    index === 0
                      ? 'border-green-500/60 bg-green-500/5'
                      : 'border-border bg-page'
                  }`}
                >
                  <span
                    className={`shrink-0 font-pixel text-[10px] tracking-widest ${
                      index === 0 ? 'text-green-400' : 'text-ink-disabled'
                    }`}
                  >
                    {step.tier}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-pixel text-[10px] tracking-widest ${
                        index === 0 ? 'text-green-400' : 'text-ink-muted'
                      }`}
                    >
                      {step.label}
                      {index === 0 && (
                        <span className="ml-2 text-[8px] text-green-500">
                          ▶ AHORA
                        </span>
                      )}
                    </p>
                    <p className="mt-1.5 font-pixel-mono text-lg leading-snug text-ink-muted">
                      {step.hint}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-5 text-center font-pixel-mono text-lg italic leading-snug text-ink-faint">
              Cuando alcances el siguiente tier te avisaremos.
            </p>

            <div className="mt-5 flex justify-end">
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="font-pixel text-[10px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-6 py-3 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
              >
                ▶ ENTENDIDO
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
