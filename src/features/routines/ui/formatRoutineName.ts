import type { Routine } from '../core/domain/models/Routine';

const NEW_FORMAT = /^Dia \d+ ·/;

/**
 * Display-time formatter so the UI shows a short, scannable label regardless
 * of when the routine was created.
 *
 * - New routines (created via `useApplyTemplate` in its current form) are
 *   already saved as `"Dia N · <body part>"` — returned verbatim.
 * - Legacy routines created by the older code carry the template name as a
 *   prefix and a methodology suffix, e.g.
 *   `"Upper/Lower — Gimnasio 4 dias — Tren inferior — Hipertrofia"`. We
 *   keep only the body-part segment (second-to-last) so the label stays
 *   short and matches the new format's spirit.
 * - Manually-named routines (no ` — ` separator) are returned unchanged.
 */
export const formatRoutineName = (routine: Routine): string => {
  const name = routine.name;
  if (NEW_FORMAT.test(name)) return name;

  const segments = name.split(' — ');
  if (segments.length >= 3) {
    return segments[segments.length - 2];
  }
  if (segments.length === 2) {
    return segments[0];
  }
  return name;
};
