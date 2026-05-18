import { useAuth } from '@context/hooks/useAuth';
import { EmptyState } from '@shared/components/EmptyState';
import { PixelCorners } from '@shared/components/PixelCorners';
import { PixelSelect } from '@shared/components/PixelSelect';
import { toISODate } from '@shared/utils/date';
import type React from 'react';
import { useMemo, useState } from 'react';

import { useProgress } from '../hooks/useProgress';
import { RegisterWeightForm } from './RegisterWeightForm';
import { WeightProgressChart } from './WeightProgressChart';

// Time-window options for the body-weight chart. Same shape as the
// radar's window selector; matched copy ("ULTIMO MES" / "ULTIMOS 6M"
// / "TODO") so the two progress widgets read as one family. Days are
// the lookback from now — `null` for "all time".
type WeightWindow = '1m' | '3m' | '6m' | '1y' | 'all';
const WEIGHT_WINDOW_DAYS: Record<WeightWindow, number | null> = {
  '1m': 30,
  '3m': 90,
  '6m': 180,
  '1y': 365,
  'all': null,
};
const WEIGHT_WINDOW_OPTIONS: { value: WeightWindow; label: string }[] = [
  { value: '1m', label: 'ULTIMO MES' },
  { value: '3m', label: 'ULTIMOS 3M' },
  { value: '6m', label: 'ULTIMOS 6M' },
  { value: '1y', label: 'ULTIMO AÑO' },
  { value: 'all', label: 'TODO' },
];

