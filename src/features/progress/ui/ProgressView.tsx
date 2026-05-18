import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { PixelSelect } from '@shared/components/PixelSelect';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '../../../context/hooks/useAuth';
import { AsyncState } from '../../../shared/components/AsyncState';
import { ErrorState } from '../../../shared/components/ErrorState';
import { LoadingPixel } from '../../../shared/components/LoadingPixel';
import { useStats } from '../../stats/ui/hooks/useStats';
import { ExerciseProgressChart } from './components/ExerciseProgressChart';
import { ExerciseSelector } from './components/ExerciseSelector';
import { ProgressIntroModal } from './components/ProgressIntroModal';
import { StatRadarChart } from './components/StatRadarChart';
import { WeightProgressContent } from './components/WeightProgressContent';
import { useExerciseProgress } from './hooks/useExerciseProgress';
import { usePerformedExercises } from './hooks/usePerformedExercises';
import { useStatsHistory } from './hooks/useStatsHistory';

// Time-window options for the per-exercise progression chart. Same
// shape as the weight chart's selector to keep the two progress widgets
// reading as one family of controls.
type ExerciseWindow = '1m' | '3m' | '6m' | '1y' | 'all';
const EXERCISE_WINDOW_DAYS: Record<ExerciseWindow, number | null> = {
  '1m': 30,
  '3m': 90,
  '6m': 180,
  '1y': 365,
  'all': null,
};
const EXERCISE_WINDOW_OPTIONS: { value: ExerciseWindow; label: string }[] = [
  { value: '1m', label: 'ULTIMO MES' },
  { value: '3m', label: 'ULTIMOS 3M' },
  { value: '6m', label: 'ULTIMOS 6M' },
  { value: '1y', label: 'ULTIMO AÑO' },
  { value: 'all', label: 'TODO' },
];

