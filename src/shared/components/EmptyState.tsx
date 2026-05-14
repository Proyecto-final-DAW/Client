import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { PixelCorners } from './PixelCorners';

type Cta =
  | { label: string; to: string }
  | { label: string; onClick: () => void };

type Props = {
  icon?: ReactNode;
  title: string;
  description?: string;
  cta?: Cta;
  /** Secondary action rendered next to (or below on small screens) the primary CTA. */
  secondaryCta?: Cta;
};

const PRIMARY_CTA =
  'inline-block border-b-4 border-green-700 bg-green-500 px-4 py-2.5 font-pixel text-[9px] text-[#0a0a0f] shadow-[0_0_14px_rgba(34,197,94,0.35)] transition-all duration-150 hover:border-green-600 hover:bg-green-400 active:mt-[1.0625rem] active:border-b-0';

const SECONDARY_CTA =
  'inline-block border-2 border-border-muted bg-card px-4 py-3 font-pixel text-[9px] tracking-widest text-ink-muted hover:border-green-500/50 hover:text-green-400 transition-colors';

const renderCta = (cta: Cta, className: string) => {
  const label = (
    <>
      <span aria-hidden="true">▶ </span>
      {cta.label.toUpperCase()}
    </>
  );
  return 'to' in cta ? (
    <Link to={cta.to} className={className}>
      {label}
    </Link>
  ) : (
    <button type="button" onClick={cta.onClick} className={className}>
      {label}
    </button>
  );
};

/**
 * Critical-path empty state. Rendered by `AsyncState` on every list
 * page, so it lives on the first interactive frame for any route the
 * user visits. The earlier implementation pulled in framer-motion
 * (~127kB minified+gz) just to fade-and-scale the card on mount —
 * undoing the code splitting we did everywhere else. CSS keyframes do
 * the same animation in zero JS, with `prefers-reduced-motion`
 * automatically suppressed.
 */
export const EmptyState = (props: Props): React.JSX.Element => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="empty-state-card relative max-w-md border-2 border-zinc-700 bg-card px-8 py-6 text-center">
        <PixelCorners className="border-zinc-700" />
        {props.icon && (
          <div
            className="mb-3 text-3xl [image-rendering:pixelated]"
            aria-hidden="true"
          >
            {props.icon}
          </div>
        )}
        <p className="mb-3 font-pixel text-[10px] tracking-widest text-zinc-400 [text-shadow:2px_2px_0_#000]">
          {props.title.toUpperCase()}
        </p>
        {props.description && (
          <p className="font-pixel-mono text-xl leading-snug text-zinc-300">
            {props.description}
          </p>
        )}
        {(props.cta || props.secondaryCta) && (
          // Layout order: secondary on the LEFT, primary (green) on
          // the RIGHT. This is the macOS/iOS convention — the eye
          // settles on the rightmost button as the recommended next
          // step, while leaving the alternative within reach. The
          // earlier left-primary order put the destructive-or-
          // alternative action where the user instinctively tapped.
          <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            {props.secondaryCta && renderCta(props.secondaryCta, SECONDARY_CTA)}
            {props.cta && renderCta(props.cta, PRIMARY_CTA)}
          </div>
        )}
      </div>
      <style>{`
        @keyframes emptyStateEnter {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        .empty-state-card {
          animation: emptyStateEnter 200ms ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .empty-state-card { animation: none; }
        }
      `}</style>
    </div>
  );
};
