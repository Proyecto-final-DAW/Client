import { UserCircleIcon } from '@heroicons/react/24/solid';
import { PixelCorners } from '@shared/components/PixelCorners';
import { useBodyScrollLock } from '@shared/hooks/useBodyScrollLock';
import { useEscapeClose } from '@shared/hooks/useEscapeClose';
import { motion, useReducedMotion } from 'framer-motion';
import { createPortal } from 'react-dom';

interface ProfileIntroModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * One-time explainer for the character/profile page. Mirrors
 * DietIntroModal in structure. Stored under
 * `profile_intro_seen_{userId}`.
 */
export const ProfileIntroModal = ({
  open,
  onClose,
}: ProfileIntroModalProps): React.JSX.Element | null => {
  const prefersReducedMotion = useReducedMotion();
  useBodyScrollLock(open);
  useEscapeClose(open, onClose);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Como funciona tu personaje"
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1.4, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md border-2 border-teal-500/60 bg-card p-5 sm:p-6 shadow-[0_0_0_4px_rgba(10,10,15,0.6),0_0_60px_rgba(20,184,166,0.35)]"
      >
        <PixelCorners size="md" className="border-teal-500/60" />

        <div className="text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center border-2 border-teal-500/50 bg-teal-500/10">
            <UserCircleIcon className="h-7 w-7 text-teal-400" />
          </div>
          <p className="mt-3 font-pixel text-[9px] tracking-widest text-ink-muted">
            TU PERSONAJE
          </p>
          <h2 className="mt-2 font-pixel text-base sm:text-lg leading-relaxed text-teal-400 [text-shadow:0_0_18px_rgba(20,184,166,0.6)]">
            COMO FUNCIONA
          </h2>
        </div>

        <ul className="mt-5 flex flex-col gap-3 font-pixel-mono text-base sm:text-lg text-ink/95 leading-snug">
          <li className="flex items-start gap-2">
            <span className="text-teal-400" aria-hidden="true">
              ✓
            </span>
            <span>
              Aqui ves tu <strong>rango</strong>, <strong>clase</strong> y
              <strong> nivel</strong>, mas el resumen de dias, combates y
              records.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-400" aria-hidden="true">
              ✓
            </span>
            <span>
              Pulsa <strong>EDITAR</strong> para cambiar tu nombre, peso,
              altura, edad u objetivo.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-400" aria-hidden="true">
              ✓
            </span>
            <span>
              Cuando cambias algo, tu <strong>dieta</strong> y tu{' '}
              <strong>racha</strong> se recalculan solas.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-400" aria-hidden="true">
              ✓
            </span>
            <span>
              Tambien puedes cambiar tu <strong>contraseña</strong> desde el
              mismo editor.
            </span>
          </li>
        </ul>

        <p className="mt-4 border-2 border-teal-500/40 bg-teal-500/10 p-3 font-pixel-mono text-base sm:text-lg text-teal-200/95 leading-snug">
          ★ Tus <strong>stats</strong> de aqui son el reflejo de todo lo que has
          entrenado.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full font-pixel text-[10px] tracking-widest bg-teal-500 hover:bg-teal-400 text-[#0a0a0f] px-5 py-3 border-b-4 border-teal-700 hover:border-teal-600 active:border-b-0 active:mt-[1.40625rem] transition-all duration-150 shadow-[0_0_18px_rgba(20,184,166,0.45)]"
        >
          ▶ ENTENDIDO
        </button>
      </motion.div>
    </div>,
    document.body
  );
};
