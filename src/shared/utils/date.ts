/**
 * Returns the date in local-timezone YYYY-MM-DD format.
 * Avoids the UTC shift you'd get from `Date.toISOString().split('T')[0]`.
 */
export const toISODate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parses a `YYYY-MM-DD` string as a local-midnight Date instead of
 * the UTC-midnight one `new Date(string)` would produce. Critical
 * for any "is this session today?" comparison: the server stores
 * dates as `DATE` (no time component) and emits them as YYYY-MM-DD;
 * `new Date('2026-05-09')` resolves to `2026-05-09T00:00Z`, which
 * `.toLocaleDateString()` renders as **2026-05-08** for any user
 * in a TZ behind UTC. Build the Date from explicit components so
 * the local-day stays the local-day.
 *
 * Returns `null` on malformed input rather than throwing — caller
 * decides whether a missing date is fatal.
 */
export const parseLocalDate = (yyyyMmDd: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(yyyyMmDd);
  if (!match) return null;
  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10);
  const day = Number.parseInt(match[3], 10);
  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day)
  ) {
    return null;
  }
  return new Date(year, month - 1, day);
};

/**
 * True iff `sessions` contains an entry whose date matches today in
 * the user's local timezone. Comparison is done via YYYY-MM-DD strings
 * built from local getters, so a session logged at 23:30 still reads
 * as "today" up until local midnight instead of flipping early via UTC.
 *
 * Used by both LiveWorkoutView (direct-URL guard) and RoutinesView (CTA
 * gating) — extracted here to avoid drift between two near-identical
 * inline implementations.
 */
export const hasTrainedToday = (
  sessions: readonly { date: Date }[]
): boolean => {
  const todayStr = toISODate(new Date());
  return sessions.some((s) => toISODate(s.date) === todayStr);
};
