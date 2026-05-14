import { PixelCorners } from './PixelCorners';

type Props = {
  message: string;
  onRetry?: () => void;
};

/**
 * Critical-path error fallback. Like LoadingPixel, this lives on the
 * first-paint bundle (it's the ErrorBoundary's render), so importing
 * `framer-motion` here just for an entrance scale was a 127KB tax
 * paid by every user. The CSS animation respects reduced-motion via
 * the `@media` rule so the previous reduce-motion guard is preserved.
 */
export const ErrorState = (props: Props): React.JSX.Element => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="error-state-card relative max-w-md border-2 border-red-500/50 bg-card px-8 py-6">
        <PixelCorners className="border-red-500/50" />
        <p className="mb-3 font-pixel text-[10px] tracking-widest text-red-400 [text-shadow:2px_2px_0_#000,0_0_12px_rgba(239,68,68,0.45)]">
          ✕ ERROR
        </p>
        {/* role="alert" so screen readers announce the message when
            this component appears. */}
        <p
          role="alert"
          className="font-pixel-mono text-xl leading-snug text-zinc-200"
        >
          {props.message}
        </p>
        {props.onRetry && (
          <button
            type="button"
            onClick={props.onRetry}
            className="mt-4 border-b-4 border-green-700 bg-green-500 px-4 py-2.5 font-pixel text-[9px] text-[#0a0a0f] shadow-[0_0_14px_rgba(34,197,94,0.35)] transition-all duration-150 hover:border-green-600 hover:bg-green-400 active:mt-[1.0625rem] active:border-b-0"
          >
            ▶ REINTENTAR
          </button>
        )}
      </div>
      <style>{`
        @keyframes errorStateEnter {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .error-state-card {
          animation: errorStateEnter 0.2s ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .error-state-card {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};
