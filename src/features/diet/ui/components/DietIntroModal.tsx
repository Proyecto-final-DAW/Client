import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { PixelCorners } from '@shared/components/PixelCorners';
import { useBodyScrollLock } from '@shared/hooks/useBodyScrollLock';
import { useEscapeClose } from '@shared/hooks/useEscapeClose';
import { motion, useReducedMotion } from 'framer-motion';
import { createPortal } from 'react-dom';

interface DietIntroModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * One-time explainer for the diet log, mirroring StreakIntroModal in
 * structure and dismiss behaviour:
 *
 *   - Fires once per user the first time they land on /diet.
 *   - Stored in localStorage under `diet_intro_seen_{userId}` so a
 *     second account on the same browser sees its own copy.
 *   - Click outside / ESC / "ENTENDIDO" all close + persist the flag.
 *
 * Copy focuses on what the daily log actually *does* for the player
 * (vigor XP). The wording uses "completar la dieta" everywhere — the
 * earlier "loguear" implied a separate journaling step the app
 * doesn't have, and "second tap doesn't add XP" was misleading
 * because the button locks itself once the day is complete.
 */
export const DietIntroModal = ({
  open,
  onClose,
}: DietIntroModalProps): React.JSX.Element | null => {
  const prefersReducedMotion = useReducedMotion();
  useBodyScrollLock(open);
  useEscapeClose(open, onClose);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Como funciona la dieta"
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1.4, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md border-2 border-green-500/60 bg-card p-5 sm:p-6 shadow-[0_0_0_4px_rgba(10,10,15,0.6),0_0_60px_rgba(34,197,94,0.35)]"
      >
        <PixelCorners size="md" className="border-green-500/60" />

        <div className="text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center border-2 border-green-500/50 bg-green-500/10">
            <CheckCircleIcon className="h-7 w-7 text-green-400" />
          </div>
          <p className="mt-3 font-pixel text-[9px] tracking-widest text-ink-muted">
            ◆ TU DIETA DIARIA
          </p>
          <h2 className="mt-2 font-pixel text-base sm:text-lg leading-relaxed text-green-400 [text-shadow:0_0_18px_rgba(34,197,94,0.6)]">
            COMO FUNCIONA
          </h2>
        </div>

        <ul className="mt-5 flex flex-col gap-3 font-pixel-mono text-lg text-ink/95 leading-snug">
          <li className="flex items-start gap-2">
            <span className="text-green-400" aria-hidden="true">
              ✓
            </span>
            <span>
              Calculamos tus <strong>calorias</strong> y <strong>macros</strong>{' '}
              a partir de tu peso, altura, edad y objetivo.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400" aria-hidden="true">
              ✓
            </span>
            <span>
              Pulsa <strong>COMPLETAR DIETA</strong> cuando hayas cumplido tu
              plan del dia. Solo se puede una vez al dia.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400" aria-hidden="true">
              ✓
            </span>
            <span>
              Tu <strong>racha de dieta</strong> sube cada dia que la completas
              y se reinicia si te saltas uno.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400" aria-hidden="true">
              ✓
            </span>
            <span>
              Si cambias tu objetivo o tu peso en <strong>perfil</strong>, los
              numeros se recalculan solos.
            </span>
          </li>
        </ul>

        {/* Reward callout — same green-on-green positive frame as the
            streak modal. Vigor is the stat directly fed by the daily
            diet log, so naming it explicitly tells the user what their
            consistency is buying. Wording aligns with the bullets
            above ("completas la dieta") so the user reads a single
            consistent action, not "log" vs "complete". */}
        <p className="mt-4 border-2 border-green-500/40 bg-green-500/10 p-3 font-pixel-mono text-lg text-green-200/95 leading-snug">
          ★ Cada dia que completas la dieta sube tu <strong>Vigor</strong>.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full font-pixel text-[10px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-5 py-3 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-[1.40625rem] transition-all duration-150 shadow-[0_0_18px_rgba(34,197,94,0.45)]"
        >
          ▶ ENTENDIDO
        </button>
      </motion.div>
    </div>,
    document.body
  );
};
