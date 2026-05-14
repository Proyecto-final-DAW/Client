import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Moves keyboard focus to the page heading on every route change.
 *
 * Without this, after a `<Navigate to="/dashboard">` (or any other
 * SPA navigation) the focus stayed on whatever element triggered the
 * navigation — often a button that's now unmounted, in which case
 * focus collapses to `<body>`. A screen-reader user then has to
 * tab from the top of the new page on every navigation.
 *
 * Strategy: focus the first `<h1>` (or the `<main>` element if no h1
 * exists) and scroll to top. The h1 needs `tabIndex={-1}` to be
 * focusable; pages that don't set that get the `<main>` fallback.
 */
export const RouteFocusManager = (): null => {
  const location = useLocation();

  useEffect(() => {
    // Scroll always: SPA navigations preserve scroll otherwise, so
    // the user can land mid-page after going from a long list to a
    // detail screen.
    window.scrollTo(0, 0);

    const target =
      (document.querySelector('main h1') as HTMLElement | null) ??
      (document.querySelector('main') as HTMLElement | null);
    if (target) {
      // Save the existing tabIndex so we don't permanently leave
      // `tabIndex=-1` on an h1 that wasn't authored that way.
      const previous = target.getAttribute('tabindex');
      if (previous === null) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      if (previous === null) {
        target.addEventListener(
          'blur',
          () => target.removeAttribute('tabindex'),
          { once: true }
        );
      }
    }
  }, [location.pathname]);

  return null;
};
