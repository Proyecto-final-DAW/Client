import { PixelCorners } from '@shared/components/PixelCorners';
import { useBodyScrollLock } from '@shared/hooks/useBodyScrollLock';
import { useEscapeClose } from '@shared/hooks/useEscapeClose';
import { motion, useReducedMotion } from 'framer-motion';
import { createPortal } from 'react-dom';

import type { UnlockedMilestonePreview } from '../../core/domain/models/WorkoutSummaryData';

interface Props {
  open: boolean;
  milestones: UnlockedMilestonePreview[];
  onClose: () => void;
}

/**
 * Full-attention celebration shown right after the post-session stats
 * modal closes when at least one milestone unlocked. Lives as its own
 * modal (not just a panel under the stats grid) so the user can't
 * scroll past or miss it — the stats modal can no longer "cover"
 * milestone unlocks during the celebration moment, which is the bug
 * we hit on first sessions: the logros block in WorkoutSummary was
 * visually quiet enough that the user thought nothing had unlocked.
 *
 * Stays consistent with the rest of the app's modal pattern:
 * body-scroll lock, ESC close, dimmed backdrop click-through, and a
 * single "CONTINUAR" CTA so there's only one path forward.
 */
export const PostSessionMilestonesModal = ({
  open,
  milestones,
  onClose,
}: Props): React.JSX.Element | null => {
  const prefersReducedMotion = useReducedMotion();
  useBodyScrollLock(open);
  useEscapeClose(open, onClose);

  if (!open || milestones.length === 0) return null;

  const headline =
    milestones.length === 1
      ? '¡LOGRO DESBLOQUEADO!'
      : `¡${milestones.length} LOGROS DESBLOQUEADOS!`;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Logros desbloqueados"
      onClick={onClose}
    >
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1.4, 0.36, 1],
        }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md border-2 border-green-500/60 bg-card p-5 sm:p-6 shadow-[0_0_0_4px_rgba(10,10,15,0.6),0_0_60px_rgba(34,197,94,0.35)]"
      >
        <PixelCorners size="md" className="border-green-500/60" />

        <div className="text-center mb-4">
          <p className="font-pixel text-[9px] tracking-widest text-ink-muted">
            ★ HALL OF FAME
          </p>
          <h2 className="mt-2 font-pixel text-base sm:text-lg leading-relaxed text-green-400 [text-shadow:0_0_18px_rgba(34,197,94,0.7)]">
            {headline}
          </h2>
        </div>

        <ul className="flex flex-col gap-3">
          {milestones.map((milestone, idx) => (
            <motion.li
              key={milestone.id}
              initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.2 + idx * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative border-2 border-green-500/50 bg-[#08080d]/95 p-3 shadow-[0_0_14px_rgba(34,197,94,0.25)]"
            >
              <p className="font-pixel text-[10px] tracking-widest text-green-400 [text-shadow:0_0_8px_rgba(34,197,94,0.6)]">
                {milestone.name}
              </p>
              <p className="font-pixel-mono text-base text-ink-muted mt-1.5 leading-snug">
                {milestone.description}
              </p>
            </motion.li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full font-pixel text-[10px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-5 py-3 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-[1.40625rem] transition-all duration-150 shadow-[0_0_18px_rgba(34,197,94,0.4)]"
        >
          ▶ CONTINUAR
        </button>
      </motion.div>
    </div>,
    document.body
  );
};
