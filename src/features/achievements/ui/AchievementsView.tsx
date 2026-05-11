import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';

import { AsyncState } from '../../../shared/components/AsyncState';
import type { Milestone } from '../core/domain/models/Milestone';
import { MilestoneCard } from './components/MilestoneCard';
import { useMilestones } from './hooks/useMilestones';

// Page size adapts to the column count of the current breakpoint so
// the last row is always full — no orphan card hanging alone:
//
//   mobile  (1 col)  → 4 per page  (4 rows × 1)
//   tablet  (2 cols) → 6 per page  (3 rows × 2)
//   desktop (3 cols) → 9 per page  (3 rows × 3)
//
// 4 on mobile draws the "stop the infinite scroll" line: 9 stacked
// cards stretched the page to ~1800 px. On wide monitors the cards
// themselves grow (via the parent's max-w-7xl) so the screen still
// fills out without breaking the layout's mental model.
const PAGE_SIZE_DESKTOP = 9;
const PAGE_SIZE_TABLET = 6;
const PAGE_SIZE_MOBILE = 4;

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
  // Default to desktop on the first render so SSR/hydration matches
  // the markup the test render emits. The matchMedia effect below
  // immediately corrects to whatever the actual viewport is.
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DESKTOP);

  // Tracks the viewport via matchMedia. Doing this in JS (not just
  // CSS responsive grid) is necessary because the page slice itself
  // depends on the column count — purely-CSS responsiveness would
  // still hand 9 cards to a 1-column phone.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const lg = window.matchMedia('(min-width: 1024px)');
    const sm = window.matchMedia('(min-width: 640px)');
    const sync = () => {
      if (lg.matches) setPageSize(PAGE_SIZE_DESKTOP);
      else if (sm.matches) setPageSize(PAGE_SIZE_TABLET);
      else setPageSize(PAGE_SIZE_MOBILE);
    };
    sync();
    lg.addEventListener('change', sync);
    sm.addEventListener('change', sync);
    return () => {
      lg.removeEventListener('change', sync);
      sm.removeEventListener('change', sync);
    };
  }, []);

  // Reset to page 0 if the milestones list changes (refetch, etc.) so
  // we never strand the user on page 5 of a list that just shrank.
  useEffect(() => {
    setPage(0);
  }, [milestones]);

  // Same defensive reset when the breakpoint flips: a user on page 3
  // of 4 in mobile (4 per page) who rotates to landscape (6 per
  // page) would otherwise stay on a now-out-of-range page.
  useEffect(() => {
    setPage(0);
  }, [pageSize]);

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

        const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
        const safePage = Math.min(page, totalPages - 1);
        const start = safePage * pageSize;
        const visible = sorted.slice(start, start + pageSize);

        const goPrev = (): void => setPage((p) => Math.max(0, p - 1));
        const goNext = (): void =>
          setPage((p) => Math.min(totalPages - 1, p + 1));

        return (
          <div className="mx-auto max-w-7xl text-ink">
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

            {/* Phone: 1 col (full readability). Tablet: 2 cols. Desktop:
                3 cols — once the description switched from Press Start 2P
                to VT323 (font-pixel-mono), the line fits ~32 chars at
                3-col width on lg, which is plenty for the short
                achievement descriptions ("100 kg acumulados", "5 dias
                seguidos"). 2 cols on a 1280px screen left the right rail
                noticeably empty. */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
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
