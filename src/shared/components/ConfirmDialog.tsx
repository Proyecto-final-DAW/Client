import { useEffect, useRef } from 'react';

import { PixelCorners } from './PixelCorners';

type Variant = 'danger' | 'neutral';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: Variant;
  onConfirm: () => void;
  onCancel: () => void;
};

const VARIANT_BORDER: Record<Variant, string> = {
  danger: 'border-red-500/60',
  neutral: 'border-green-500/60',
};

const VARIANT_GLOW: Record<Variant, string> = {
  danger: 'shadow-[0_0_0_4px_rgba(10,10,15,0.8),0_0_60px_rgba(239,68,68,0.35)]',
  neutral:
    'shadow-[0_0_0_4px_rgba(10,10,15,0.8),0_0_60px_rgba(34,197,94,0.35)]',
};

const VARIANT_TITLE: Record<Variant, string> = {
  danger:
    "font-['Press_Start_2P'] text-[11px] tracking-widest text-red-400 [text-shadow:0_0_12px_rgba(239,68,68,0.55)]",
  neutral:
    "font-['Press_Start_2P'] text-[11px] tracking-widest text-green-400 [text-shadow:0_0_12px_rgba(34,197,94,0.55)]",
};

const VARIANT_PREFIX: Record<Variant, string> = {
  danger: '✕',
  neutral: '◆',
};

const VARIANT_BUTTON: Record<Variant, string> = {
  danger:
    "font-['Press_Start_2P'] text-[9px] tracking-widest bg-red-500 text-[#0a0a0f] px-4 py-3 border-b-4 border-red-700 hover:bg-red-400 hover:border-red-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(239,68,68,0.35)]",
  neutral:
    "font-['Press_Start_2P'] text-[9px] tracking-widest bg-green-500 text-[#0a0a0f] px-4 py-3 border-b-4 border-green-700 hover:bg-green-400 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)]",
};

/**
 * App-wide RPG-styled confirm modal. Replaces `window.confirm` calls — those
 * pop up the browser-native dialog which clashes with the pixel UI.
 *
 * `variant` controls the accent color: `danger` (red, default) for destructive
 * actions, `neutral` (green) for neutral confirmations.
 */
export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'BORRAR',
  cancelLabel = 'CANCELAR',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <div
        className={`relative w-full max-w-md border-2 bg-[#0d0d14] p-6 ${VARIANT_BORDER[variant]} ${VARIANT_GLOW[variant]}`}
      >
        <PixelCorners size="md" className={VARIANT_BORDER[variant]} />

        <h3 id="confirm-title" className={VARIANT_TITLE[variant]}>
          {VARIANT_PREFIX[variant]} {title.toUpperCase()}
        </h3>

        {description && (
          <p className="mt-3 font-['Press_Start_2P'] text-base leading-tight text-[#a1a1aa]">
            {description}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="font-['Press_Start_2P'] text-[9px] tracking-widest border-2 border-[#27272a] bg-[#0d0d14] text-[#a1a1aa] px-4 py-3 hover:border-[#3f3f46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={VARIANT_BUTTON[variant]}
          >
            ▶ {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
