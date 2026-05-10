import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';

import { AsyncState } from '../../../shared/components/AsyncState';
import { ErrorState } from '../../../shared/components/ErrorState';
import { LoadingPixel } from '../../../shared/components/LoadingPixel';
import { useAuth } from '../../../context/hooks/useAuth';
import { useStats } from '../../stats/ui/hooks/useStats';
import { ExerciseProgressChart } from './components/ExerciseProgressChart';
import { ExerciseSelector } from './components/ExerciseSelector';
import { StatRadarChart } from './components/StatRadarChart';
import { WeightProgressContent } from './components/WeightProgressContent';
import { useExerciseProgress } from './hooks/useExerciseProgress';
import { usePerformedExercises } from './hooks/usePerformedExercises';
import { useStatsHistory } from './hooks/useStatsHistory';

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
  const {
    points,
    loading: loadingProgress,
    error: progressError,
  } = useExerciseProgress(selectedId);

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

      {/* TECNICO — collapsed by default. Useful for users tracking PRs
          on a specific exercise; not the headline. */}
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
          <span>◆ TECNICO · PROGRESION POR EJERCICIO</span>
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
                  <div className="mb-5">
                    <ExerciseSelector
                      exercises={exercises}
                      selectedId={selectedId}
                      onChange={setSelectedId}
                    />
                  </div>

                  {loadingProgress ? (
                    <LoadingPixel label="CARGANDO PROGRESION" />
                  ) : progressError ? (
                    <ErrorState message={progressError} />
                  ) : (
                    <ExerciseProgressChart points={points} />
                  )}
                </>
              )}
            </AsyncState>
          </div>
        )}
      </section>
    </section>
  );
};
