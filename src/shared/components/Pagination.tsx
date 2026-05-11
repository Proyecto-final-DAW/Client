import { useEffect, useMemo, useState } from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  ariaLabel?: string;
}

const DOTS = 'dots' as const;
type PageItem = number | typeof DOTS;

/**
 * Windowed page list with ellipses. Builds the visible range from a
 * "siblings" budget — how many neighbours to show on each side of
 * the current page — plus the first and last as boundaries. Standard
 * approach borrowed from Mantine; tuned here so:
 *
 *   - siblings = 0 on mobile renders at most `1 ... 8 ... 15`
 *     (3 number cells + 2 dots), which fits a 360-px viewport with
 *     32-px buttons and small gaps.
 *   - siblings = 1 on desktop renders at most `1 ... 7 8 9 ... 15`
 *     (5 number cells + 2 dots), which is the comfortable density on
 *     a wide screen.
 *
 * The previous flat "1 2 3 4 5 ... 15" list wrapped onto three rows on
 * mobile and dwarfed the actual results.
 */
const buildPageItems = (
  current: number,
  total: number,
  siblings: number
): PageItem[] => {
  // first + last + current + 2 ellipses + 2*siblings = the maximum
  // distinct cells the windowed view ever needs. If the total is at
  // or below that, just list every page — ellipses would only add
  // visual noise for no compression gain.
  const maxCells = siblings * 2 + 5;
  if (total <= maxCells) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(current - siblings, 1);
  const rightSibling = Math.min(current + siblings, total);

  // Show left/right ellipsis only when there's a real gap (>= 2
  // between the boundary and the sibling). Otherwise the dots would
  // visually replace a single skipped page, which is uglier than
  // just rendering it.
  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < total - 1;

  if (!showLeftDots && showRightDots) {
    // Anchored at the start: 1 2 3 ... N
    const leftCount = 3 + 2 * siblings;
    const left = Array.from({ length: leftCount }, (_, i) => i + 1);
    return [...left, DOTS, total];
  }

  if (showLeftDots && !showRightDots) {
    // Anchored at the end: 1 ... N-2 N-1 N
    const rightCount = 3 + 2 * siblings;
    const right = Array.from(
      { length: rightCount },
      (_, i) => total - rightCount + 1 + i
    );
    return [1, DOTS, ...right];
  }

  // Floating in the middle: 1 ... C-1 C C+1 ... N
  const middle = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, i) => leftSibling + i
  );
  return [1, DOTS, ...middle, DOTS, total];
};

export const Pagination = (props: PaginationProps): React.JSX.Element | null => {
  const { page, totalPages, onPageChange } = props;

  // Drop a sibling on mobile to keep the row to a single line at
  // 360-px viewports. matchMedia avoids any layout-time guesswork —
  // we always render whatever siblings the current breakpoint
  // actually allows.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 639px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const siblings = isMobile ? 0 : 1;
  const items = useMemo(
    () => buildPageItems(page, totalPages, siblings),
    [page, totalPages, siblings]
  );

  if (totalPages <= 1) return null;

  const cellSize =
    'inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center font-pixel text-[9px] sm:text-[10px] tracking-widest border-2 transition-colors';

  return (
    <nav
      aria-label={props.ariaLabel ?? 'Paginacion'}
      className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Pagina anterior"
        className={`${cellSize} border-border-muted bg-card text-ink-muted hover:border-green-500/40 hover:text-green-400 disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        ◀
      </button>

      {items.map((item, idx) => {
        if (item === DOTS) {
          // Aria-hidden because screen readers don't need to hear "dots
          // dots dots" — the boundary numbers carry the same info.
          return (
            <span
              key={`dots-${idx}`}
              aria-hidden="true"
              className={`${cellSize} border-transparent text-ink-faint`}
            >
              …
            </span>
          );
        }
        const active = item === page;
        return (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-label={`Pagina ${item}`}
            aria-current={active ? 'page' : undefined}
            className={`${cellSize} ${
              active
                ? 'border-green-500 bg-green-500/10 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                : 'border-border-muted bg-card text-ink-muted hover:border-green-500/40 hover:text-green-400'
            }`}
          >
            {item}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Pagina siguiente"
        className={`${cellSize} border-border-muted bg-card text-ink-muted hover:border-green-500/40 hover:text-green-400 disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        ▶
      </button>
    </nav>
  );
};
