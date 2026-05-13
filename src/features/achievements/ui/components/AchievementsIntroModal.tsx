import { TrophyIcon } from '@heroicons/react/24/solid';
import { PixelCorners } from '@shared/components/PixelCorners';
import { useBodyScrollLock } from '@shared/hooks/useBodyScrollLock';
import { useEscapeClose } from '@shared/hooks/useEscapeClose';
import { motion, useReducedMotion } from 'framer-motion';
import { createPortal } from 'react-dom';

interface AchievementsIntroModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * One-time explainer for the Hall of Fame, mirroring DietIntroModal /
 * StreakIntroModal in structure and dismiss behaviour. Pink-tinted to
 * stand out from the rest of the section palette. Stored under
 * `achievements_intro_seen_{userId}` so a second account on the same
 * browser sees its own copy.
 */
export const AchievementsIntroModal = ({
  open,
  onClose,
}: AchievementsIntroModalProps): React.JSX.Element | null => {
  const prefersReducedMotion = useReducedMotion();
  useBodyScrollLock(open);
  useEscapeClose(open, onClose);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Como funciona el hall of fame"
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1.4, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md border-2 border-pink-500/60 bg-card p-5 sm:p-6 shadow-[0_0_0_4px_rgba(10,10,15,0.6),0_0_60px_rgba(236,72,153,0.35)]"
      >
        <PixelCorners size="md" className="border-pink-500/60" />

        <div className="text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center border-2 border-pink-500/50 bg-pink-500/10">
            <TrophyIcon className="h-7 w-7 text-pink-400" />
          </div>
          <p className="mt-3 font-pixel text-[9px] tracking-widest text-ink-muted">
            ◆ TU HALL OF FAME
          </p>
          <h2 className="mt-2 font-pixel text-base sm:text-lg leading-relaxed text-pink-400 [text-shadow:0_0_18px_rgba(236,72,153,0.6)]">
            COMO FUNCIONA
          </h2>
        </div>

        <ul className="mt-5 flex flex-col gap-3 font-pixel-mono text-base sm:text-lg text-ink/95 leading-snug">
          <li className="flex items-start gap-2">
            <span className="text-pink-400" aria-hidden="true">
              ✓
            </span>
            <span>
              Cada <strong>logro</strong> premia un hito: peso movido, racha,
              dias seguidos, dieta cumplida, etc.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-400" aria-hidden="true">
              ✓
            </span>
            <span>
              Los <strong>desbloqueados</strong> aparecen primero, ordenados por
              fecha. Los demas siguen visibles como guia.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-400" aria-hidden="true">
              ✓
            </span>
            <span>
              Se desbloquean <strong>automaticamente</strong> cuando cumples la
              condicion: no hay que hacer nada extra.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-400" aria-hidden="true">
              ✓
            </span>
            <span>
              Sigue entrenando y completando tu dieta para que la lista se vaya
              llenando.
            </span>
          </li>
        </ul>

        <p className="mt-4 border-2 border-pink-500/40 bg-pink-500/10 p-3 font-pixel-mono text-base sm:text-lg text-pink-200/95 leading-snug">
          ★ Cada logro nuevo se queda guardado en tu perfil para siempre.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full font-pixel text-[10px] tracking-widest bg-pink-500 hover:bg-pink-400 text-[#0a0a0f] px-5 py-3 border-b-4 border-pink-700 hover:border-pink-600 active:border-b-0 active:mt-[1.40625rem] transition-all duration-150 shadow-[0_0_18px_rgba(236,72,153,0.45)]"
        >
          ▶ ENTENDIDO
        </button>
      </motion.div>
    </div>,
    document.body
  );
};
