import { motion, useReducedMotion } from 'framer-motion';

type Props = {
  label?: string;
};

export const LoadingPixel = (props: Props): React.JSX.Element => {
  const label = props.label ?? 'CARGANDO';
  // Respect prefers-reduced-motion: a permanently-blinking dot
  // sequence is exactly the kind of repeating animation the
  // accessibility setting is meant to silence. When reduced motion
  // is requested we render the dots statically.
  const reducedMotion = useReducedMotion() ?? false;

  return (
    // role="status" + aria-live makes screen readers announce
    // "Cargando" when the spinner appears (and silently update if the
    // label changes). Without it, blind users got no signal that an
    // async action was in flight.
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex min-h-[60vh] items-center justify-center"
    >
      <p className="font-pixel text-sm sm:text-base tracking-widest text-green-400 [text-shadow:2px_2px_0_#000,0_0_16px_rgba(34,197,94,0.55)]">
        {label}
        {[0, 1, 2].map((i) => {
          if (reducedMotion) return <span key={i}>.</span>;
          return (
            <motion.span
              key={i}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                times: [0, 0.2, 0.6, 1],
              }}
            >
              .
            </motion.span>
          );
        })}
      </p>
    </div>
  );
};
