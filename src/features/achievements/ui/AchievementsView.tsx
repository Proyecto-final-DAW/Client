import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';

import { AsyncState } from '../../../shared/components/AsyncState';
import type { Milestone } from '../core/domain/models/Milestone';
import { MilestoneCard } from './components/MilestoneCard';
import { useMilestones } from './hooks/useMilestones';

const PAGE_SIZE = 8;

const sortMilestones = (milestones: Milestone[]): Milestone[] =>
  [...milestones].sort((a, b) => {
    if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
    if (a.unlocked && b.unlocked) {
      const at = a.unlockedAt ? Date.parse(a.unlockedAt) : 0;
      const bt = b.unlockedAt ? Date.parse(b.unlockedAt) : 0;
      return bt - at;
    }
    return 0;
  });

export const AchievementsView = (): React.JSX.Element => {
  const { milestones, loading, error, refetch } = useMilestones();
  const [page, setPage] = useState(0);

  // Reset to page 0 if the milestones list changes (refetch, etc.) so
  // we never strand the user on page 5 of a list that just shrank.
  useEffect(() => {
    setPage(0);
  }, [milestones]);

  return (
    <AsyncState
      loading={loading}
      error={error}
      data={milestones}
      onRetry={refetch}
      empty={(m) => m.every((milestone) => !milestone.unlocked)}
      loadingLabel="CARGANDO LOGROS"
      emptyIcon="🏆"
      emptyTitle="Sin logros"
      emptyDescription="Completa tu primer entreno para desbloquear logros."
      emptyCta={{ label: 'Ir a entrenar', to: '/routines' }}
    >
      {(milestones) => {
        const unlockedCount = milestones.filter((m) => m.unlocked).length;
        const sorted = sortMilestones(milestones);

        const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
        const safePage = Math.min(page, totalPages - 1);
        const start = safePage * PAGE_SIZE;
        const visible = sorted.slice(start, start + PAGE_SIZE);

        const goPrev = (): void => setPage((p) => Math.max(0, p - 1));
        const goNext = (): void =>
          setPage((p) => Math.min(totalPages - 1, p + 1));

        return (
          <div className="mx-auto max-w-4xl text-ink">
            <header className="mb-6">
              <p className="font-pixel text-[9px] tracking-widest text-green-500">
                ▶ LOGROS
              </p>
              <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
                <h1 className="font-pixel text-base sm:text-lg tracking-widest text-green-400 [text-shadow:0_0_16px_rgba(34,197,94,0.55)]">
                  HALL OF FAME
                </h1>
                <p className="font-pixel text-[10px] tracking-widest text-ink-muted">
                  <span className="text-green-400">{unlockedCount}</span>
                  <span className="mx-1 text-ink-disabled">/</span>
                  <span>{milestones.length}</span>
                  <span className="ml-2 text-ink-faint">DESBLOQUEADOS</span>
                </p>
              </div>
            </header>

            {/* 2-col grid (was 3 on lg). Wider cards mean descriptions
                fit on 1-2 lines instead of wrapping awkwardly across
                4-5 narrow lines. */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {visible.map((milestone) => (
                <MilestoneCard key={milestone.id} milestone={milestone} />
              ))}
            </div>

            {/* Pager — same pattern as TemplatePaginatedBrowser so the
                muscle memory transfers between sections. Hidden when
                only one page exists. */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={safePage === 0}
                  aria-label="Pagina anterior"
                  className="inline-flex h-10 w-10 items-center justify-center border-2 border-green-500/40 bg-page text-green-400 transition-all hover:border-green-400 hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-green-500/40 disabled:hover:bg-page"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>

                <span className="min-w-[5rem] text-center font-pixel text-[10px] tracking-widest text-green-400">
                  {safePage + 1} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={goNext}
                  disabled={safePage === totalPages - 1}
                  aria-label="Pagina siguiente"
                  className="inline-flex h-10 w-10 items-center justify-center border-2 border-green-500/40 bg-page text-green-400 transition-all hover:border-green-400 hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-green-500/40 disabled:hover:bg-page"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        );
      }}
    </AsyncState>
  );
};
