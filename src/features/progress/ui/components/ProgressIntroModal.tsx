import { ChartBarIcon } from '@heroicons/react/24/solid';
import { PixelCorners } from '@shared/components/PixelCorners';
import { useBodyScrollLock } from '@shared/hooks/useBodyScrollLock';
import { useEscapeClose } from '@shared/hooks/useEscapeClose';
import { motion, useReducedMotion } from 'framer-motion';
import { createPortal } from 'react-dom';

interface ProgressIntroModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * One-time explainer for the progress page. Same shape as
 * DietIntroModal. Stored under `progress_intro_seen_{userId}`.
 */
export const ProgressIntroModal = ({
  open,
  onClose,
}: ProgressIntroModalProps): React.JSX.Element | null => {
  const prefersReducedMotion = useReducedMotion();
  useBodyScrollLock(open);
  useEscapeClose(open, onClose);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Como funciona tu progreso"
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1.4, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md border-2 border-blue-500/60 bg-card p-5 sm:p-6 shadow-[0_0_0_4px_rgba(10,10,15,0.6),0_0_60px_rgba(59,130,246,0.35)]"
      >
        <PixelCorners size="md" className="border-blue-500/60" />

        <div className="text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center border-2 border-blue-500/50 bg-blue-500/10">
            <ChartBarIcon className="h-7 w-7 text-blue-400" />
          </div>
          <p className="mt-3 font-pixel text-[9px] tracking-widest text-ink-muted">
            ◆ TU PROGRESO
          </p>
          <h2 className="mt-2 font-pixel text-base sm:text-lg leading-relaxed text-blue-400 [text-shadow:0_0_18px_rgba(59,130,246,0.6)]">
            COMO FUNCIONA
          </h2>
        </div>

        <ul className="mt-5 flex flex-col gap-3 font-pixel-mono text-base sm:text-lg text-ink/95 leading-snug">
          <li className="flex items-start gap-2">
            <span className="text-blue-400" aria-hidden="true">
              ✓
            </span>
            <span>
              El <strong>radar</strong> compara tus stats de ahora con los de
              hace 30 dias o el inicio.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400" aria-hidden="true">
              ✓
            </span>
            <span>
              El grafico de <strong>peso corporal</strong> sube cada vez que lo
              registras desde tu personaje.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400" aria-hidden="true">
              ✓
            </span>
            <span>
              Despliega <strong>TECNICO</strong> para ver la progresion de un
              ejercicio concreto.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400" aria-hidden="true">
              ✓
            </span>
            <span>
              Necesitas algunos <strong>combates</strong> registrados para que
              empiecen a aparecer datos.
            </span>
          </li>
        </ul>

        <p className="mt-4 border-2 border-blue-500/40 bg-blue-500/10 p-3 font-pixel-mono text-base sm:text-lg text-blue-200/95 leading-snug">
          ★ Cuanto mas entrenes, mas claro vas a ver tu evolucion aqui.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full font-pixel text-[10px] tracking-widest bg-blue-500 hover:bg-blue-400 text-[#0a0a0f] px-5 py-3 border-b-4 border-blue-700 hover:border-blue-600 active:border-b-0 active:mt-[1.40625rem] transition-all duration-150 shadow-[0_0_18px_rgba(59,130,246,0.45)]"
        >
          ▶ ENTENDIDO
        </button>
      </motion.div>
    </div>,
    document.body
  );
};
