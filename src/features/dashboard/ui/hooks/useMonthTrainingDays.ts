import { API_ENDPOINTS } from '@config/api';
import { useAuth } from '@context/hooks/useAuth';
import { cachedGet } from '@shared/api/cachedGet';
import { mapAxiosError } from '@shared/api/error-mapping/mapApiError';
import { useEffect, useState } from 'react';

/**
 * Fetches the distinct training dates inside the calendar month `(year,
 * monthIndex)` from the new `/sessions/training-days` endpoint.
 *
 * Drives the dashboard streak calendar when the user navigates back to
 * past months — the cards endpoint only returns the *current ISO week*,
 * which is enough for the "X/Y esta semana" hint but leaves the rest
 * of the month grid grey even on power users.
 *
 * Re-fetches whenever the visible month changes (the calendar's
 * arrows). Returns an empty list while loading or on error to avoid
 * flashing a stale month's dots when the user scrolls quickly.
 */
export const useMonthTrainingDays = (
  year: number,
  monthIndex: number
): { days: string[]; loading: boolean; error: string | null } => {
  const { token } = useAuth();
  const [days, setDays] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setDays([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    // Local-date YYYY-MM-DD strings — same convention as
    // `localTodayISO` server-side and the DATE columns in `sessions`.
    // Using `new Date(year, monthIndex+1, 1)` for `to` gives the first
    // day of the next month, matching the server's half-open `[from, to)`
    // interval.
    const pad = (n: number): string => String(n).padStart(2, '0');
    const from = `${year}-${pad(monthIndex + 1)}-01`;
    const nextMonthIdx = monthIndex + 1;
    const toYear = nextMonthIdx > 11 ? year + 1 : year;
    const toMonth = nextMonthIdx > 11 ? 0 : nextMonthIdx;
    const to = `${toYear}-${pad(toMonth + 1)}-01`;

    // 60s TTL keyed on (from, to). Walking back/forward through months
    // collapses to a single fetch per visited month; returning to a
    // previously-viewed month is free until the cache expires.
    cachedGet<{ days: string[] }>(API_ENDPOINTS.getTrainingDays, {
      params: { from, to },
      ttlMs: 60_000,
    })
      .then((data) => {
        if (cancelled) return;
        setDays(data.days ?? []);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          mapAxiosError(
            err,
            'No hemos podido cargar tu calendario de entrenos.'
          )
        );
        setDays([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, year, monthIndex]);

  return { days, loading, error };
};
