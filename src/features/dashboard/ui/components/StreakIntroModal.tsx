import { FireIcon } from '@heroicons/react/24/solid';
import { PixelCorners } from '@shared/components/PixelCorners';
import { useBodyScrollLock } from '@shared/hooks/useBodyScrollLock';
import { useEscapeClose } from '@shared/hooks/useEscapeClose';
import { motion, useReducedMotion } from 'framer-motion';
import { createPortal } from 'react-dom';

interface StreakIntroModalProps {
  open: boolean;
  /**
   * The user's weekly target (sessions per week needed to keep the
   * racha alive). Comes from /streak/status; default to 3 only as a
   * defensive fallback if status hasn't loaded yet — the modal
   * shouldn't open in that state but the prop must be safe.
   */
  weeklyTarget: number;
  onClose: () => void;
}

/**
 * One-time explainer that fires the first time a brand-new user lands
 * on the dashboard. Reads the streak rules upfront so they don't have
 * to reverse-engineer them from the "X / Y esta semana" counter:
 *
 *   - Each ISO week with ≥ target sessions counts as +1 to the racha.
 *   - The first week is grace — you can finish it under-target without
 *     losing the streak (`liveStreak` only kills it after 1 full week
 *     gap, so the in-flight current week is always safe).
 *   - From the second week onwards, missing the target resets to 0.
 *   - Sunday is the deadline.
 *
 * Dismissed via "ENTENDIDO" → localStorage flag → never re-shown for
 * that user. Same pattern as OriginStoryIntro.
 */
export const StreakIntroModal = ({
  open,
  weeklyTarget,
  onClose,
}: StreakIntroModalProps): React.JSX.Element | null => {
  const prefersReducedMotion = useReducedMotion();
  useBodyScrollLock(open);
  useEscapeClose(open, onClose);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Como funciona la racha"
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1.4, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md border-2 border-orange-500/60 bg-card p-5 sm:p-6 shadow-[0_0_0_4px_rgba(10,10,15,0.6),0_0_60px_rgba(249,115,22,0.35)]"
      >
        <PixelCorners size="md" className="border-orange-500/60" />

        <div className="text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center border-2 border-orange-500/50 bg-orange-500/10">
            <FireIcon className="h-7 w-7 text-orange-400" />
          </div>
          <p className="mt-3 font-pixel text-[9px] tracking-widest text-ink-muted">
            ◆ TU RACHA SEMANAL
          </p>
          <h2 className="mt-2 font-pixel text-base sm:text-lg leading-relaxed text-orange-400 [text-shadow:0_0_18px_rgba(249,115,22,0.6)]">
            COMO FUNCIONA
          </h2>
        </div>

        <ul className="mt-5 flex flex-col gap-3 font-pixel-mono text-base text-ink/95 leading-snug">
          <li className="flex items-start gap-2">
            <span className="text-orange-400" aria-hidden="true">
              ✓
            </span>
            <span>
              Cada semana que entrenes <strong>{weeklyTarget}</strong>{' '}
              {weeklyTarget === 1 ? 'sesion' : 'sesiones'} suma{' '}
              <strong>+1</strong> a tu racha.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400" aria-hidden="true">
              ✓
            </span>
            <span>
              Tienes hasta el <strong>domingo</strong> para asegurar la semana.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400" aria-hidden="true">
              ✓
            </span>
            <span>
              La <strong>primera semana es de gracia</strong>: aunque no
              llegues, no pierdes la racha.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400" aria-hidden="true">
              ✗
            </span>
            <span>
              A partir de la segunda, si no cumples el objetivo, la racha vuelve
              a <strong>0</strong>.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400" aria-hidden="true">
              ✓
            </span>
            <span>
              Puedes cambiar tu objetivo semanal en <strong>perfil</strong>{' '}
              cuando quieras.
            </span>
          </li>
        </ul>

        {/* Reward callout — distinct green border because "you'll get
            stronger" reads as a positive payoff, not another rule.
            Tenacity and Vigor are the two pillars whose XP comes from
            consistency rather than per-set lift volume, so they're
            the natural beneficiaries of a healthy racha (matches the
            STAT_SOURCES copy on the OriginStoryIntro). */}
        <p className="mt-4 border-2 border-green-500/40 bg-green-500/10 p-3 font-pixel-mono text-base text-green-200/95 leading-snug">
          ★ Mantener la racha sube tu <strong>Tenacidad</strong> y tu{' '}
          <strong>Vigor</strong> cada sesion.
        </p>

        {/* Re-trigger hint — by default the modal only fires once per
            user. The fire icon on the dashboard's racha card opens
            it again on demand. We render the actual FireIcon glyph
            inline (instead of the word "fueguito") so the hint is a
            visual mirror of the affordance the user has to find on
            the dashboard. `align-text-bottom` keeps the icon riding
            on the same baseline as the surrounding pixel-mono text. */}
        <p className="mt-3 font-pixel-mono text-base text-ink-faint leading-snug text-center">
          Pulsa el{' '}
          <FireIcon
            aria-hidden="true"
            className="inline-block h-4 w-4 align-text-bottom text-orange-400"
          />{' '}
          de la racha en inicio si quieres releer esto.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full font-pixel text-[10px] tracking-widest bg-orange-500 hover:bg-orange-400 text-[#0a0a0f] px-5 py-3 border-b-4 border-orange-700 hover:border-orange-600 active:border-b-0 active:mt-[1.40625rem] transition-all duration-150 shadow-[0_0_18px_rgba(249,115,22,0.45)]"
        >
          ▶ ENTENDIDO
        </button>
      </motion.div>
    </div>,
    document.body
  );
};
