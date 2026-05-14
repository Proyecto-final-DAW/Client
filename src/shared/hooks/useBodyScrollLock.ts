import { useEffect } from 'react';

/**
 * Locks `<body>` scroll while a modal/dialog is open. Without this,
 * tapping/swiping outside the modal scrolls the underlying page
 * through the backdrop, which feels broken on phone (the user
 * believes the modal is fixed; the page beneath says otherwise).
 *
 * Implemented as a module-level reference count so multiple modals can
 * stack without trampling each other's saved `overflow` value. The
 * previous "snapshot previous, restore on cleanup" pattern leaked the
 * lock when two locks overlapped: modal A would snapshot `''`, modal B
 * (mounting while A was open) would snapshot `'hidden'`, and when A
 * unlocked first it restored `''` — but B's cleanup then restored
 * `'hidden'`, leaving the body permanently unscrollable. The user hit
 * exactly this path: a TierUpModal opened, the dashboard navigated to
 * the class tree (also a lock), and the close order pinned `overflow`
 * to `hidden` forever. Hard refresh was the only workaround.
 *
 * Counter semantics: the first locker snapshots `body.style.overflow`
 * and switches it to `hidden`; every subsequent locker just bumps the
 * count; the last unlocker restores the original value. Nobody else
 * should write `body.style.overflow` directly — route every modal
 * through this hook so the count stays accurate.
 */

let lockCount = 0;
let previousOverflow: string | null = null;

export const useBodyScrollLock = (open: boolean): void => {
  useEffect(() => {
    if (!open) return;
    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    lockCount += 1;
    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        document.body.style.overflow = previousOverflow ?? '';
        previousOverflow = null;
      }
    };
  }, [open]);
};