export const ProgressView = (): React.JSX.Element => {
  const { user } = useAuth();
  const { stats, loading: loadingStats, error: statsError } = useStats();
  // Surface history loading/error too — the radar's comparison
  // selector ("AHORA / HACE 30D / INICIO") is silent if the snapshot
  // fetch fails: dropping the error meant a 500 looked identical to
  // "no past sessions", which is misleading for a returning user.
  const {
    history,
    loading: loadingHistory,
    error: historyError,
  } = useStatsHistory();
  // Account age drives which time-window options the radar exposes —
  // showing "HACE 30D" on a 2-day-old account would always fall back
  // to the first snapshot, which is misleading. Memoized: useStats /
  // useStatsHistory / usePerformedExercises all bump state independently
  // and the IIFE re-parsed the same `created_at` 4-5 times per render.
  const accountCreatedAt = useMemo((): Date | null => {
    if (!user?.created_at) return null;
    const parsed = new Date(user.created_at);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [user?.created_at]);
  const {
    exercises,
    loading: loadingExercises,
    error: exercisesError,
  } = usePerformedExercises();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [exerciseWindow, setExerciseWindow] = useState<ExerciseWindow>('all');
  const {
    points,
    loading: loadingProgress,
    error: progressError,
  } = useExerciseProgress(selectedId);

  // Apply the active time-window filter to the per-exercise PR series.
  // The points carry an ISO `YYYY-MM-DD` date string; comparing strings
  // is safe because the format is lexicographically sortable.
  const filteredPoints = useMemo(() => {
    const days = EXERCISE_WINDOW_DAYS[exerciseWindow];
    if (days === null) return points;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const pad = (n: number): string => String(n).padStart(2, '0');
    const cutoffISO = `${cutoff.getFullYear()}-${pad(cutoff.getMonth() + 1)}-${pad(cutoff.getDate())}`;
    return points.filter((p) => p.date >= cutoffISO);
  }, [points, exerciseWindow]);

  // Per-exercise PR chart still has value for serious users tracking
  // weight progression on a single move, but the headline visuals
  // (radar + body weight) carry the page on their own — fold this so
  // the default view stays calm.
  const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedId && exercises.length > 0) {
      setSelectedId(exercises[0].id);
    }
  }, [exercises, selectedId]);

  // One-time progress explainer — per-user localStorage flag.
  const progressIntroStorageKey =
    user?.id != null ? `progress_intro_seen_${user.id}` : null;

  const [progressIntroDismissed, setProgressIntroDismissed] = useState(
    () =>
      progressIntroStorageKey !== null &&
      localStorage.getItem(progressIntroStorageKey) === '1'
  );

  useEffect(() => {
    if (progressIntroStorageKey === null) {
      setProgressIntroDismissed(true);
      return;
    }
    setProgressIntroDismissed(
      localStorage.getItem(progressIntroStorageKey) === '1'
    );
  }, [progressIntroStorageKey]);

  const showProgressIntro =
    progressIntroStorageKey !== null && !progressIntroDismissed;

  const handleDismissProgressIntro = (): void => {
    if (progressIntroStorageKey !== null) {
      localStorage.setItem(progressIntroStorageKey, '1');
    }
    setProgressIntroDismissed(true);
  };

  return (
    <section className="mx-auto max-w-5xl text-ink">
      <header className="mb-6">
        <h1 className="font-pixel text-base sm:text-lg tracking-widest text-green-400 [text-shadow:0_0_16px_rgba(34,197,94,0.55)]">
          PROGRESO
        </h1>
      </header>

      {/* Radar + body weight side-by-side on desktop. The previous
          single-column flow stacked two heavy cards vertically, leaving
          the page feeling long and sparse — the radar especially read
          as filler when the user only had one or two sessions logged.
          Two-up keeps both visuals at a glance and uses the available
          width. */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="relative border-2 border-green-500/40 bg-card p-3">
          {loadingStats || loadingHistory ? (
            <LoadingPixel label="CARGANDO STATS" />
          ) : statsError ? (
            <ErrorState message={statsError} />
          ) : historyError ? (
            <ErrorState message={historyError} />
          ) : stats ? (
            <StatRadarChart
              stats={stats}
              history={history}
              accountCreatedAt={accountCreatedAt}
              title="STATS"
            />
          ) : (
            <p className="font-pixel-mono text-base text-ink-faint">
              Sin datos de stats todavia.
            </p>
          )}
        </section>

        <WeightProgressContent />
      </div>

      {/* Per-exercise progression — collapsed by default. Useful for users
          tracking PRs on a specific exercise; not the headline. */}
      <section
        className={`relative mt-6 border-2 transition-colors ${
          advancedOpen
            ? 'border-green-500/30 bg-card'
            : 'border-border bg-card/60'
        }`}
      >
        <button
          type="button"
          onClick={() => setAdvancedOpen((open) => !open)}
          aria-expanded={advancedOpen}
          className="w-full flex items-center justify-between px-4 py-3 font-pixel text-[10px] tracking-widest text-ink-muted hover:text-green-400 transition-colors"
        >
          <span>PROGRESION POR EJERCICIO</span>
          {advancedOpen ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </button>

        {advancedOpen && (
          <div className="border-t-2 border-border/80 px-4 pb-5 pt-4">
            <AsyncState
              loading={loadingExercises}
              error={exercisesError}
              data={exercises}
              empty={(e) => e.length === 0}
              loadingLabel="CARGANDO EJERCICIOS"
              emptyTitle="Sin ejercicios con peso"
              emptyDescription="Aun no has hecho ningun ejercicio con pesas. La progresion solo aparece para movimientos con carga externa."
              emptyCta={{ label: 'Empezar sesion', to: '/routines' }}
            >
              {(exercises) => (
                <>
                  {(() => {
                    // Mirror the radar's gating: only expose windows
                    // whose lookback the data actually reaches. With
                    // three days of points the dropdown used to show
                    // "ULTIMO AÑO" / "ULTIMOS 6M" — every pick just
                    // returned the same chart. Hidden entirely when
                    // only "TODO" remains, so the row collapses to
                    // just the exercise picker.
                    const oldestPoint = points[0];
                    const daysOfHistory = oldestPoint
                      ? Math.floor(
                          (Date.now() - new Date(oldestPoint.date).getTime()) /
                            86_400_000
                        )
                      : 0;
                    const visibleWindowOptions = EXERCISE_WINDOW_OPTIONS.filter(
                      (option) => {
                        if (option.value === 'all') return true;
                        const days = EXERCISE_WINDOW_DAYS[option.value];
                        return days !== null && daysOfHistory >= days;
                      }
                    );
                    return (
                      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <ExerciseSelector
                          exercises={exercises}
                          selectedId={selectedId}
                          onChange={setSelectedId}
                        />
                        {visibleWindowOptions.length > 1 && (
                          <PixelSelect
                            value={exerciseWindow}
                            options={visibleWindowOptions}
                            placeholder="TODO"
                            onChange={(value) =>
                              setExerciseWindow(value as ExerciseWindow)
                            }
                            ariaLabel="Ventana de tiempo del ejercicio"
                            className="w-36 self-start sm:self-auto"
                          />
                        )}
                      </div>
                    );
                  })()}

                  {loadingProgress ? (
                    <LoadingPixel label="CARGANDO PROGRESION" />
                  ) : progressError ? (
                    <ErrorState message={progressError} />
                  ) : (
                    // `key` forces a fresh mount whenever the user
                    // swaps exercise or time window. Recharts would
                    // otherwise tween the line + dot positions from
                    // the old dataset to the new one, which read as
                    // the chart "warping" from one shape to another
                    // before the intro draw could fire. A clean
                    // unmount + remount plays the proper draw
                    // animation from scratch every time.
                    <ExerciseProgressChart
                      points={filteredPoints}
                      key={`${selectedId ?? ''}-${exerciseWindow}-${filteredPoints.length}`}
                    />
                  )}
                </>
              )}
            </AsyncState>
          </div>
        )}
      </section>

      <ProgressIntroModal
        open={showProgressIntro}
        onClose={handleDismissProgressIntro}
      />
    </section>
  );
};
