import { useEffect } from 'react';

/**
 * Locks `<body>` scroll while a modal/dialog is open. Without this,
 * tapping/swiping outside the modal scrolls the underlying page
 * through the backdrop, which feels broken on phone (the user
 * believes the modal is fixed; the page beneath says otherwise).
 *
 * Restores the previous `overflow` value on unmount or when `open`
 * flips to false, so opening a second modal after closing the first
 * doesn't leave the body permanently locked. The pattern was lifted
 * from `ClassPanteonModal` and the dashboard drawer — those locked
 * scroll correctly; the rest of the app didn't.
 */
export const useBodyScrollLock = (open: boolean): void => {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
};
