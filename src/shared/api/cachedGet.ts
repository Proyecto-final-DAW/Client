import axios from 'axios';

/**
 * Tiny TTL cache + in-flight dedupe for read-only API calls.
 *
 * Why:
 *   - Neon's free tier bills compute time; every GET that wakes the DB
 *     extends the "alive" window by ~5 minutes (autosuspend). Cutting
 *     redundant GETs is the single biggest lever to stay under the
 *     100 CU-hours/month quota.
 *   - Most of our dashboard fetches are idempotent and the data
 *     doesn't change between two navigations 5 seconds apart (cards,
 *     stats, streak status, character state, stats history). Caching
 *     them for 30-60 seconds removes 80%+ of the repeat reads with no
 *     visible staleness.
 *   - Hooks that fetch on every mount (and most of ours do) hit this
 *     cache instead of the network when the user toggles between
 *     `/inicio` and `/progreso` and back, or when React StrictMode
 *     double-mounts in dev.
 *
 * Anatomy:
 *   - `store` — value + expiry per cache key. Keys are URL + sorted
 *     params, so `?from=A&to=B` and `?to=B&from=A` collapse.
 *   - `inflight` — pending promise per key. A second caller hitting
 *     the same key while a request is mid-flight gets the SAME
 *     promise instead of firing a duplicate request. Critical for
 *     React StrictMode (two mounts back-to-back) and for sibling
 *     components requesting the same endpoint.
 *
 * Invalidation:
 *   - `invalidate(prefix)` — drop entries whose key starts with the
 *     given URL prefix. Used after writes that affect the cached
 *     read (e.g. session save → invalidate `/users/cards`, `/users/stats`).
 *   - `clearAllCache()` — drop everything. Used on logout so the
 *     next user's reads don't see the previous user's payloads.
 *
 * Not used for:
 *   - POST / PUT / DELETE — they always go through plain `axios`.
 *   - Authentication endpoints — sensitive paths shouldn't be cached.
 *   - One-off queries that are already cheap and rare (e.g. catalog).
 */

interface CacheEntry {
  value: unknown;
  expires: number;
}

const store = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<unknown>>();

const buildKey = (url: string, params?: Record<string, unknown>): string => {
  if (!params) return url;
  const sorted = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .sort(([a], [b]) => a.localeCompare(b));
  if (sorted.length === 0) return url;
  return `${url}?${JSON.stringify(sorted)}`;
};

interface CachedGetOptions {
  /** Override the default 30-second TTL. */
  ttlMs?: number;
  /** Skip the cache for this single call (still updates the cache on
   *  response). Useful for explicit `refetch()` actions where the user
   *  wants a fresh value. */
  forceFresh?: boolean;
  params?: Record<string, unknown>;
}

const DEFAULT_TTL_MS = 30_000;

export const cachedGet = async <T>(
  url: string,
  options: CachedGetOptions = {}
): Promise<T> => {
  const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
  const key = buildKey(url, options.params);
  const now = Date.now();

  if (!options.forceFresh) {
    const cached = store.get(key);
    if (cached && cached.expires > now) {
      return cached.value as T;
    }
    const pending = inflight.get(key);
    if (pending) {
      return pending as Promise<T>;
    }
  }

  // Skip the network when the tab is in the background and we still
  // have ANY value (even an expired one) in cache. Background
  // refetches were waking Neon's compute every time a stale event
  // ticked while the tab was minimised — pure waste, since the user
  // can't see the result anyway. When they come back the next
  // visible-state fetch will refresh.
  if (
    !options.forceFresh &&
    typeof document !== 'undefined' &&
    document.visibilityState === 'hidden'
  ) {
    const stale = store.get(key);
    if (stale) return stale.value as T;
  }

  const requestConfig = options.params ? { params: options.params } : undefined;
  const promise = axios
    .get<T>(url, requestConfig)
    .then((response) => {
      store.set(key, {
        value: response.data,
        expires: Date.now() + ttlMs,
      });
      inflight.delete(key);
      return response.data;
    })
    .catch((err: unknown) => {
      inflight.delete(key);
      throw err;
    });

  inflight.set(key, promise);
  return promise;
};

/**
 * Drop cache entries whose key starts with `urlPrefix`. Pass the same
 * URL you passed to `cachedGet` — params are appended after the base
 * URL so a prefix-match catches every variant of the same endpoint.
 *
 * Call after any write that invalidates the cached read. Example:
 * after `POST /sessions`, invalidate `/users/cards`, `/users/stats`,
 * `/sessions/weekly-summary`, `/stats/history`, `/sessions/training-days`.
 */
export const invalidateCache = (urlPrefix: string): void => {
  for (const key of store.keys()) {
    if (key.startsWith(urlPrefix)) {
      store.delete(key);
    }
  }
};

/**
 * Wipe the entire cache. Wired to logout so account A's payloads
 * never reach account B's read on the same browser session.
 */
export const clearAllCache = (): void => {
  store.clear();
  inflight.clear();
};
