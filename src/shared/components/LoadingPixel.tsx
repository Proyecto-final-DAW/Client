type Props = {
  label?: string;
};

/**
 * Critical-path loading indicator. Mounted by the root `<Suspense>`
 * fallback, so it must be on the first-paint bundle. The earlier
 * implementation imported `framer-motion` (~127KB) just to blink three
 * dots — the entire point of code splitting was undone for the very
 * first frame the user saw. CSS keyframes do the same animation in
 * zero JS.
 *
 * `role="status"` + `aria-live="polite"` makes screen readers announce
 * "Cargando" when the component appears (and silently update on label
 * change). Reduced-motion users see static dots — the `@media`
 * keyframe override fires automatically.
 */
export const LoadingPixel = (props: Props): React.JSX.Element => {
  const label = props.label ?? 'CARGANDO';
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex min-h-[60vh] items-center justify-center"
    >
      <p className="font-pixel text-sm sm:text-base tracking-widest text-green-400 [text-shadow:2px_2px_0_#000,0_0_16px_rgba(34,197,94,0.55)]">
        {label}
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="loading-pixel-dot inline-block"
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            .
          </span>
        ))}
      </p>
      <style>{`
        @keyframes loadingPixelBlink {
          0%, 100% { opacity: 0; }
          16%, 50% { opacity: 1; }
        }
        .loading-pixel-dot {
          animation: loadingPixelBlink 1.2s infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .loading-pixel-dot {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
