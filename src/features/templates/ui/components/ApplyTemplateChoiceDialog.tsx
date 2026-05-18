import { PixelCorners } from '@shared/components/PixelCorners';
import { useBodyScrollLock } from '@shared/hooks/useBodyScrollLock';
import { useEscapeClose } from '@shared/hooks/useEscapeClose';
import { motion, useReducedMotion } from 'framer-motion';
import { createPortal } from 'react-dom';

interface ApplyTemplateChoiceDialogProps {
  open: boolean;
  /**
   * How many routines the user already has. Surfaced in the body so
   * the user makes the choice with the actual number in front of
   * them ("you have 8 routines"), not an abstract one.
   */
  existingCount: number;
  /** Number of days the new template will create. */
  incomingCount: number;
  /** Replace = wipe existing routines first, then apply the template. */
  onReplace: () => void;
  /** Add = keep existing routines, append the template's days. */
  onAdd: () => void;
  /** Cancel = close, do nothing. */
  onCancel: () => void;
}

/**
 * Three-way choice surfaced when the user applies a template while
 * already having routines. The "stacking" UX (always-add) was the
 * source of the panteon-de-rutinas problem the user hit: 8 days from
 * 3 different templates piling up with nearly-identical names.
 *
 * Layout: stacked buttons (REEMPLAZAR primary destructive, AÑADIR
 * neutral, CANCELAR ghost) so the user reads the consequence before
 * tapping. ConfirmDialog only supports binary confirm/cancel, hence
 * this tailored component.
 */
export const ApplyTemplateChoiceDialog = ({
  open,
  existingCount,
  incomingCount,
  onReplace,
  onAdd,
  onCancel,
}: ApplyTemplateChoiceDialogProps): React.JSX.Element | null => {
  const prefersReducedMotion = useReducedMotion();
  useBodyScrollLock(open);
  useEscapeClose(open, onCancel);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Aplicar plantilla"
      onClick={onCancel}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md border-2 border-green-500/60 bg-card p-5 sm:p-6 shadow-[0_0_0_4px_rgba(10,10,15,0.6),0_0_60px_rgba(34,197,94,0.3)]"
      >
        <PixelCorners size="md" className="border-green-500/60" />

        <p className="font-pixel text-[9px] tracking-widest text-ink-muted text-center">
          APLICAR PLANTILLA
        </p>
        <h2 className="mt-2 text-center font-pixel text-base sm:text-lg leading-relaxed text-green-400 [text-shadow:0_0_18px_rgba(34,197,94,0.55)]">
          YA TIENES RUTINAS
        </h2>

        <p className="mt-4 font-pixel-mono text-base leading-snug text-ink/95">
          Esta plantilla crea <strong>{incomingCount}</strong>{' '}
          {incomingCount === 1 ? 'rutina' : 'rutinas'}. Tu ya tienes{' '}
          <strong>{existingCount}</strong>{' '}
          {existingCount === 1 ? 'guardada' : 'guardadas'}. ¿Que prefieres
          hacer?
        </p>

        <div className="mt-5 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onReplace}
            className="w-full font-pixel text-[10px] tracking-widest bg-red-500 hover:bg-red-400 text-[#0a0a0f] px-5 py-3 border-b-4 border-red-700 hover:border-red-600 active:border-b-0 active:mt-[1.40625rem] transition-all duration-150 shadow-[0_0_18px_rgba(239,68,68,0.4)]"
          >
            ✕ REEMPLAZAR LAS MIAS
          </button>
          <button
            type="button"
            onClick={onAdd}
            className="w-full font-pixel text-[10px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-5 py-3 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-[1.40625rem] transition-all duration-150 shadow-[0_0_18px_rgba(34,197,94,0.4)]"
          >
            ▶ AÑADIR A LAS MIAS
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full font-pixel text-[9px] tracking-widest border-2 border-border-muted bg-card text-ink-muted hover:border-[#3f3f46] px-3 py-2.5 transition-colors"
          >
            CANCELAR
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