const DATE_FORMAT = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export const WeightProgressContent = (): React.JSX.Element => {
  const { user } = useAuth();
  const {
    weightHistory,
    loading,
    error,
    submitting,
    submitError,
    refetch,
    addEntry,
  } = useProgress();

  const [showForm, setShowForm] = useState(false);
  // Default to "todo" so the user sees the full evolution on first open;
  // narrower windows are a deliberate zoom-in via the selector.
  const [chartWindow, setChartWindow] = useState<WeightWindow>('all');

  const entries = useMemo(
    () =>
      [...(weightHistory ?? [])].sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      ),
    [weightHistory]
  );

  // Local-day comparison. `toISOString().slice(0,10)` is UTC and would
  // diverge from `toISODate()` (local getters) whenever the user's TZ
  // is ahead of UTC — the real weight_log entry, built via
  // `parseLocalDate(...)`, lives at local midnight (= previous UTC day
  // in CET/CEST), while `onboardingDate` keeps the literal Postgres
  // timestamp; isoToString would say they're different days even when
  // both are Jan 12. That mismatch made the synthetic onboarding
  // weight (75 kg) sneak past the dedupe check and paint a second
  // marker on top of the real Jan-12 entry, producing the 78→75→78
  // zig-zag the user saw at the start of the chart.
  const localDay = (d: Date): string => toISODate(d);

  // The current weight is the most recent entry. Surfacing it next to the
  // "Registrar peso" button lets the user decide whether they need to add
  // a new measurement at all.
  const latest = entries.length > 0 ? entries[entries.length - 1] : null;
  // When the user has no logged entries yet, surface the onboarding weight
  // as the "starting point" so the panel never feels empty for someone who
  // just finished onboarding.
  //
  // The server stores `weight` as a Postgres DECIMAL, which `pg` returns
  // as a string ("69.0") to avoid float precision loss. The previous
  // `typeof === 'number'` guard rejected that string and silently dropped
  // the onboarding weight from the panel — accept either number or
  // numeric string and coerce.
  const onboardingWeight = ((): number | null => {
    const raw = user?.weight as number | string | null | undefined;
    if (raw === null || raw === undefined || raw === '') return null;
    const n = typeof raw === 'number' ? raw : Number(raw);
    return Number.isFinite(n) ? n : null;
  })();
  // Account creation date is the "starting point" when no weight has been
  // logged yet — pairs with the onboarding weight to give the user a real
  // anchor instead of the literal word "onboarding".
  const onboardingDate = (() => {
    if (!user?.created_at) return null;
    const parsed = new Date(user.created_at);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  })();

  // Chart-only entries: prepend the onboarding weight as the very first
  // point so the user immediately sees their evolution from day zero,
  // even with a single registered weight afterwards. The synthetic point
  // is suppressed if a real entry already exists on the same day —
  // plotting two markers stacked at the same x looks broken.
  //
  // Also collapse any (user, day) duplicates that may already live in
  // the BD from before the server-side "one row per day" fix landed
  // (DELETE+INSERT in progress.service / profile.service). Without
  // this defensive step the chart would still render two stacked
  // points labelled "18 may" because every recharts data point gets
  // its own x slot, even when the labels collide. We keep the LAST
  // entry per day (most recent insert wins) which mirrors the new
  // server policy.
  const chartEntriesAll = useMemo(() => {
    const dedupedByDay = (() => {
      const map = new Map<string, (typeof entries)[number]>();
      for (const entry of entries) {
        map.set(localDay(entry.date), entry);
      }
      return Array.from(map.values()).sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      );
    })();

    if (onboardingWeight === null || onboardingDate === null) {
      return dedupedByDay;
    }
    const sameDay = dedupedByDay.some(
      (e) => localDay(e.date) === localDay(onboardingDate)
    );
    if (sameDay) return dedupedByDay;
    return [
      { date: onboardingDate, weight: onboardingWeight },
      ...dedupedByDay,
    ].sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [entries, onboardingWeight, onboardingDate]);

  // Apply the active time-window filter on top of the full series. The
  // "PESO ACTUAL" header above keeps reading the most recent real entry
  // (`latest`) regardless of the window — narrowing the chart shouldn't
  // hide the user's current weight, only the historical context behind
  // it.
  const chartEntries = useMemo(() => {
    const days = WEIGHT_WINDOW_DAYS[chartWindow];
    if (days === null) return chartEntriesAll;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffMs = cutoff.getTime();
    return chartEntriesAll.filter((e) => e.date.getTime() >= cutoffMs);
  }, [chartEntriesAll, chartWindow]);

  if (loading) {
    return (
      <section className="relative border-2 border-border bg-card p-5">
        <PixelCorners size="sm" className="border-green-500/30" />
        <p className="font-pixel text-[10px] tracking-widest text-ink-muted">
          CARGANDO PROGRESO…
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative border-2 border-red-500/40 bg-card p-5">
        <PixelCorners size="sm" className="border-red-500/40" />
        <p className="font-pixel-mono text-xl leading-snug text-red-300">
          {error}
        </p>
        <button
          type="button"
          onClick={refetch}
          className="mt-4 font-pixel text-[9px] tracking-widest bg-red-500 text-[#0a0a0f] px-4 py-2.5 border-b-4 border-red-700 hover:bg-red-400 active:border-b-0 active:mt-[1.0625rem] transition-all"
        >
          ▶ REINTENTAR
        </button>
      </section>
    );
  }

  return (
    <section className="relative border-2 border-green-500/40 bg-card p-5">
      <PixelCorners size="md" className="border-green-500/40" />

      {/* Header: stat row + action button. Stacks at narrow widths so
          the kg/date line stays on a single line — the side-by-side
          layout in /progress put both columns under ~360px each, where
          the previous sm:flex-row crammed weight + date + button into
          one row and forced the date to wrap mid-string. */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="font-pixel text-[9px] tracking-widest text-green-500">
            {latest ? 'PESO ACTUAL' : 'PESO INICIAL'}
          </p>
          {latest ? (
            <p className="mt-2 font-pixel text-base sm:text-lg text-green-400 [text-shadow:0_0_12px_rgba(34,197,94,0.5)] flex flex-wrap items-baseline gap-x-2 gap-y-1">
              {latest.weight.toFixed(1)} kg
              <span className="ml-2 font-pixel-mono text-base text-ink-muted">
                · {DATE_FORMAT.format(latest.date)}
              </span>
            </p>
          ) : onboardingWeight !== null ? (
            <p className="mt-2 font-pixel text-base sm:text-lg text-green-400 [text-shadow:0_0_12px_rgba(34,197,94,0.5)] flex flex-wrap items-baseline gap-x-2 gap-y-1">
              {onboardingWeight.toFixed(1)} kg
              {onboardingDate ? (
                <span className="ml-2 font-pixel-mono text-base text-ink-muted">
                  · {DATE_FORMAT.format(onboardingDate)}
                </span>
              ) : null}
            </p>
          ) : (
            <p className="mt-2 font-pixel text-base text-ink-muted">
              Sin registros aun
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          className="self-start font-pixel text-[9px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-3 py-2 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_12px_rgba(34,197,94,0.3)] whitespace-nowrap"
        >
          {showForm ? '✕ CANCELAR' : '▶ REGISTRAR'}
        </button>
      </div>

      {showForm && (
        <div className="mb-5">
          <RegisterWeightForm
            submitting={submitting}
            submitError={submitError}
            onSubmit={addEntry}
            onSuccess={() => setShowForm(false)}
          />
        </div>
      )}

      {chartEntriesAll.length === 0 ? (
        <EmptyState
          icon="⚖"
          title="Sin registros de peso"
          description="Empieza a registrar tu peso para ver tu progreso."
          cta={{
            label: 'Registra tu peso',
            onClick: () => setShowForm(true),
          }}
        />
      ) : (
        <div className="space-y-3">
          {/* Time-window selector for the chart only — keeps PESO ACTUAL
              header above always pinned to the most recent entry.
              Same gating policy as the radar's window selector: only
              expose options whose lookback the data actually reaches.
              A user with three days of pesajes saw "ULTIMO AÑO" /
              "ULTIMOS 6M" in the dropdown — every pick yielded the
              same chart because there was nothing older to filter
              out. Hidden entirely when only "TODO" remains. */}
          {(() => {
            const oldestEntry = chartEntriesAll[0];
            const daysOfHistory = oldestEntry
              ? Math.floor(
                  (Date.now() - oldestEntry.date.getTime()) / 86_400_000
                )
              : 0;
            const visibleWindowOptions = WEIGHT_WINDOW_OPTIONS.filter(
              (option) => {
                if (option.value === 'all') return true;
                const days = WEIGHT_WINDOW_DAYS[option.value];
                return days !== null && daysOfHistory >= days;
              }
            );
            if (visibleWindowOptions.length <= 1) return null;
            return (
              <div className="flex items-center justify-end">
                <PixelSelect
                  value={chartWindow}
                  options={visibleWindowOptions}
                  placeholder="TODO"
                  onChange={(value) => setChartWindow(value as WeightWindow)}
                  ariaLabel="Ventana de tiempo del peso"
                  className="w-36"
                />
              </div>
            );
          })()}
          {chartEntries.length === 0 ? (
            // The user filtered to a window with no entries (e.g. only
            // historic data and chose "ULTIMO MES"). Don't render an
            // empty chart — explain why instead.
            <p className="text-center font-pixel-mono text-base leading-snug text-ink-muted">
              Sin pesajes registrados en este periodo.
            </p>
          ) : (
            // `key` forces React to unmount the old chart and mount a
            // fresh one whenever the active window changes. Without
            // this, recharts saw "same chart, different data" and
            // tweened the line/dot positions from the old shape to
            // the new one — the user saw a flat 1M line warp into
            // the 3M curve before any draw animation could fire.
            // With the key the old chart leaves and the new one
            // plays its proper intro draw from scratch.
            <WeightProgressChart
              entries={chartEntries}
              key={`${chartWindow}-${chartEntries.length}`}
            />
          )}
          {entries.length === 0 && (
            <p className="text-center font-pixel-mono text-base leading-snug text-ink-muted">
              Solo tienes tu punto de partida. Registra tu peso actual para ver
              la evolucion.
            </p>
          )}
        </div>
      )}
    </section>
  );
};
