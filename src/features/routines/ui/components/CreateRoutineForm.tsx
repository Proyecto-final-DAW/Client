import { useEffect, useRef, useState } from 'react';

import { PixelCorners } from '../../../../shared/components/PixelCorners';

type CreateRoutineFormProps = {
  open: boolean;
  onCreateRoutine: (name: string) => void | Promise<void>;
  onClose: () => void;
};

export const CreateRoutineForm = ({
  open,
  onCreateRoutine,
  onClose,
}: CreateRoutineFormProps) => {
  const [newRoutineName, setNewRoutineName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setNewRoutineName('');
      // Defer focus so the inline mount completes first.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  if (!open) return null;

  const handleCreateRoutine = async () => {
    const trimmedName = newRoutineName.trim();
    if (!trimmedName || submitting) return;
    setSubmitting(true);
    try {
      await onCreateRoutine(trimmedName);
      setNewRoutineName('');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative border-2 border-dashed border-green-500/40 bg-card p-4">
      <PixelCorners size="sm" className="border-green-500/40" />

      <p className="font-pixel text-[10px] tracking-widest text-green-400">
        ✦ NUEVA SESION
      </p>

      <label
        htmlFor="new-routine-name"
        className="mt-3 block font-pixel text-[9px] tracking-widest text-ink-muted"
      >
        NOMBRE
      </label>
      <input
        ref={inputRef}
        id="new-routine-name"
        type="text"
        value={newRoutineName}
        onChange={(event) => setNewRoutineName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') void handleCreateRoutine();
          if (event.key === 'Escape') onClose();
        }}
        placeholder="Ej. Dia 1 - Tren superior"
        className="mt-2 w-full bg-subtle border-2 border-border px-3 py-2.5 font-pixel text-[10px] text-ink placeholder:text-ink-disabled focus:border-green-500/70 focus:outline-none"
      />

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="font-pixel text-[9px] tracking-widest border-2 border-border-muted bg-card text-ink-muted px-4 py-2.5 hover:border-[#3f3f46] transition-colors"
        >
          CANCELAR
        </button>
        <button
          type="button"
          onClick={() => void handleCreateRoutine()}
          disabled={!newRoutineName.trim() || submitting}
          className="font-pixel text-[9px] tracking-widest bg-green-500 text-[#0a0a0f] px-4 py-2.5 border-b-4 border-green-700 hover:bg-green-400 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:mt-0"
        >
          {submitting ? 'GUARDANDO…' : '▶ GUARDAR'}
        </button>
      </div>
    </section>
  );
};
