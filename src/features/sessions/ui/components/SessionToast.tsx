import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';

type SessionToastProps = {
  open: boolean;
  message: string;
  onClose: () => void;
  durationMs?: number;
};

export const SessionToast = ({
  open,
  message,
  onClose,
  durationMs = 3000,
}: SessionToastProps) => {
  useEffect(() => {
    if (!open) return;

    const timeout = setTimeout(onClose, durationMs);
    return () => clearTimeout(timeout);
  }, [open, durationMs, onClose]);

  if (!open) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-200 shadow-lg backdrop-blur">
      <CheckCircleIcon className="h-5 w-5 text-emerald-400" />
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg p-1 text-emerald-300 transition hover:bg-emerald-500/20"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
};
