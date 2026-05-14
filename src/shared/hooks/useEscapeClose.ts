import { useEffect } from 'react';

/**
 * Calls `onClose` when the user presses Escape while the modal is
 * open. Mirrors the keydown effect that `ConfirmDialog`,
 * `TierUpModal`, `ClassPanteonModal` and `OriginStoryIntro` were
 * already shipping inline — extracting it as a hook so every dialog
 * supports keyboard dismissal consistently (the post-session and
 * diet-log modals previously trapped keyboard users until they
 * clicked the CTA).
 *
 * Use `capture` so the listener fires before any nested input that
 * might also handle Escape (e.g. clearing a search field) — the
 * dialog should always close first.
 */
export const useEscapeClose = (open: boolean, onClose: () => void): void => {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [open, onClose]);
};
