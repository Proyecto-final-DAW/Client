import { SparklesIcon } from '@heroicons/react/24/solid';
import { PixelCorners } from '@shared/components/PixelCorners';
import { useBodyScrollLock } from '@shared/hooks/useBodyScrollLock';
import { useEscapeClose } from '@shared/hooks/useEscapeClose';
import { motion, useReducedMotion } from 'framer-motion';
import { createPortal } from 'react-dom';

interface ClassesIntroModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * One-time explainer for the panteon (class tree) page. Same shape as
 * DietIntroModal but tinted amber to give EL CAMINO a gold/legendary
 * accent distinct from the other section colors. Stored under
 * `classes_intro_seen_{userId}`. Kept separate from the legacy
 * `ClassIntroModal` in this folder (unused, different intent — that
 * one is a welcome modal for brand-new users).
 */
export const ClassesIntroModal = ({
  open,
  onClose,
}: ClassesIntroModalProps): React.JSX.Element | null => {
  const prefersReducedMotion = useReducedMotion();
  useBodyScrollLock(open);
  useEscapeClose(open, onClose);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Como funciona el panteon"
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1.4, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md border-2 border-amber-500/60 bg-card p-5 sm:p-6 shadow-[0_0_0_4px_rgba(10,10,15,0.6),0_0_60px_rgba(245,158,11,0.35)]"
      >
        <PixelCorners size="md" className="border-amber-500/60" />

        <div className="text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center border-2 border-amber-500/50 bg-amber-500/10">
            <SparklesIcon className="h-7 w-7 text-amber-400" />
          </div>
          <p className="mt-3 font-pixel text-[9px] tracking-widest text-ink-muted">
            ◆ TU PANTEON
          </p>
          <h2 className="mt-2 font-pixel text-base sm:text-lg leading-relaxed text-amber-400 [text-shadow:0_0_18px_rgba(245,158,11,0.6)]">
            COMO FUNCIONA
          </h2>
        </div>

        <ul className="mt-5 flex flex-col gap-3 font-pixel-mono text-base sm:text-lg text-ink/95 leading-snug">
          <li className="flex items-start gap-2">
            <span className="text-amber-400" aria-hidden="true">
              ✓
            </span>
            <span>
              Empiezas como <strong>Iniciado</strong>. Cada{' '}
              <strong>rango</strong> que subes despierta una clase nueva.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400" aria-hidden="true">
              ✓
            </span>
            <span>
              En <strong>Rango E</strong> eliges <strong>vocacion</strong> entre
              6 caminos. En <strong>D</strong> una{' '}
              <strong>especializacion</strong>, en <strong>C</strong> una{' '}
              <strong>legendaria</strong>.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400" aria-hidden="true">
              ✓
            </span>
            <span>
              Cada rango pide unos <strong>stats minimos</strong>. Entrena para
              alcanzarlos y desbloquear el siguiente paso.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400" aria-hidden="true">
              ✓
            </span>
            <span>
              Pulsa <strong>ABRIR PANTEON</strong> para ver el camino entero y
              las clases que aun no son tuyas.
            </span>
          </li>
        </ul>

        <p className="mt-4 border-2 border-amber-500/40 bg-amber-500/10 p-3 font-pixel-mono text-base sm:text-lg text-amber-200/95 leading-snug">
          ★ Cada clase tiene su propio <strong>arte</strong> y su{' '}
          <strong>frase de poder</strong>.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full font-pixel text-[10px] tracking-widest bg-amber-500 hover:bg-amber-400 text-[#0a0a0f] px-5 py-3 border-b-4 border-amber-700 hover:border-amber-600 active:border-b-0 active:mt-[1.40625rem] transition-all duration-150 shadow-[0_0_18px_rgba(245,158,11,0.45)]"
        >
          ▶ ENTENDIDO
        </button>
      </motion.div>
    </div>,
    document.body
  );
};
